import { QueryClient } from "@tanstack/react-query";
import { handleResponse, queryKeys } from "../queries/useQueries";
import { messageAttributes, SampleAttributes } from "../types/interfaces";


interface updateCacheTypes {
    message: messageAttributes;
    queryClient: QueryClient;
};


const fetchUpdatedSample = async (id: string) => {
    try {
        const response = await fetch(`http://localhost:8000/api/samples/${id}`, {
            method: "GET",
            credentials: "include",
        });

        return await handleResponse<SampleAttributes>(response);
    } catch (error) {
        console.error("Error fetching updated sample:", error);
        throw error;
    };
};

// update users cache based on received message from websocket
export const updateCache = async ({ message, queryClient }: updateCacheTypes) => {
    const { type, id, data } = message;

    switch (type) {
        case "client":
            if (id) {
                queryClient.setQueryData([queryKeys.clients.getClient, id], data);
            } else {
                queryClient.invalidateQueries({ queryKey: [queryKeys.clients.getClientsList] });
            };
            break;
        case "job":
            if (id) {
                queryClient.setQueryData([queryKeys.jobs.getJob, id], data);
                queryClient.invalidateQueries({ queryKey: [queryKeys.dashboard.getDashboardData] });
            } else {
                queryClient.invalidateQueries({ queryKey: [queryKeys.jobs.getJobsList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.dashboard.getDashboardData] });
            };
            break;
        case "sample":
            if (id) {
                // get the updated sample and add to existing cache
                const updatedSample = await fetchUpdatedSample(id);
                queryClient.setQueryData([queryKeys.samples.getSample, id], updatedSample);

                queryClient.invalidateQueries({ queryKey: [queryKeys.dashboard.getDashboardData] });
            } else {
                queryClient.invalidateQueries({ queryKey: [queryKeys.samples.getSamplesList] });
                queryClient.invalidateQueries({ queryKey: [queryKeys.dashboard.getDashboardData] });
            };
            break;
        default:
            console.log(`Unknown message type: ${type}`);
    };
};

