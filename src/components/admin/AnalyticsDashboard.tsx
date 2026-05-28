// src/components/admin/AnalyticsDashboard.tsx
"use client";

import React, { useState } from "react";

export default function AnalyticsDashboard() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Premium mock dataset representing platform growth
  const uploadsData = [
    { day: "Mon", count: 12 },
    { day: "Tue", count: 19 },
    { day: "Wed", count: 15 },
    { day: "Thu", count: 28 },
    { day: "Fri", count: 32 },
    { day: "Sat", count: 22 },
    { day: "Sun", count: 45 },
  ];

  const claimsData = [
    { status: "Pending", count: 14, color: "from-amber-400 to-orange-500" },
    { status: "Approved", count: 38, color: "from-emerald-400 to-teal-500" },
    { status: "Rejected", count: 8, color: "from-rose-400 to-red-500" },
  ];

  const stats = [
    { label: "Total Uploads", value: "173", change: "+12.5%", color: "text-blue-600 dark:text-blue-400" },
    { label: "Claim Success Rate", value: "73%", change: "+4.2%", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Avg. Resolution Time", value: "4.8 hrs", change: "-18%", color: "text-indigo-600 dark:text-indigo-400" },
  ];

  // Calculations for Area Chart
  const maxVal = Math.max(...uploadsData.map(d => d.count)) * 1.1;
  const width = 500;
  const height = 200;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = uploadsData.map((d, i) => {
    const x = padding + (i / (uploadsData.length - 1)) * chartWidth;
    const y = height - padding - (d.count / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="space-y-6">
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-6 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01]">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</span>
              <span className={`text-xs font-medium ${s.change.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}>
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Area Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Document Upload Activity</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">Weekly progression of newly found documents</p>
          </div>
          <div className="relative w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = padding + ratio * chartHeight;
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    className="stroke-slate-100 dark:stroke-slate-800/60"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area */}
              <path d={areaPath} fill="url(#areaGrad)" className="transition-all duration-300" />

              {/* Path Line */}
              <path
                d={linePath}
                fill="none"
                className="stroke-indigo-600 dark:stroke-indigo-400"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {points.map((p, i) => (
                <g key={i} className="group cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === i ? "6" : "4"}
                    className="fill-indigo-600 dark:fill-indigo-400 stroke-white dark:stroke-slate-950 transition-all duration-200"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {hoveredPoint === i && (
                    <g transform={`translate(${p.x - 30}, ${p.y - 35})`}>
                      <rect width="60" height="24" rx="4" className="fill-slate-900/90 dark:fill-slate-50/95" />
                      <text
                        x="30"
                        y="15"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-white dark:fill-slate-950"
                      >
                        {p.count} uploads
                      </text>
                    </g>
                  )}
                </g>
              ))}

              {/* X Axis Labels */}
              {points.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-400 dark:fill-slate-500"
                >
                  {p.day}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Dynamic Bar Chart */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Claims Status Breakdown</h4>
            <p className="text-xs text-slate-400 dark:text-slate-500">Distribution of claims submitted by type</p>
          </div>
          <div className="flex flex-col gap-4">
            {claimsData.map((c, i) => {
              const maxClaims = Math.max(...claimsData.map(cd => cd.count));
              const pct = (c.count / maxClaims) * 100;
              return (
                <div
                  key={i}
                  className="space-y-1.5"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">{c.status}</span>
                    <span className="text-slate-900 dark:text-white">{c.count} claims</span>
                  </div>
                  <div className="relative w-full h-3.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className={`h-full rounded-full bg-gradient-to-r ${c.color} transition-all duration-500 ${
                        hoveredBar === i ? "brightness-110" : ""
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
