import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientAttributes, CreateUserProps } from "../types/interfaces";
import { useAuth } from "../context/AuthContext";

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


// login to the system
export const useLoginMutation = () => {
    const { setUser } = useAuth();

    return useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            return await fetch("http://localhost/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then((res) => res.json())
        },
        onSuccess: (res) => {
            // TODO: save returned JWT token?
            // set returned authorization data to AuthContext
            setUser(res);
        },
        onError: (error) => {
            console.log(error.message);
        }
    })
};


// create new User
export const useCreateUserMutation = () => {
    return useMutation({
        mutationFn: async (data: CreateUserProps) => {
            await fetch("http://localhost:8000/api/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
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
            await fetch("http://localhost/api/clients/add-new-client", {
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
            await fetch(`http://localhost/api/clients/${id}/update-client-details`, {
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
