
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import { apiRequest } from "@/lib/api";

type LoginResponse = {
  detail: string;
  username: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest<LoginResponse>("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        background:
          "radial-gradient(ellipse at 50% 0%, #1a2340 0%, transparent 48%), #0b1020",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 430 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.5,
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 43,
              height: 43,
              display: "grid",
              placeItems: "center",
              borderRadius: "13px",
              color: "#fff",
              background: "linear-gradient(135deg, #9baaff, #6e66d9)",
              boxShadow: "0 8px 24px #6d7ff533",
            }}
          >
            <WorkOutlineRoundedIcon />
          </Box>

          <Typography
            sx={{
              color: "#edf2ff",
              fontSize: 25,
              fontWeight: 750,
              letterSpacing: "-0.8px",
            }}
          >
            CareerPilot
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            border: "1px solid #25314a",
            borderRadius: "18px",
            background: "linear-gradient(145deg, #141e33, #101827)",
          }}
        >
          <Typography
            sx={{
              color: "#f1f4ff",
              fontSize: 25,
              fontWeight: 750,
              letterSpacing: "-0.7px",
            }}
          >
            Welcome back!
          </Typography>

          <Typography
            sx={{
              mt: 1,
              mb: 3.5,
              color: "#94a3bd",
              fontSize: 13,
              lineHeight: 1.7,
            }}
          >
            Sign in to continue managing your job search.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Typography
              sx={{ mb: 1, color: "#cbd5e8", fontSize: 12, fontWeight: 600 }}
            >
              Username
            </Typography>

            <TextField
              fullWidth
              size="small"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              disabled={loading}
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  minHeight: 48,
                  borderRadius: "10px",
                  color: "#edf2ff",
                  background: "#0d1525",
                  "& fieldset": { borderColor: "#34415c" },
                  "&:hover fieldset": { borderColor: "#7889ff" },
                  "&.Mui-focused fieldset": { borderColor: "#8b9cff" },
                },
                "& input::placeholder": {
                  color: "#8290aa",
                  opacity: 1,
                  fontSize: 12,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon
                        sx={{ color: "#8290aa", fontSize: 20 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography
              sx={{ mb: 1, color: "#cbd5e8", fontSize: 12, fontWeight: 600 }}
            >
              Password
            </Typography>

            <TextField
              fullWidth
              size="small"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={loading}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  minHeight: 48,
                  borderRadius: "10px",
                  color: "#edf2ff",
                  background: "#0d1525",
                  "& fieldset": { borderColor: "#34415c" },
                  "&:hover fieldset": { borderColor: "#7889ff" },
                  "&.Mui-focused fieldset": { borderColor: "#8b9cff" },
                },
                "& input::placeholder": {
                  color: "#8290aa",
                  opacity: 1,
                  fontSize: 12,
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon
                        sx={{ color: "#8290aa", fontSize: 19 }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={17} color="inherit" />
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                minHeight: 47,
                borderRadius: "10px",
                color: "#fff",
                background: "linear-gradient(135deg, #7889ff, #626be3)",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { background: "#6375ee" },
                "&.Mui-disabled": {
                  color: "#cbd5e8",
                  background: "#626be3",
                  opacity: 0.65,
                },
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </Box>
        </Paper>

        <Typography
          sx={{
            mt: 3,
            color: "#697995",
            fontSize: 11,
            textAlign: "center",
          }}
        >
          Your job search journey, organized in one place.
        </Typography>
      </Box>
    </Box>
  );
}
