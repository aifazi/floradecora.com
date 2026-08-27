-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('queued', 'sent', 'failed', 'retry');

-- CreateTable
CREATE TABLE "email_providers" (
    "id" TEXT NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cdn_providers" (
    "id" TEXT NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "config" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cdn_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "to" VARCHAR(320) NOT NULL,
    "subject" VARCHAR(300) NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "template" VARCHAR(100),
    "status" "EmailStatus" NOT NULL DEFAULT 'queued',
    "payload" JSONB,
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "messageId" VARCHAR(200),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_queue" (
    "id" TEXT NOT NULL,
    "to" VARCHAR(320) NOT NULL,
    "subject" VARCHAR(300) NOT NULL,
    "body" TEXT NOT NULL,
    "provider" VARCHAR(20) NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'queued',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "next_retry" TIMESTAMP(3),
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_providers_provider_key" ON "email_providers"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "cdn_providers_provider_key" ON "cdn_providers"("provider");

-- CreateIndex
CREATE INDEX "email_logs_status_created_at_idx" ON "email_logs"("status", "created_at");

-- CreateIndex
CREATE INDEX "email_logs_to_idx" ON "email_logs"("to");

-- CreateIndex
CREATE INDEX "email_logs_provider_idx" ON "email_logs"("provider");

-- CreateIndex
CREATE INDEX "email_queue_status_next_retry_idx" ON "email_queue"("status", "next_retry");

-- CreateIndex
CREATE INDEX "email_queue_created_at_idx" ON "email_queue"("created_at");
