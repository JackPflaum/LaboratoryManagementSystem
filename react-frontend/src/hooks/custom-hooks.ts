import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { GridRowId, GridRowParams } from "@mui/x-data-grid";
import { useAuthUser } from "../context/UserAuthContext";
import { UserPermissions } from "../types/enums";
import { ClientAttributes, JobAttributes } from "../types/interfaces";

// navigate user to job page based on job id
export const useViewJob = (id: GridRowId) => {
    const navigate = useNavigate();
    return useCallback(
        () => {
            navigate(`/jobs/${id}`);
        },
        [navigate, id]
    );
};


// navigate user to client page based on client id
export const useViewClient = (id: GridRowId | undefined) => {
    const navigate = useNavigate();
    return useCallback(() => {
        navigate(`/clients/${id}`);
    }, [navigate, id]);
};


// check user permissions
export const useHasPermission = (requiredPermission: UserPermissions) => {
    const { user } = useAuthUser();
    if (user?.permissions) {
        return user.permissions.includes(requiredPermission);
    }
    return false;
};
