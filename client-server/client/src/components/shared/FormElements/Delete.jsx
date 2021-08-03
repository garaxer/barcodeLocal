import React, { useState } from 'react';
import {IconButton, DialogTitle, Dialog, Button, DialogActions} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

export default function AlertDialog({handleDelete}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteClick = () =>{
    handleClose();
    handleDelete();
  }

  return (
    <>
      <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete User?</DialogTitle>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClick} color="primary" autoFocus>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

