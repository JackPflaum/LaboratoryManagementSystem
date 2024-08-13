import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { GridRowId } from "@mui/x-data-grid";

// navigate user to job page based on job id
export const useViewJob = () => {
    const navigate = useNavigate();
    return useCallback(
        (id: GridRowId) => {
            navigate(`/jobs/${id}`);
        },
        [navigate]
    );
};
