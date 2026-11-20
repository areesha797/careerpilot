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

type SkillMatchResult = {
  required_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  total_required: number;
  total_matched: number;
  total_missing: number;
  match_percentage: number;
};

export default function KeywordExtractor() {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userSkills, setUserSkills] = useState("");
  const [matchResult, setMatchResult] = useState<SkillMatchResult | null>(null);
  const [matching, setMatching] = useState(false);
  const [matchError, setMatchError] = useState("");

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

  async function handleMatchSkills() {
    setMatching(true);
    setMatchError("");
    setMatchResult(null);

    try {
      const data = await apiRequest<SkillMatchResult>("/api/keywords/match/", {
        method: "POST",
        body: JSON.stringify({
          description,
          skills: userSkills,
        }),
      });

      setMatchResult(data);
    } catch (err) {
      setMatchError(
        err instanceof Error
          ? err.message
          : "Could not analyze your skills. Please try again.",
      );
    } finally {
      setMatching(false);
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
        <Typography sx={{ color: "#a9b8d4", fontSize: 12, letterSpacing: 1.5 }}>
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

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          background: "#121b30",
          border: "1px solid rgba(148, 163, 189, 0.13)",
          borderRadius: 3,
        }}
      >
        <Typography sx={{ color: "#edf2ff", fontSize: 20, fontWeight: 700 }}>
          Skill Matching & Gap Analysis
        </Typography>

        <Typography sx={{ color: "#94a3bd", mt: 1, mb: 2 }}>
          Compare your technical skills with the job requirements and identify
          skills you need to improve.
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={4}
          maxRows={8}
          label="Your Skills"
          placeholder="Example: Python, Django, React, JavaScript, PostgreSQL, Git..."
          value={userSkills}
          onChange={(event) => setUserSkills(event.target.value)}
          slotProps={{
            htmlInput: {
              maxLength: 5000,
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: "#edf2ff",
              background: "#0b1222",
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
            "& .MuiInputLabel-root": {
              color: "#94a3bd",
            },
          }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            mt: 2,
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: 2,
          }}
        >
          <Typography sx={{ color: "#8492ad", fontSize: 12 }}>
            {userSkills.length.toLocaleString()} / 5,000 characters
          </Typography>

          <Button
            variant="contained"
            disabled={matching || !description.trim() || !userSkills.trim()}
            onClick={handleMatchSkills}
            startIcon={
              matching ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <AutoAwesomeRounded />
              )
            }
            sx={{
              background: "#7189df",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              "&:hover": {
                background: "#5d76ca",
              },
              "&.Mui-disabled": {
                background: "#36425e",
                color: "#8794ad",
              },
            }}
          >
            {matching ? "Analyzing..." : "Analyze Skill Gap"}
          </Button>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      {matchError && <Alert severity="error">{matchError}</Alert>}

      {matchResult && (
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
              YOUR SKILL MATCH
            </Typography>

            <Typography
              sx={{
                color: "#a9bdff",
                fontSize: 46,
                fontWeight: 700,
                mt: 1,
              }}
            >
              {matchResult.match_percentage}%
            </Typography>

            <Box
              sx={{
                height: 9,
                background: "#26334d",
                borderRadius: 10,
                overflow: "hidden",
                mt: 2,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${matchResult.match_percentage}%`,
                  background: "#7189df",
                  borderRadius: 10,
                  transition: "width 0.4s ease",
                }}
              />
            </Box>

            <Typography sx={{ color: "#94a3bd", fontSize: 13, mt: 2 }}>
              You match {matchResult.total_matched} out of{" "}
              {matchResult.total_required} identified job requirements.
            </Typography>
          </Paper>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                background: "#121b30",
                border: "1px solid rgba(74, 222, 128, 0.2)",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ color: "#86efac", fontWeight: 600 }}>
                Matched Skills
              </Typography>

              <Typography
                sx={{ color: "#edf2ff", fontSize: 30, fontWeight: 700, mt: 1 }}
              >
                {matchResult.total_matched}
              </Typography>

              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 2 }}>
                {matchResult.matched_skills.length > 0 ? (
                  matchResult.matched_skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        color: "#86efac",
                        background: "rgba(74, 222, 128, 0.1)",
                        border: "1px solid rgba(74, 222, 128, 0.25)",
                      }}
                    />
                  ))
                ) : (
                  <Typography sx={{ color: "#8492ad", fontSize: 13 }}>
                    No matching skills found.
                  </Typography>
                )}
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 3,
                background: "#121b30",
                border: "1px solid rgba(248, 113, 113, 0.2)",
                borderRadius: 3,
              }}
            >
              <Typography sx={{ color: "#fca5a5", fontWeight: 600 }}>
                Missing Skills
              </Typography>

              <Typography
                sx={{ color: "#edf2ff", fontSize: 30, fontWeight: 700, mt: 1 }}
              >
                {matchResult.total_missing}
              </Typography>

              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mt: 2 }}>
                {matchResult.missing_skills.length > 0 ? (
                  matchResult.missing_skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        color: "#fca5a5",
                        background: "rgba(248, 113, 113, 0.1)",
                        border: "1px solid rgba(248, 113, 113, 0.25)",
                      }}
                    />
                  ))
                ) : (
                  <Typography sx={{ color: "#8492ad", fontSize: 13 }}>
                    No missing skills identified.
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Stack>
      )}

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
