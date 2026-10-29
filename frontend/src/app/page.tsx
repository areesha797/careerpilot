
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddRounded,
  AppsRounded,
  AssessmentRounded,
  AutoAwesomeRounded,
  BookmarkBorderRounded,
  CalendarMonthRounded,
  ChevronRightRounded,
  DashboardRounded,
  FilterListRounded,
  NotificationsNoneRounded,
  SearchRounded,
  SettingsOutlined,
  WorkOutlineRounded,
} from "@mui/icons-material";

import { apiRequest } from "@/lib/api";
import type { ApplicationStatus, JobApplication } from "@/lib/types";

const navigation = [
  { label: "Dashboard", icon: DashboardRounded },
  { label: "My Applications", icon: WorkOutlineRounded },
  { label: "Saved Jobs", icon: BookmarkBorderRounded },
  { label: "Skill Insights", icon: AssessmentRounded },
];

const statusStyles: Record<
  ApplicationStatus,
  { label: string; color: string; background: string }
> = {
  wishlist: {
    label: "Wishlist",
    color: "#c7b8fa",
    background: "rgba(164, 139, 245, 0.12)",
  },
  applied: {
    label: "Applied",
    color: "#9fc2ff",
    background: "rgba(89, 145, 255, 0.13)",
  },
  assessment: {
    label: "Assessment",
    color: "#e9c18a",
    background: "rgba(230, 170, 83, 0.13)",
  },
  interview: {
    label: "Interview",
    color: "#7ee2ba",
    background: "rgba(53, 191, 139, 0.12)",
  },
  offer: {
    label: "Offer",
    color: "#7ee2ba",
    background: "rgba(53, 191, 139, 0.18)",
  },
  rejected: {
    label: "Rejected",
    color: "#f49b9b",
    background: "rgba(244, 100, 100, 0.12)",
  },
};

const companyColors = [
  "#b8c7ff",
  "#b5ead7",
  "#f4d3a1",
  "#e8c7fa",
  "#f2b9c8",
];

function formatDate(dateString: string | null) {
  if (!dateString) return "Not specified";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [statusFilter, setStatusFilter] = useState("All");

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadApplications() {
      try {
        setLoading(true);
        setError(null);

        const data = await apiRequest<JobApplication[]>(
          "/api/applications/",
        );

        if (isActive) {
          setApplications(data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load applications.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadApplications();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch = [
        application.company_name,
        application.job_title,
        application.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const statistics = [
    {
      label: "Total applications",
      value: applications.length,
      note: "Across all statuses",
      icon: <WorkOutlineRounded />,
      accent: "blue",
    },
    {
      label: "Interviews",
      value: applications.filter((app) => app.status === "interview").length,
      note: "Interview opportunities",
      icon: <CalendarMonthRounded />,
      accent: "green",
    },
    {
      label: "Assessments",
      value: applications.filter((app) => app.status === "assessment").length,
      note: "Pending or completed",
      icon: <AssessmentRounded />,
      accent: "amber",
    },
    {
      label: "Offers received",
      value: applications.filter((app) => app.status === "offer").length,
      note: "Offers tracked",
      icon: <AutoAwesomeRounded />,
      accent: "purple",
    },
  ];

  return (
    <Box className="dashboard-shell">
      <Box component="aside" className="sidebar">
        <Box className="brand">
          <Box className="brand-mark">
            <AutoAwesomeRounded />
          </Box>
          <Typography className="brand-name">
            Career<span>Pilot</span>
          </Typography>
        </Box>

        <Typography className="nav-caption">WORKSPACE</Typography>

        <Stack spacing={0.6}>
          {navigation.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              className={`nav-item ${
                activeNav === label ? "nav-item-active" : ""
              }`}
              onClick={() => setActiveNav(label)}
              startIcon={<Icon />}
              fullWidth
            >
              {label}
              {label === "My Applications" && (
                <span className="nav-count">{applications.length}</span>
              )}
            </Button>
          ))}
        </Stack>

        <Divider className="sidebar-divider" />

        <Typography className="nav-caption">TOOLS</Typography>

        <Button
          className={`nav-item ${
            activeNav === "Calendar" ? "nav-item-active" : ""
          }`}
          startIcon={<CalendarMonthRounded />}
          onClick={() => setActiveNav("Calendar")}
          fullWidth
        >
          Application Calendar
        </Button>

        <Button
          className={`nav-item ${
            activeNav === "Insights" ? "nav-item-active" : ""
          }`}
          startIcon={<AppsRounded />}
          onClick={() => setActiveNav("Insights")}
          fullWidth
        >
          Insights
        </Button>

        <Box className="sidebar-bottom">
          <Box className="upgrade-card">
            <Box className="upgrade-icon">
              <AutoAwesomeRounded />
            </Box>
            <Typography className="upgrade-title">
              Your next opportunity starts here.
            </Typography>
            <Typography className="upgrade-description">
              Track applications and discover your next skill to improve.
            </Typography>
          </Box>

          <Button
            className="nav-item settings-item"
            startIcon={<SettingsOutlined />}
            onClick={() => setActiveNav("Settings")}
            fullWidth
          >
            Settings
          </Button>

          <Box className="profile">
            <Box className="avatar">AN</Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography className="profile-name">Your profile</Typography>
              <Typography className="profile-caption">Job seeker</Typography>
            </Box>
            <MoreDots />
          </Box>
        </Box>
      </Box>

      <Box component="main" className="main-content">
        <Box className="topbar">
          <Box>
            <Typography className="breadcrumb">
              Workspace <ChevronRightRounded /> {activeNav}
            </Typography>
          </Box>

          <Stack direction="row" sx={{ alignItems: "center" }} spacing={1.5}>
            <TextField
              size="small"
              placeholder="Search anything..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="top-search"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRounded />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <IconButton
              className="notification-button"
              aria-label="Notifications"
            >
              <NotificationsNoneRounded />
              <span className="notification-dot" />
            </IconButton>
          </Stack>
        </Box>

        <Box className="page-content">
          <Box className="welcome-row">
            <Box>
              <Typography className="eyebrow">
                YOUR CAREER, IN FOCUS
              </Typography>
              <Typography component="h1" className="page-title">
                Good things take <span>progress.</span>
              </Typography>
              <Typography className="page-subtitle">
                One organized step closer to your next opportunity.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRounded />}
              className="primary-button"
              onClick={() =>
                window.alert(
                  "Application form will be connected in a future step.",
                )
              }
            >
              Add application
            </Button>
          </Box>

          {error && (
            <Box className="demo-notice" role="alert">
              <Typography>
                Could not load applications: {error}
              </Typography>
            </Box>
          )}

          <Box className="stats-grid">
            {statistics.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={loading ? "—" : String(stat.value)}
                note={loading ? "Loading..." : stat.note}
                icon={stat.icon}
                accent={stat.accent}
              />
            ))}
          </Box>

          <Paper elevation={0} className="applications-panel">
            <Box className="panel-header">
              <Box>
                <Typography component="h2" className="section-title">
                  Recent applications
                </Typography>
                <Typography className="section-subtitle">
                  Keep track of the opportunities on your radar.
                </Typography>
              </Box>

              <Button
                className="filter-button"
                startIcon={<FilterListRounded />}
                onClick={() =>
                  setStatusFilter((current) =>
                    current === "All" ? "applied" : "All",
                  )
                }
              >
                {statusFilter === "All" ? "Filter" : "Applied only"}
              </Button>
            </Box>

            <Box className="table-scroll">
              <Box className="application-table">
                <Box className="table-row table-heading">
                  <Typography>COMPANY / ROLE</Typography>
                  <Typography>STATUS</Typography>
                  <Typography>DATE ADDED</Typography>
                  <Box />
                </Box>

                {loading && (
                  <Box className="empty-state">
                    <CircularProgress size={26} />
                    <Typography sx={{ mt: 1 }}>
                      Loading your applications...
                    </Typography>
                  </Box>
                )}

                {!loading &&
                  !error &&
                  filteredApplications.map((application, index) => {
                    const status = statusStyles[application.status];
                    const initials = application.company_name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((word) => word[0].toUpperCase())
                      .join("");

                    return (
                      <Box className="table-row" key={application.id}>
                        <Box className="company-cell">
                          <Box
                            className="company-logo"
                            sx={{
                              backgroundColor:
                                companyColors[index % companyColors.length],
                            }}
                          >
                            {initials}
                          </Box>
                          <Box>
                            <Typography className="company-name">
                              {application.company_name}
                            </Typography>
                            <Typography className="company-role">
                              {application.job_title}
                              {application.location
                                ? ` · ${application.location}`
                                : ""}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Chip
                            size="small"
                            label={status.label}
                            className="status-chip"
                            sx={{
                              color: status.color,
                              backgroundColor: status.background,
                            }}
                          />
                        </Box>

                        <Typography className="date-cell">
                          {formatDate(
                            application.applied_date ||
                              application.created_at,
                          )}
                        </Typography>

                        <IconButton
                          className="row-action"
                          aria-label={`View ${application.company_name}`}
                          onClick={() =>
                            window.alert(
                              `Application details for ${application.company_name} will be added in a future step.`,
                            )
                          }
                        >
                          <ChevronRightRounded />
                        </IconButton>
                      </Box>
                    );
                  })}

                {!loading && !error && filteredApplications.length === 0 && (
                  <Box className="empty-state">
                    {applications.length === 0
                      ? "No applications yet. Add your first application to get started."
                      : "No applications match your search or filter."}
                  </Box>
                )}
              </Box>
            </Box>

            <Box className="panel-footer">
              <Typography>
                {loading
                  ? "Loading applications..."
                  : `Showing ${filteredApplications.length} of ${applications.length} applications`}
              </Typography>

              <Button
                className="view-all-button"
                endIcon={<ChevronRightRounded />}
                onClick={() => setActiveNav("My Applications")}
              >
                View applications
              </Button>
            </Box>
          </Paper>

          <Box className="bottom-grid">
            <Paper elevation={0} className="insight-card">
              <Box className="insight-icon">
                <AutoAwesomeRounded />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography className="insight-title">
                  Your next step, made clearer
                </Typography>
                <Typography className="insight-description">
                  CareerPilot will help you compare job requirements with your
                  skills and identify areas to work on.
                </Typography>
              </Box>
              <ChevronRightRounded className="insight-arrow" />
            </Paper>

            <Paper elevation={0} className="goal-card">
              <Typography className="goal-label">
                A LITTLE PROGRESS ADDS UP
              </Typography>
              <Typography className="goal-title">
                Keep showing up.
              </Typography>
              <Typography className="goal-description">
                Every application is a step toward the right opportunity.
              </Typography>
            </Paper>
          </Box>

          <Typography className="page-footer">
            CareerPilot · Built to make your job search more intentional.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function StatCard({
  label,
  value,
  note,
  icon,
  accent,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <Paper elevation={0} className="stat-card">
      <Box className="stat-top">
        <Typography className="stat-label">{label}</Typography>
        <Box className={`stat-icon stat-icon-${accent}`}>{icon}</Box>
      </Box>
      <Typography className="stat-value">{value}</Typography>
      <Typography className="stat-note">{note}</Typography>
    </Paper>
  );
}

function MoreDots() {
  return (
    <Typography className="profile-menu" aria-hidden="true">
      ···
    </Typography>
  );
}
