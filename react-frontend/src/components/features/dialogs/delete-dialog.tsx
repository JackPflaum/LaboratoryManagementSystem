import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";

interface DeleteDialogProps {
    open: boolean;
    handleClose: () => void;
    handleDelete?: (id: string) => void;
    isPending: boolean;
    id?: number;
    description?: string
};

const DeleteDialog = ({
    open,
    handleClose,
    handleDelete,
    isPending,
    id,
    description,
}: DeleteDialogProps) => {

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Deleting "{description}"</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography>Are you sure you want to delete?</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={() => {
                    if (handleDelete && id !== undefined) {
                        handleDelete(id.toString());    // Convert the id to string for the delete mutation function
                    }
                    handleClose();
                }}>
                    {isPending ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
