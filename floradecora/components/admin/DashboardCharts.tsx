"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

const COLORS = ["#C08A2E", "#16261C", "#7C9473", "#12160F", "#D4A574", "#586B51"];

export function InquiriesBar({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis hide />
        <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
        <Bar dataKey="count" fill="#C08A2E" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjectsPie({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie data={data} innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function EmailDonut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <PieChart>
        <Pie data={data} innerRadius={40} outerRadius={60} dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#10b981" : i === 1 ? "#f59e0b" : "#ef4444"} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function SubscribersArea({ data }: { data: { date: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={80}>
      <AreaChart data={data}>
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#16261C" fill="#16261C" fillOpacity={0.1} strokeWidth={2} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
