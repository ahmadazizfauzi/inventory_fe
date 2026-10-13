"use client";

import React, { useState, useMemo } from "react";
import { formatRupiah } from "@/lib/formatters";
import { TrendingUp, DollarSign, Calendar, Info } from "lucide-react";

export interface ValuationTrendPoint {
  date: string;
  label: string;
  asset_value: number;
  market_value: number;
  has_data?: boolean;
}

interface AssetValuationLineChartProps {
  data: ValuationTrendPoint[];
  isLoading?: boolean;
}

export default function AssetValuationLineChart({
  data = [],
  isLoading = false,
}: AssetValuationLineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Fallback demo points if data is empty
  const points = useMemo(() => {
    if (data && data.length > 0) return data;
    const today = new Date();
    return [
      {
        date: today.toISOString().split("T")[0],
        label: `${today.getDate()} ${today.toLocaleString("id-ID", { month: "short" })}`,
        asset_value: 0,
        market_value: 0,
        has_data: false,
      },
    ];
  }, [data]);

  // Compute SVG dimensions & scaling
  const width = 850;
  const height = 300;
  const padding = { top: 25, right: 35, bottom: 40, left: 75 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { minVal, maxVal, yTicks, xCoords } = useMemo(() => {
    let min = 0;
    let max = 0;

    points.forEach((p) => {
      if (p.asset_value > max) max = p.asset_value;
      if (p.market_value > max) max = p.market_value;
    });

    if (max === 0) max = 1000000; // minimum baseline
    // Add 15% headroom
    max = Math.ceil(max * 1.15);

    // 5 horizontal grid steps
    const step = max / 4;
    const ticks = [0, step, step * 2, step * 3, max];

    const coords = points.map((_, i) => {
      if (points.length === 1) return padding.left + chartWidth / 2;
      return padding.left + (i / Math.max(1, points.length - 1)) * chartWidth;
    });

    return { minVal: min, maxVal: max, yTicks: ticks, xCoords: coords };
  }, [points, chartWidth, padding.left]);

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    return padding.top + chartHeight - ratio * chartHeight;
  };

  // Build SVG path strings
  const assetPath = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xCoords[i]},${getY(p.asset_value)}`)
      .join(" ");
  }, [points, xCoords, minVal, maxVal, chartHeight]);

  const marketPath = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${xCoords[i]},${getY(p.market_value)}`)
      .join(" ");
  }, [points, xCoords, minVal, maxVal, chartHeight]);

  const assetAreaPath = useMemo(() => {
    if (points.length === 0) return "";
    const firstX = xCoords[0];
    const lastX = xCoords[xCoords.length - 1];
    const baseY = padding.top + chartHeight;
    return `${assetPath} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
  }, [assetPath, xCoords, padding.top, chartHeight]);

  const marketAreaPath = useMemo(() => {
    if (points.length === 0) return "";
    const firstX = xCoords[0];
    const lastX = xCoords[xCoords.length - 1];
    const baseY = padding.top + chartHeight;
    return `${marketPath} L ${lastX},${baseY} L ${firstX},${baseY} Z`;
  }, [marketPath, xCoords, padding.top, chartHeight]);

  // Active hover point data (only valid if hovered point has data)
  const activePoint =
    hoverIndex !== null && points[hoverIndex] && points[hoverIndex].has_data !== false
      ? points[hoverIndex]
      : null;

  // Format short rupiah for Y axis (e.g. 50 Jt or 500 Rb)
  const formatCompactRupiah = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Jt`;
    if (val >= 1_000) return `Rp ${(val / 1_000).toFixed(0)} Rb`;
    return `Rp ${val}`;
  };

  const chartTitle = useMemo(() => {
    const dataPointsCount = points.filter((p) => p.has_data !== false).length;
    if (dataPointsCount <= 1) {
      return "Tren Perbandingan Valuasi Aset (Data Terkini)";
    }
    return `Tren Perbandingan Valuasi Aset (${dataPointsCount} Hari Terakhir)`;
  }, [points]);

  return (
    <div
      className="p-4 rounded-3 border w-100 shadow-sm"
      style={{
        backgroundColor: "var(--app-surface)",
        borderColor: "var(--app-border)",
      }}
    >
      {/* Header and Legend */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              className="p-1.5 rounded-2 d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                color: "var(--app-primary)",
              }}
            >
              <TrendingUp size={16} />
            </span>
            <h5 className="m-0 fw-bold" style={{ color: "var(--app-text-primary)", fontSize: "16px" }}>
              {chartTitle}
            </h5>
          </div>
          <p className="m-0 text-muted" style={{ fontSize: "13px" }}>
            Pergerakan Nilai Modal Aset (HPP) vs Estimasi Nilai Jual Pasar berdasarkan rekam mutasi stok gudang.
          </p>
        </div>

        {/* Legend Indicators */}
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#6366f1",
              }}
            />
            <span className="small fw-semibold" style={{ color: "var(--app-text-primary)" }}>
              Modal Aset (HPP)
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
            <span className="small fw-semibold" style={{ color: "var(--app-text-primary)" }}>
              Nilai Jual Pasar
            </span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="position-relative w-100" style={{ overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-100"
          style={{ minWidth: 640, height: "auto", overflow: "visible" }}
        >
          <defs>
            {/* Gradients for Line Area Fills */}
            <linearGradient id="assetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines & Y Axis Labels */}
          {yTicks.map((tick, idx) => {
            const y = getY(tick);
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="var(--app-border)"
                  strokeDasharray={idx === 0 ? "none" : "4 4"}
                  strokeWidth="1"
                  opacity={0.7}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill="var(--app-text-muted)"
                  fontWeight="500"
                >
                  {formatCompactRupiah(tick)}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels: Show all labels if points <= 7, otherwise space evenly */}
          {points.map((p, idx) => {
            const shouldShow =
              points.length <= 7 || idx % 4 === 0 || idx === points.length - 1;
            if (!shouldShow) return null;
            const x = xCoords[idx];
            return (
              <text
                key={idx}
                x={x}
                y={height - padding.bottom + 22}
                textAnchor="middle"
                fontSize="11"
                fill="var(--app-text-muted)"
                fontWeight="500"
              >
                {p.label}
              </text>
            );
          })}

          {/* Area Fills under curves */}
          <path d={marketAreaPath} fill="url(#marketGradient)" />
          <path d={assetAreaPath} fill="url(#assetGradient)" />

          {/* Stroke Lines */}
          <path
            d={marketPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={assetPath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Prominent Circle Nodes on dates that have real data */}
          {points.map((p, idx) => {
            if (p.has_data === false && p.asset_value === 0 && p.market_value === 0) {
              return null;
            }
            const isHovered = hoverIndex === idx;
            return (
              <g key={`data-node-${idx}`}>
                {/* Node for Asset Line (Modal Aset / HPP) */}
                <circle
                  cx={xCoords[idx]}
                  cy={getY(p.asset_value)}
                  r={isHovered ? "6.5" : "5"}
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? "2.5" : "2"}
                  style={{
                    filter: "drop-shadow(0 2px 5px rgba(99, 102, 241, 0.6))",
                    transition: "all 0.15s ease",
                  }}
                />

                {/* Node for Market Line (Nilai Jual) */}
                <circle
                  cx={xCoords[idx]}
                  cy={getY(p.market_value)}
                  r={isHovered ? "6.5" : "5"}
                  fill="#10b981"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? "2.5" : "2"}
                  style={{
                    filter: "drop-shadow(0 2px 5px rgba(16, 185, 129, 0.6))",
                    transition: "all 0.15s ease",
                  }}
                />
              </g>
            );
          })}

          {/* Interactive Hover Guides ONLY when activePoint exists */}
          {activePoint && hoverIndex !== null && (
            <g>
              {/* Vertical Guide Line */}
              <line
                x1={xCoords[hoverIndex]}
                y1={padding.top}
                x2={xCoords[hoverIndex]}
                y2={padding.top + chartHeight}
                stroke="var(--app-text-secondary)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
                opacity={0.6}
              />
            </g>
          )}

          {/* Hover trigger columns: ONLY rendered for dates that have real data! */}
          {points.map((p, idx) => {
            // DO NOT allow hovering on dates with NO data!
            if (p.has_data === false && p.asset_value === 0 && p.market_value === 0) {
              return null;
            }
            const x = xCoords[idx];
            const colWidth = Math.max(50, chartWidth / Math.max(1, points.length));
            return (
              <rect
                key={`trigger-${idx}`}
                x={x - colWidth / 2}
                y={padding.top}
                width={colWidth}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay Box (Only shown when activePoint exists) */}
        {activePoint && hoverIndex !== null && (
          <div
            className="position-absolute shadow-lg border rounded-3 p-3 pointer-events-none"
            style={{
              top: 15,
              left: Math.min(
                Math.max(10, (xCoords[hoverIndex] / width) * 100 - 10),
                70
              ) + "%",
              backgroundColor: "var(--app-surface)",
              borderColor: "var(--app-border)",
              zIndex: 10,
              minWidth: 230,
              pointerEvents: "none",
            }}
          >
            <div className="d-flex align-items-center gap-1 text-muted small mb-2 border-bottom pb-1">
              <Calendar size={12} />
              <span className="fw-medium">{activePoint.date}</span>
            </div>

            <div className="d-flex flex-column gap-1.5">
              <div className="d-flex align-items-center justify-content-between gap-3">
                <span className="small d-flex align-items-center gap-1.5" style={{ color: "#6366f1" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#6366f1" }} />
                  Modal (HPP):
                </span>
                <span className="small fw-bold font-mono" style={{ color: "var(--app-text-primary)" }}>
                  {formatRupiah(activePoint.asset_value)}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between gap-3">
                <span className="small d-flex align-items-center gap-1.5" style={{ color: "#10b981" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981" }} />
                  Nilai Jual:
                </span>
                <span className="small fw-bold font-mono" style={{ color: "var(--app-text-primary)" }}>
                  {formatRupiah(activePoint.market_value)}
                </span>
              </div>

              <div className="d-flex align-items-center justify-content-between gap-3 pt-1 border-top mt-1">
                <span className="small text-muted">Selisih Margin:</span>
                <span
                  className="small fw-bold font-mono"
                  style={{
                    color:
                      activePoint.market_value >= activePoint.asset_value
                        ? "var(--app-success)"
                        : "var(--app-danger)",
                  }}
                >
                  {formatRupiah(activePoint.market_value - activePoint.asset_value)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
