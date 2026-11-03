
"use client";

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import {
  CalendarMonthRounded,
  DeleteOutlineRounded,
  EditRounded,
  OpenInNewRounded,
} from "@mui/icons-material";

import type { JobApplication } from "@/lib/types";

type ApplicationDetailsDialogProps = {
  open: boolean;
  application: JobApplication | null;
  onClose: () => void;
  onEdit: (application: JobApplication) => void;
  onDelete: (application: JobApplication) => void;
};

const statusLabels: Record<JobApplication["status"], string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  assessment: "Assessment",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

function formatDate(value: string | null) {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function ApplicationDetailsDialog({
  open,
  application,
  onClose,
  onEdit,
  onDelete,
}: ApplicationDetailsDialogProps) {
  if (!application) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography
          component="div"
          variant="h5"
          sx={{ fontWeight: 700 }}
        >
          Application Details
        </Typography>

        <Typography
          component="div"
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Complete information about this job application
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography
              component="div"
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              {application.job_title}
            </Typography>

            <Typography component="div" color="text.secondary">
              {application.company_name}
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography
              component="div"
              variant="subtitle2"
              color="text.secondary"
            >
              APPLICATION STATUS
            </Typography>

            <Chip
              label={statusLabels[application.status]}
              color={
                application.status === "offer"
                  ? "success"
                  : application.status === "rejected"
                    ? "error"
                    : application.status === "interview"
                      ? "info"
                      : "default"
              }
              sx={{
                alignSelf: "flex-start",
                fontWeight: 600,
              }}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography
              component="div"
              variant="subtitle2"
              color="text.secondary"
            >
              LOCATION
            </Typography>

            <Typography component="div">
              {application.location || "Not specified"}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography
              component="div"
              variant="subtitle2"
              color="text.secondary"
            >
              APPLICATION DATE
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center" }}
            >
              <CalendarMonthRounded fontSize="small" color="action" />

              <Typography component="div">
                {formatDate(application.applied_date)}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={1}>
            <Typography
              component="div"
              variant="subtitle2"
              color="text.secondary"
            >
              JOB URL
            </Typography>

            {application.job_url ? (
              <Link
                href={application.job_url}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  wordBreak: "break-all",
                }}
              >
                View Job Posting
                <OpenInNewRounded sx={{ fontSize: 16 }} />
              </Link>
            ) : (
              <Typography component="div" color="text.secondary">
                No job URL provided
              </Typography>
            )}
          </Stack>

          <Stack spacing={1}>
            <Typography
              component="div"
              variant="subtitle2"
              color="text.secondary"
            >
              NOTES
            </Typography>

            <Typography
              component="div"
              sx={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {application.notes || "No notes added"}
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
            >
              CREATED: {formatDateTime(application.created_at)}
            </Typography>

            <Typography
              component="div"
              variant="caption"
              color="text.secondary"
            >
              LAST UPDATED: {formatDateTime(application.updated_at)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          color="error"
          startIcon={<DeleteOutlineRounded />}
          onClick={() => onDelete(application)}
        >
          Delete
        </Button>

        <Button onClick={onClose} color="inherit">
          Close
        </Button>

        <Button
          variant="contained"
          startIcon={<EditRounded />}
          onClick={() => onEdit(application)}
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
