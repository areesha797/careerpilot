"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AutoAwesomeRounded } from "@mui/icons-material";
import { apiRequest } from "@/lib/api";

type ExtractionResult = {
  keywords: string[];
  categories: Record<string, string[]>;
  total_keywords: number;
};

export default function KeywordExtractor() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await apiRequest<ExtractionResult>(
        "/api/keywords/extract/",
        {
          method: "POST",
          body: JSON.stringify({ description }),
        },
      );

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not extract keywords. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function formatCategory(category: string) {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography
          sx={{ color: "#a9b8d4", fontSize: 12, letterSpacing: 1.5 }}
        >
          CAREER INTELLIGENCE
        </Typography>

        <Typography
          component="h1"
          sx={{ color: "#edf2ff", fontSize: 28, fontWeight: 700, mt: 1 }}
        >
          Job Description Keyword Extractor
        </Typography>

        <Typography sx={{ color: "#94a3bd", mt: 1 }}>
          Identify technical skills and requirements mentioned in a job
          description.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          background: "#121b30",
          border: "1px solid rgba(148, 163, 189, 0.13)",
          borderRadius: 3,
        }}
      >
        <Typography sx={{ color: "#edf2ff", fontWeight: 600, mb: 1.5 }}>
          Paste job description
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={8}
          maxRows={14}
          placeholder="Paste the complete job description here..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          slotProps={{
  htmlInput: {
    maxLength: 20000,
  },
}}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#edf2ff",
              background: "#0b1222",
              alignItems: "flex-start",
              "& fieldset": {
                borderColor: "rgba(148, 163, 189, 0.2)",
              },
              "&:hover fieldset": {
                borderColor: "#7189bd",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#91a9ff",
              },
            },
            "& textarea::placeholder": {
              color: "#71809c",
              opacity: 1,
            },
          }}
        />

        <Stack
  direction={{ xs: "column", sm: "row" }}
  sx={{
    mt: 3,
    justifyContent: "space-between",
    alignItems: { xs: "stretch", sm: "center" },
    gap: 2,
  }}
>
          <Typography sx={{ color: "#8492ad", fontSize: 12 }}>
            {description.length.toLocaleString()} / 20,000 characters
          </Typography>

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <AutoAwesomeRounded />
              )
            }
            disabled={loading || !description.trim()}
            onClick={handleExtract}
            sx={{
              background: "#7189df",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": { background: "#5d76ca" },
              "&.Mui-disabled": {
                background: "#36425e",
                color: "#8794ad",
              },
            }}
          >
            {loading ? "Extracting..." : "Extract Keywords"}
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {result && (
        <Stack spacing={2}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              background: "#121b30",
              border: "1px solid rgba(148, 163, 189, 0.13)",
              borderRadius: 3,
            }}
          >
            <Typography sx={{ color: "#94a3bd", fontSize: 13 }}>
              TOTAL KEYWORDS IDENTIFIED
            </Typography>

            <Typography
              sx={{ color: "#a9bdff", fontSize: 42, fontWeight: 700, mt: 1 }}
            >
              {result.total_keywords}
            </Typography>

            <Typography sx={{ color: "#94a3bd", fontSize: 13 }}>
              Matching terms found in the supplied job description
            </Typography>
          </Paper>

          {Object.entries(result.categories).map(([category, skills]) => (
            <Paper
              key={category}
              elevation={0}
              sx={{
                p: 3,
                background: "#121b30",
                border: "1px solid rgba(148, 163, 189, 0.13)",
                borderRadius: 3,
              }}
            >
              <Stack
  direction="row"
  sx={{
    mb: 2,
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
                <Typography sx={{ color: "#edf2ff", fontWeight: 600 }}>
                  {formatCategory(category)}
                </Typography>

                <Typography sx={{ color: "#8492ad", fontSize: 12 }}>
                  {skills.length} found
                </Typography>
              </Stack>

              {skills.length > 0 ? (
                <Stack
  direction="row"
  sx={{
    flexWrap: "wrap",
    gap: 1,
  }}
>
                  {skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        color: "#b9caff",
                        background: "rgba(113, 137, 223, 0.13)",
                        border: "1px solid rgba(113, 137, 223, 0.25)",
                      }}
                    />
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ color: "#71809c", fontSize: 13 }}>
                  No matching keywords found in this category.
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
