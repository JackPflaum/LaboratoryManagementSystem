import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientAttributes } from "../types/interfaces";

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

// gets data for Dashboard screen
export const useGetJobsQuery = () => {
    return useQuery({
        queryKey: queryKeys.jobs.getJobsList,
        queryFn: async () => {
            return await fetch("http://localhost:8000/api/dashboard", {
                method: "GET"
            })
                .then((res) => res.json())
                .catch((error) => error.json())
        },
    });
};


// create new Client in database
export const useCreateClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ClientAttributes) => {
            await fetch("http://localhost/api/clients/add-new-client", {
                method: "POST",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (res) => {
            console.log("Success: ", res);
            // refresh the cached Client list
            // queryClient.invalidateQueries({ queryKey: [...queryKeys.clients.getClientsList] });
        },
        onError: (error) => {
            console.log("Error: ", error);
        }
    });
};