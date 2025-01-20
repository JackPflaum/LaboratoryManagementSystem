import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from "@mui/material";
import ResultsPDF from "../../PDFs/ResultsPDF";
import { JobAttributes, SampleAttributes } from "../../../types/interfaces";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";


interface PdfDialogProps {
    open: boolean;
    handleClose: () => void;
    data: {
        job?: JobAttributes,
        samples?: SampleAttributes[]
    };
};


const PdfDialog = ({ open, handleClose, data }: PdfDialogProps) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
            <DialogTitle>Preview PDF</DialogTitle>
            <Divider />
            <DialogContent sx={{
                display: "flex",
            }}>
                <PDFViewer style={{
                    width: "100%",
                    height: 500,
                }}>
                    <ResultsPDF {...data} />
                </PDFViewer>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={handleClose}>
                    Close
                </Button>
                <PDFDownloadLink
                    document={<ResultsPDF {...data} />}
                    fileName={`Job_${data.job?.jobNumber}_Report.pdf`}
                >
                    {/* @ts-ignore */}
                    {({ loading }: { loading: boolean }) => (
                        <Button variant="contained" disabled={loading}>
                            {loading ? "Generating PDF..." : "Download PDF"}
                        </Button>
                    )}
                </PDFDownloadLink>
            </DialogActions>
        </Dialog>
    );
};

export default PdfDialog;
