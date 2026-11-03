
"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import type {
  ApplicationStatus,
  CreateJobApplication,
  JobApplication,
} from "@/lib/types";

type ApplicationFormDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobApplication) => Promise<void>;
  application?: JobApplication | null;
};

const emptyForm: CreateJobApplication = {
  company_name: "",
  job_title: "",
  job_url: "",
  location: "",
  status: "wishlist",
  applied_date: null,
  notes: "",
};

const statusOptions: {
  value: ApplicationStatus;
  label: string;
}[] = [
  { value: "wishlist", label: "Wishlist" },
  { value: "applied", label: "Applied" },
  { value: "assessment", label: "Assessment" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function ApplicationFormDialog({
  open,
  onClose,
  onSubmit,
  application = null,
}: ApplicationFormDialogProps) {
  const [form, setForm] = useState<CreateJobApplication>(() =>
    application
      ? {
          company_name: application.company_name,
          job_title: application.job_title,
          job_url: application.job_url,
          location: application.location,
          status: application.status,
          applied_date: application.applied_date,
          notes: application.notes,
        }
      : { ...emptyForm },
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(application);

  function handleClose() {
    if (saving) return;

    setError("");
    onClose();
  }

  function handleChange(
    field: keyof CreateJobApplication,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");

    if (!form.company_name.trim() || !form.job_title.trim()) {
      setError("Company name and job title are required.");
      return;
    }

    if (form.job_url?.trim()) {
      try {
        const url = new URL(form.job_url);

        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid URL protocol");
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS job URL.");
        return;
      }
    }

    try {
      setSaving(true);

      await onSubmit({
        ...form,
        company_name: form.company_name.trim(),
        job_title: form.job_title.trim(),
        job_url: form.job_url?.trim() ?? "",
        location: form.location?.trim() ?? "",
        notes: form.notes?.trim() ?? "",
        applied_date: form.applied_date || null,
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save the application.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {isEditing ? "Edit Job Application" : "Add Job Application"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Company Name"
              value={form.company_name}
              onChange={(event) =>
                handleChange("company_name", event.target.value)
              }
              required
              fullWidth
            />

            <TextField
              label="Job Title"
              value={form.job_title}
              onChange={(event) =>
                handleChange("job_title", event.target.value)
              }
              required
              fullWidth
            />

            <TextField
              label="Job URL"
              type="url"
              value={form.job_url}
              onChange={(event) =>
                handleChange("job_url", event.target.value)
              }
              fullWidth
            />

            <TextField
              label="Location"
              value={form.location}
              onChange={(event) =>
                handleChange("location", event.target.value)
              }
              fullWidth
            />

            <TextField
              select
              label="Application Status"
              value={form.status}
              onChange={(event) =>
                handleChange("status", event.target.value)
              }
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Applied Date"
              type="date"
              value={form.applied_date ?? ""}
              onChange={(event) =>
                handleChange("applied_date", event.target.value)
              }
              slotProps={{
                inputLabel: { shrink: true },
              }}
              fullWidth
            />

            <TextField
              label="Notes"
              value={form.notes}
              onChange={(event) =>
                handleChange("notes", event.target.value)
              }
              multiline
              rows={3}
              fullWidth
            />

            {error && (
              <TextField
                value={error}
                error
                multiline
                slotProps={{
                  input: { readOnly: true },
                }}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={saving}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Save Application"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
