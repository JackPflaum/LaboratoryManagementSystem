import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { GridRowId } from "@mui/x-data-grid";
import { useAuthUser } from "../context/UserAuthContext";
import { UserPermissions } from "../types/enums";

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

// check user permissions
export const useHasPermission = (requiredPermission: UserPermissions) => {
    const { user } = useAuthUser();
    if (user?.permissions) {
        return user.permissions.includes(requiredPermission);
    }
    return false;
};
