import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from "@mui/material";

interface DeleteDialogProps {
    open: boolean;
    handleClose: () => void;
    handleDelete?: (id: string) => void;
    isPending: boolean;
    id?: number;
    title?: string;
    description?: string
};

const DeleteDialog = ({
    open,
    handleClose,
    handleDelete,
    isPending,
    id,
    title,
    description,
}: DeleteDialogProps) => {

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{title ? `${title} ${description}` : `Deleting ${description}`}</DialogTitle>
            <Divider />
            <DialogContent>
                <Typography>{`Are you sure you want to ${title?.toLocaleLowerCase() ?? "delete"}?`}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained" disabled={isPending} onClick={() => {
                    if (handleDelete && id !== undefined) {
                        handleDelete(id.toString());    // Convert the id to string for the delete mutation function
                    }
                    handleClose();
                }}>
                    {isPending ? "Pending..." : (title ?? "Delete")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteDialog;
