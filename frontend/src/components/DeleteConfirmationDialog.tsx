
"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type DeleteConfirmationDialogProps = {
  open: boolean;
  applicationName: string;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

export default function DeleteConfirmationDialog({
  open,
  applicationName,
  deleting,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={deleting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Delete Job Application?</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete your application for{" "}
          <strong>{applicationName}</strong>?
          {" "}This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={deleting}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={() => void onConfirm()}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Confirm Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
