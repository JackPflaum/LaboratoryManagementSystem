import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminContextAttributes, ClientAttributes, CreateUserProps, UserContextAttributes } from "../types/interfaces";
import { useAuthUser } from "../context/UserAuthContext";
import { useAuthAdmin } from "../context/AdminAuthContext";

// all Query Keys in one single object.
const queryKeys = {
    jobs: {
        getJob: ["getJob"],
        getJobsList: ["getJobsData"]
    },
    clients: {
        getClient: ["getClient"],
        getClientsList: ["getClientsList"],
    }
};


// admin login to the system
export const useAdminLoginMutation = () => {
    const { setAdmin } = useAuthAdmin();

    return useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            const response = await fetch("http://localhost:8000/api/admin-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        },
        onSuccess: (res: AdminContextAttributes) => {
            // TODO: save returned JWT token?
            // set returned authorization data to AdminAuthContext
            setAdmin(res);
            console.log("res: ", res);
        }
    })
};


// user login to the system
export const useLoginMutation = () => {
    const { setUser } = useAuthUser();

    return useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            const response = await fetch("http://localhost:8000/api/user-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (response.status !== 200) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        },
        onSuccess: (res: UserContextAttributes) => {
            // TODO: save returned JWT token?
            // set returned authorization data to AuthContext
            setUser(res);
        },
    })
};


// create new User
export const useCreateUserMutation = () => {
    return useMutation({
        mutationFn: async (data: CreateUserProps) => {
            const response = await fetch("http://localhost:8000/api/admin/add-new-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (response.status !== 201) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        }
    });
};


// gets data for Dashboard screen
export const useGetJobsQuery = () => {
    // add debouncer here
    return useQuery({
        queryKey: queryKeys.jobs.getJobsList,
        queryFn: async () => {
            return await fetch("http://localhost:8000/api/dashboard", {
                method: "GET"
            })
                .then((res) => res.json())
        },
    });
};


// create new Client in the database
export const useCreateClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ClientAttributes) => {
            await fetch("http://localhost:8000/api/clients/add-new-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        },
        onSuccess: (res) => {
            console.log("Success: ", res);
            // refresh the cached Client list
            // queryClient.invalidateQueries({ queryKey: queryKeys.clients.getClientsList });
        },
        onError: (error) => {
            console.log("Error: ", error.message);
        }
    });
};


// update existing Client in the database
export const useUpdateClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, id }: { data: ClientAttributes; id: number }) => {
            await fetch(`http://localhost:8000/api/clients/${id}/update-client-details`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
        },
        onSuccess: (res) => {
            console.log("Success: ", res);
            // refresh the cached Client list
            // queryClient.invalidateQueries({ queryKey: queryKeys.clients.getClientsList });
        },
        onError: (error) => {
            console.log("Error: ", error.message);
        },
    });
};
