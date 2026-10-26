
"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
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

const navigation = [
  { label: "Dashboard", icon: DashboardRounded, active: true },
  { label: "My Applications", icon: WorkOutlineRounded, active: false },
  { label: "Saved Jobs", icon: BookmarkBorderRounded, active: false },
  { label: "Skill Insights", icon: AssessmentRounded, active: false },
];

const demoApplications = [
  {
    company: "Systems Limited",
    initials: "SL",
    color: "#b8c7ff",
    role: "Frontend Developer",
    location: "Islamabad, Pakistan",
    status: "Interview",
    date: "Oct 24, 2026",
  },
  {
    company: "Netsol Technologies",
    initials: "NT",
    color: "#b5ead7",
    role: "Software Engineer",
    location: "Lahore, Pakistan",
    status: "Applied",
    date: "Oct 22, 2026",
  },
  {
    company: "Contour Software",
    initials: "CS",
    color: "#f4d3a1",
    role: "Associate Developer",
    location: "Islamabad, Pakistan",
    status: "Assessment",
    date: "Oct 20, 2026",
  },
  {
    company: "S&P Global",
    initials: "SP",
    color: "#e8c7fa",
    role: "Data Analyst",
    location: "Islamabad, Pakistan",
    status: "Wishlist",
    date: "Oct 18, 2026",
  },
];

const statusStyles: Record<string, { color: string; background: string }> = {
  Interview: { color: "#7ee2ba", background: "rgba(53, 191, 139, 0.12)" },
  Applied: { color: "#9fc2ff", background: "rgba(89, 145, 255, 0.13)" },
  Assessment: { color: "#e9c18a", background: "rgba(230, 170, 83, 0.13)" },
  Wishlist: { color: "#c7b8fa", background: "rgba(164, 139, 245, 0.13)" },
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = demoApplications.filter((application) => {
    const matchesSearch =
      `${application.company} ${application.role} ${application.location}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
                <span className="nav-count">{demoApplications.length}</span>
              )}
            </Button>
          ))}
        </Stack>

        <Divider className="sidebar-divider" />

        <Typography className="nav-caption">TOOLS</Typography>

        <Button
          className={`nav-item ${activeNav === "Calendar" ? "nav-item-active" : ""}`}
          startIcon={<CalendarMonthRounded />}
          onClick={() => setActiveNav("Calendar")}
          fullWidth
        >
          Application Calendar
        </Button>

        <Button
          className={`nav-item ${activeNav === "Insights" ? "nav-item-active" : ""}`}
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
            <IconButton className="notification-button" aria-label="Notifications">
              <NotificationsNoneRounded />
              <span className="notification-dot" />
            </IconButton>
          </Stack>
        </Box>

        <Box className="page-content">
          <Box className="welcome-row">
            <Box>
              <Typography className="eyebrow">YOUR CAREER, IN FOCUS</Typography>
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
                window.alert("Application form will be connected in a future step.")
              }
            >
              Add application
            </Button>
          </Box>

          <Box className="demo-notice">
            <AutoAwesomeRounded />
            <Typography>
              Preview mode — the applications below are illustrative demo data,
              not real account records.
            </Typography>
          </Box>

          <Box className="stats-grid">
            <StatCard
              label="Total applications"
              value="24"
              note="Illustrative preview"
              icon={<WorkOutlineRounded />}
              accent="blue"
            />
            <StatCard
              label="Interviews"
              value="05"
              note="Illustrative preview"
              icon={<CalendarMonthRounded />}
              accent="green"
            />
            <StatCard
              label="Assessments"
              value="03"
              note="Illustrative preview"
              icon={<AssessmentRounded />}
              accent="amber"
            />
            <StatCard
              label="Offers received"
              value="02"
              note="Illustrative preview"
              icon={<AutoAwesomeRounded />}
              accent="purple"
            />
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
                  setStatusFilter((current) => (current === "All" ? "Applied" : "All"))
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

                {filteredApplications.map((application) => (
                  <Box className="table-row" key={application.company}>
                    <Box className="company-cell">
                      <Box
                        className="company-logo"
                        sx={{ backgroundColor: application.color }}
                      >
                        {application.initials}
                      </Box>
                      <Box>
                        <Typography className="company-name">
                          {application.company}
                        </Typography>
                        <Typography className="company-role">
                          {application.role} · {application.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Chip
                        size="small"
                        label={application.status}
                        className="status-chip"
                        sx={{
                          color: statusStyles[application.status].color,
                          backgroundColor: statusStyles[application.status].background,
                        }}
                      />
                    </Box>

                    <Typography className="date-cell">
                      {application.date}
                    </Typography>

                    <IconButton
                      className="row-action"
                      aria-label={`View ${application.company}`}
                      onClick={() =>
                        window.alert("Application details will be added in a future step.")
                      }
                    >
                      <ChevronRightRounded />
                    </IconButton>
                  </Box>
                ))}

                {filteredApplications.length === 0 && (
                  <Box className="empty-state">
                    No demo applications match your search or filter.
                  </Box>
                )}
              </Box>
            </Box>

            <Box className="panel-footer">
              <Typography>
                Showing {filteredApplications.length} of {demoApplications.length} demo records
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
              <Typography className="goal-label">A LITTLE PROGRESS ADDS UP</Typography>
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
