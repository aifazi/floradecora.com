import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';

type SendOpts = { to: string; subject: string; body: string; template?: string; payload?: unknown };

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private interval?: NodeJS.Timeout;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // poll queue every 10s
    this.interval = setInterval(() => this.processQueue().catch((e) => this.logger.error(e)), 10000);
    // also run once after 2s
    setTimeout(() => this.processQueue().catch(() => {}), 2000);
  }

  onModuleDestroy() {
    if (this.interval) clearInterval(this.interval);
  }

  async getActiveProvider() {
    const active = await this.prisma.emailProvider.findFirst({ where: { active: true } });
    if (active) return active;
    // fallback to env
    if (process.env.RESEND_API_KEY) return { provider: 'resend', config: { apiKey: process.env.RESEND_API_KEY, from: process.env.EMAIL_FROM || 'noreply@floradecora.com' }, active: true } as never;
    if (process.env.BREVO_API_KEY) return { provider: 'brevo', config: { apiKey: process.env.BREVO_API_KEY, from: process.env.EMAIL_FROM || 'noreply@floradecora.com' }, active: true } as never;
    if (process.env.SMTP_HOST) return { provider: 'smtp', config: { host: process.env.SMTP_HOST, port: parseInt(process.env.SMTP_PORT || '587'), user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, from: process.env.EMAIL_FROM || 'noreply@floradecora.com' }, active: true } as never;
    return null;
  }

  async enqueue(opts: SendOpts) {
    const provider = await this.getActiveProvider();
    const providerName = provider?.provider || 'smtp';
    const queue = await this.prisma.emailQueue.create({
      data: { to: opts.to, subject: opts.subject, body: opts.body, provider: providerName, status: 'queued' },
    });
    await this.prisma.emailLog.create({
      data: { to: opts.to, subject: opts.subject, provider: providerName, template: opts.template, status: 'queued', payload: opts.payload as never, attempts: 0 },
    });
    // try immediate processing
    this.processQueue().catch(() => {});
    return queue;
  }

  async sendDirect(opts: SendOpts): Promise<{ messageId?: string }> {
    const provider = await this.getActiveProvider();
    if (!provider) {
      this.logger.warn('No email provider configured, logging only');
      return {};
    }
    const p = provider.provider as string;
    const cfg = provider.config as Record<string, string>;

    if (p === 'smtp') {
      const transporter = nodemailer.createTransport({
        host: cfg.host,
        port: parseInt(cfg.port || '587'),
        secure: cfg.secure === 'true' || cfg.port === '465',
        auth: cfg.user ? { user: cfg.user, pass: cfg.pass } : undefined,
      });
      const info = await transporter.sendMail({ from: cfg.from || 'noreply@floradecora.com', to: opts.to, subject: opts.subject, html: opts.body, text: opts.body.replace(/<[^>]*>/g, '') });
      return { messageId: info.messageId };
    }
    if (p === 'resend') {
      const resend = new Resend(cfg.apiKey);
      const res = await resend.emails.send({ from: cfg.from || 'onboarding@resend.dev', to: opts.to, subject: opts.subject, html: opts.body });
      if (res.error) throw new Error(res.error.message);
      return { messageId: res.data?.id };
    }
    if (p === 'brevo') {
      const { default: axios } = await import('axios');
      const res = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        { sender: { email: cfg.from || 'noreply@floradecora.com' }, to: [{ email: opts.to }], subject: opts.subject, htmlContent: opts.body },
        { headers: { 'api-key': cfg.apiKey, 'content-type': 'application/json' } },
      );
      return { messageId: res.data?.messageId };
    }
    throw new Error(`Unknown provider ${p}`);
  }

  async processQueue() {
    const pending = await this.prisma.emailQueue.findMany({
      where: { status: { in: ['queued', 'retry'] }, OR: [{ nextRetry: null }, { nextRetry: { lte: new Date() } }] },
      take: 5,
      orderBy: { createdAt: 'asc' },
    });
    for (const job of pending) {
      try {
        const result = await this.sendDirect({ to: job.to, subject: job.subject, body: job.body });
        await this.prisma.emailQueue.update({ where: { id: job.id }, data: { status: 'sent', error: null } });
        await this.prisma.emailLog.updateMany({
          where: { to: job.to, subject: job.subject, status: 'queued' },
          data: { status: 'sent', messageId: result.messageId, attempts: job.attempts + 1 },
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        const attempts = job.attempts + 1;
        const shouldRetry = attempts < 3;
        await this.prisma.emailQueue.update({
          where: { id: job.id },
          data: { status: shouldRetry ? 'retry' : 'failed', attempts, error: msg, nextRetry: shouldRetry ? new Date(Date.now() + Math.pow(2, attempts) * 60000) : null },
        });
        await this.prisma.emailLog.updateMany({
          where: { to: job.to, subject: job.subject, status: 'queued' },
          data: { status: shouldRetry ? 'retry' : 'failed', error: msg, attempts },
        });
        this.logger.error(`Email failed to ${job.to}: ${msg}`);
      }
    }
  }

  // Admin helpers
  async listProviders() {
    return this.prisma.emailProvider.findMany({ orderBy: { provider: 'asc' } });
  }

  async upsertProvider(provider: string, config: unknown, active: boolean) {
    // if activating, deactivate others
    if (active) await this.prisma.emailProvider.updateMany({ where: { active: true }, data: { active: false } });
    return this.prisma.emailProvider.upsert({
      where: { provider },
      create: { provider, config: config as never, active },
      update: { config: config as never, active },
    });
  }

  async testProvider(provider: string) {
    const p = await this.prisma.emailProvider.findUnique({ where: { provider } });
    if (!p) throw new Error('Provider not found');
    // send test email to admin
    const admin = await this.prisma.user.findFirst();
    const to = admin?.email || 'test@example.com';
    return this.sendDirect({ to, subject: `Test via ${provider}`, body: `<p>Test email from FloraDecora via ${provider} at ${new Date().toISOString()}</p>` });
  }

  async listLogs(query: { status?: string; search?: string; take?: number; skip?: number }) {
    const where: Record<string, unknown> = {};
    if (query.status) where.status = query.status;
    if (query.search) where.to = { contains: query.search, mode: 'insensitive' };
    return this.prisma.emailLog.findMany({ where, orderBy: { createdAt: 'desc' }, take: query.take || 50, skip: query.skip || 0 });
  }

  async listQueue(status?: string) {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    return this.prisma.emailQueue.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  async retryQueue(id: string) {
    const job = await this.prisma.emailQueue.findUnique({ where: { id } });
    if (!job) throw new Error('Queue not found');
    await this.prisma.emailQueue.update({ where: { id }, data: { status: 'queued', nextRetry: null, error: null } });
    await this.prisma.emailLog.updateMany({ where: { to: job.to, subject: job.subject, status: { in: ['failed', 'retry'] } }, data: { status: 'queued' } });
    this.processQueue().catch(() => {});
    return job;
  }
}
