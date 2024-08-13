import { useQuery, useMutation } from "@tanstack/react-query";

// gets data for Dashboard screen
export const useGetJobsData = () => {
    return useQuery({
        queryKey: ["getJobsData"],
        queryFn: async () => {
            return await fetch("http://localhost:8000/api/dashboard", {
                method: "GET"
            })
                .then((res) => res.json())
                .catch((error) => error.json())
        },
    });
};