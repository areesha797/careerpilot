
"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Box, Paper, Typography } from "@mui/material";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

const statusConfig: {
  key: ApplicationStatus;
  label: string;
  color: string;
}[] = [
  { key: "wishlist", label: "Wishlist", color: "#a48bf5" },
  { key: "applied", label: "Applied", color: "#5991ff" },
  { key: "assessment", label: "Assessment", color: "#e6aa53" },
  { key: "interview", label: "Interview", color: "#35bf8b" },
  { key: "offer", label: "Offer", color: "#71d9a9" },
  { key: "rejected", label: "Rejected", color: "#f46c6c" },
];

function getWeekStart(date: Date): Date {
  const result = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);

  return result;
}

export default function AnalyticsCharts({
  applications,
  loading,
}: {
  applications: JobApplication[];
  loading: boolean;
}) {
  const statusData = useMemo(
    () =>
      statusConfig.map((status) => ({
        name: status.label,
        value: applications.filter(
          (application) => application.status === status.key,
        ).length,
        color: status.color,
      })),
    [applications],
  );

  const weeklyData = useMemo(() => {
    const currentWeek = getWeekStart(new Date());

    const weeks = Array.from({ length: 7 }, (_, index) => {
      const start = new Date(currentWeek);
      start.setDate(start.getDate() - (6 - index) * 7);

      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      return {
        week: start.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        start,
        end,
        applications: 0,
      };
    });

    applications.forEach((application) => {
      // Weekly activity tracks when an application was created.
      if (!application.created_at) return;

      const date = new Date(application.created_at);

      if (Number.isNaN(date.getTime())) return;

      const week = weeks.find(
        (item) => date >= item.start && date < item.end,
      );

      if (week) {
        week.applications += 1;
      }
    });

    return weeks.map(({ week, applications: count }) => ({
      week,
      applications: count,
    }));
  }, [applications]);

  const total = applications.length;
  const hasStatusData = statusData.some((item) => item.value > 0);

  const cardSx = {
    backgroundColor: "#111a2e",
    color: "#edf2ff",
    border: "1px solid #25314a",
    borderRadius: "15px",
    minWidth: 0,
  };

  const tooltipStyle = {
    backgroundColor: "#18243a",
    border: "1px solid #34415c",
    borderRadius: 10,
    color: "#edf2ff",
  };

  return (
    <Box className="analytics-grid">
      <Paper elevation={0} className="analytics-card" sx={cardSx}>
        <Box className="analytics-header">
          <Box>
            <Typography component="h2" className="section-title">
              Application status
            </Typography>
            <Typography className="section-subtitle">
              Breakdown of your tracked opportunities.
            </Typography>
          </Box>

          <Typography className="analytics-total">
            {loading ? "..." : `${total} total`}
          </Typography>
        </Box>

        {loading ? (
          <Box className="chart-empty">Loading analytics...</Box>
        ) : !hasStatusData ? (
          <Box className="chart-empty">
            Add an application to see your status breakdown.
          </Box>
        ) : (
          <>
            <Box className="donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData.filter((item) => item.value > 0)}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="65%"
                    outerRadius="88%"
                    paddingAngle={3}
                    stroke="none"
                  >
                    {statusData
                      .filter((item) => item.value > 0)
                      .map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                  </Pie>

                  <Tooltip
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: "#edf2ff" }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <Box className="donut-center">
                <Typography className="donut-value">
                  {total}
                </Typography>
                <Typography className="donut-label">
                  Applications
                </Typography>
              </Box>
            </Box>

            <Box className="status-legend">
              {statusData.map((item) => (
                <Box className="legend-item" key={item.name}>
                  <Box
                    className="legend-dot"
                    sx={{ backgroundColor: item.color }}
                  />
                  <Typography className="legend-name">
                    {item.name}
                  </Typography>
                  <Typography className="legend-value">
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </Paper>

      <Paper elevation={0} className="analytics-card" sx={cardSx}>
        <Box className="analytics-header">
          <Box>
            <Typography component="h2" className="section-title">
              Weekly application activity
            </Typography>
            <Typography className="section-subtitle">
              Applications added over the last 7 weeks.
            </Typography>
          </Box>
        </Box>

        {loading ? (
          <Box className="chart-empty">Loading analytics...</Box>
        ) : (
          <Box className="weekly-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyData}
                margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#293650"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="week"
                  tick={{ fill: "#94a3bd", fontSize: 10 }}
                  axisLine={{ stroke: "#34415c" }}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#94a3bd", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: "#ffffff0a" }}
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "#edf2ff" }}
                  formatter={(value) => [value, "Applications"]}
                />

                <Bar
                  dataKey="applications"
                  name="Applications"
                  fill="#8b9cff"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={38}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
