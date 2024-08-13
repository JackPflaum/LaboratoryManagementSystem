import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

interface ClientsDialogProps {
    data?: string;
    open: boolean;
    handleClose: () => void;
}

const ClientDialog = ({ data, open, handleClose }: ClientsDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>{!data ? "Add Client" : "Edit Client"}</DialogTitle>
            <DialogContent>
                {/* Add Form input here */}
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="contained">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ClientDialog;