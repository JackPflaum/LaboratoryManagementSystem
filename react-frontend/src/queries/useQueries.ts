import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminContextAttributes, ClientAttributes, DashboardAttributes, JobAttributes, ProfileAttributes, ResultsAttributes, SampleAttributes, TestAttributes, UserAttributes, UserContextAttributes } from "../types/interfaces";
import { useAuthUser } from "../context/UserAuthContext";
import { useAuthAdmin } from "../context/AdminAuthContext";
import useDebouncer from "./debouncer";
import { DEBOUNCER_TIME } from "../types/enums";
import { useNavigate } from "react-router-dom";

// generic API response
interface ApiResponse {
    success?: string;
    error?: string;
};

// all Query Keys in one single object.
const queryKeys = {
    jobs: {
        getJob: ["getJob"],
        getJobsList: ["getJobsData"]
    },
    clients: {
        getClient: ["getClient"],
        getClientsList: ["getClientsList"],
    },
    samples: {
        getSample: ["getSamples"],
        getSamplesList: ["getSamplesList"],
    },
    tests: {
        getTest: ["getTests"],
        getTestsList: ["getTestsList"],
    },
    users: {
        getUser: ["getUser"],
        getUsersList: ["getUsersList"],
    },
    profile: {
        getProfile: ["getProfile"],
    },
};

// handle API response by checking the status and throwing error message if not OK
async function handleResponse<T>(response: Response): Promise<T> {
    const responseData = await response.json();

    if (!response.ok) {
        throw new Error(responseData.error || "Something went wrong");
    }

    return responseData as T;
};


// admin login to the system
export const useAdminLoginMutation = () => {
    const { setAdmin } = useAuthAdmin();

    return useMutation({
        mutationFn: async (data: { email: string, password: string }) => {
            const response = await fetch("http://localhost:8000/api/admin-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            })
            return await handleResponse<AdminContextAttributes>(response);
        },
        onSuccess: (res: AdminContextAttributes) => {
            // set returned authorization data to AdminAuthContext
            setAdmin(res);
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
                credentials: "include",
                body: JSON.stringify(data)
            });

            const responseData = await handleResponse<UserContextAttributes>(response)

            localStorage.setItem("user", JSON.stringify(responseData));

            return responseData;
        },
        onSuccess: (res: UserContextAttributes) => {
            // set returned authorization data to AuthContext
            setUser(res);
        },
    })
};


// handle user logout
export const useLogoutMutation = () => {
    const navigate = useNavigate();
    const { setUser } = useAuthUser();
    const { setAdmin } = useAuthAdmin();

    return useMutation({
        mutationFn: async () => {
            const response = await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
            });

            return await handleResponse<ApiResponse>(response);
        },
        onSuccess: () => {
            localStorage.removeItem("user");
            setUser(null);
            setAdmin(null);
            navigate("/user-login");
        },
    });
};


// gets list of all Users
export const useGetUsersQuery = (searchFilter: string, isActiveUser: boolean | null) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery<UserAttributes[]>({
        queryKey: [...queryKeys.users.getUsersList, debouncedSearch],
        queryFn: async () => {
            const url = new URL("http://localhost:8000/api/admin");
            if (debouncedSearch) {
                url.searchParams.append("searchFilter", debouncedSearch);
            };

            if (isActiveUser !== null) {
                url.searchParams.append("isActiveUser", String(isActiveUser));
            };

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: "include"
            });

            return await handleResponse<UserAttributes[]>(response);
        },
    });
};


// gets User
export const useGetUserQuery = (id: string | undefined) => {
    console.log("userId: ", id);
    return useQuery<UserAttributes>({
        queryKey: [...queryKeys.users.getUser, id],
        queryFn: async () => {
            const response = await fetch(`http://localhost:8000/api/user/${id}`, {
                method: "GET",
                credentials: "include"
            });

            return await handleResponse<UserAttributes>(response);
        },
    });
};


// create new User
export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UserAttributes) => {
            const response = await fetch("http://localhost:8000/api/admin/add-new-user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            return await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.users.getUsersList] });
        },
    });
};


// handles updating existing
export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, id }: { data: UserAttributes, id: number }) => {
            const response = await fetch(`http://localhost:8000/api/admin/update-user/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(data)
            });

            return await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.users.getUsersList] });
        },
    });
};


// handle deleting User and Profile from database
export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`http://localhost:8000/api/admin/delete-user/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.users.getUsersList] });
        },
    });
};


// get Profile 
export const useGetUserProfile = (id: string | undefined) => {
    return useQuery<UserAttributes>({
        queryKey: [...queryKeys.profile.getProfile, id],
        queryFn: async () => {
            if (!id) {
                throw new Error("Profile ID is required");
            };

            const response = await fetch(`http://localhost:8000/api/user/${id}`, {
                method: "GET",
                credentials: "include",
            })

            return await handleResponse<UserAttributes>(response);
        },
    });
};


// updates Profile
export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ formData, id }: { formData: ProfileAttributes, id: number }) => {
            const response = await fetch(`http://localhost:8000/api/profile/${id}/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ data: formData })
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.users.getUser, variables.id.toString()] });
        },
    });
};


// gets dashboard data
export const useGetDashboardQuery = () => {
    return useQuery<DashboardAttributes>({
        queryKey: ["dashboardData"],
        queryFn: async () => {
            const response = await fetch("http://localhost:8000/api/dashboard", {
                method: "GET",
                credentials: "include",
            })

            return await handleResponse<DashboardAttributes>(response);
        },
    });
};


// gets list of Jobs
export const useGetJobsQuery = (searchFilter: string, id?: string) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery<JobAttributes[]>({
        queryKey: [...queryKeys.jobs.getJobsList, debouncedSearch],
        queryFn: async () => {
            const url = new URL("http://localhost:8000/api/jobs");

            if (debouncedSearch) {
                url.searchParams.append("search", debouncedSearch);
            };

            if (id) {
                url.searchParams.append("clientId", id);
            };

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: "include",
            });

            return await handleResponse<JobAttributes[]>(response);
        },
    });
};


// gets individual Job data
export const useGetJobQuery = (jobNumber: string | undefined) => {
    return useQuery<JobAttributes>({
        queryKey: jobNumber ? [...queryKeys.jobs.getJob, jobNumber] : [],
        queryFn: async () => {
            if (!jobNumber) {
                throw new Error("Job ID is required")
            };
            const response = await fetch(`http://localhost:8000/api/jobs/${jobNumber}`, {
                method: "GET",
                credentials: "include",
            });

            return await handleResponse<JobAttributes>(response);
        },
    });
};


// handles creating new Job
export const useCreateJobMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: JobAttributes) => {
            const response = await fetch("http://localhost:8000/api/jobs/add-new-job", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJobsList] });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.samples.getSamplesList] });
        }
    });
};


// handles updating existing Jobs
export const useUpdateJobMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ formData, id }: { formData: JobAttributes, id: number }) => {
            const response = await fetch(`http://localhost:8000/api/jobs/${id}/update-job-details`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ data: formData })
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJobsList] });
        },
    });
};


// handle deleting Job from database
export const useDeleteJobMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`http://localhost:8000/api/jobs/${id}/delete`, {
                method: "DELETE",
                credentials: "include",
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res, id) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJob, id.toString()] });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJobsList] });
        },
    });
};


// gets list of all Clients
export const useGetClientsQuery = (
    searchFilter: string
) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery<ClientAttributes[]>({
        queryKey: [...queryKeys.clients.getClientsList, debouncedSearch],
        queryFn: async () => {
            const url = new URL("http://localhost:8000/api/clients");

            // add search paramater to URL
            if (debouncedSearch) {
                url.searchParams.append("search", debouncedSearch);
            };

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: "include",
            });

            return await handleResponse<ClientAttributes[]>(response);
        },
    });
};


// gets individual Client data
export const useGetClientQuery = (id: string | undefined) => {
    return useQuery<ClientAttributes>({
        queryKey: id ? [...queryKeys.clients.getClient, id] : [],
        queryFn: async () => {
            if (!id) {
                throw new Error("Client ID is required");
            };

            const response = await fetch(`http://localhost:8000/api/clients/${id}`, {
                method: "GET",
                credentials: "include",
            })

            return await handleResponse<ClientAttributes>(response);
        }
    });
};


// create new Client in the database
export const useCreateClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ClientAttributes) => {
            const response = await fetch("http://localhost:8000/api/clients/add-new-client", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res) => {
            // refresh the cached Client list
            queryClient.invalidateQueries({ queryKey: [...queryKeys.clients.getClientsList] });
        },
    });
};


// update existing Client in the database
export const useUpdateClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, id }: { data: ClientAttributes, id: number }) => {
            const response = await fetch(`http://localhost:8000/api/clients/${id}/update-client-details`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res, variables) => {
            // refresh the cached Client list
            queryClient.invalidateQueries({ queryKey: [...queryKeys.clients.getClientsList] });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.clients.getClient, variables.id.toString()] })
        },
    });
};


// handle deleting Client from database
export const useDeleteClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`http://localhost:8000/api/clients/${id}/delete`, {
                method: "DELETE",
                credentials: "include",
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.clients.getClientsList] });
        },
    });
};


// gets list of all Samples
export const useGetSamplesQuery = (searchFilter: string, jobNumber: string | undefined, userId: string | undefined) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery<SampleAttributes[]>({
        queryKey: [...queryKeys.samples.getSamplesList, debouncedSearch],
        queryFn: async () => {
            const url = new URL("http://localhost:8000/api/samples");

            if (debouncedSearch) {
                url.searchParams.append("search", debouncedSearch);
            };

            if (jobNumber) {
                url.searchParams.append("jobNumber", jobNumber);
            };

            if (userId) {
                url.searchParams.append("userId", userId);
            };

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: "include",
            });

            return await handleResponse<SampleAttributes[]>(response);
        }
    });
};

// handle adding new sample to Job
export const useCreateSampleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: SampleAttributes) => {
            const response = await fetch(`http://localhost:8000/api/samples/add-new-sample`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            })

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: () => {
            // refresh the cached samples list
            queryClient.invalidateQueries({ queryKey: [...queryKeys.samples.getSamplesList] });
        }
    });
};


// handle updating sample
export const useUpdateSampleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ formData, id }: { formData: SampleAttributes, id: number }) => {
            const response = await fetch(`http://localhost:8000/api/samples/${id}/update-sample-details`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.samples.getSamplesList] });
        }
    });
};


// handle deleting Sample from database
export const useDeleteSampleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`http://localhost:8000/api/samples/${id}/delete-sample`, {
                method: "DELETE",
                credentials: "include",
            });

            await handleResponse<ApiResponse>(response);
        },
        onSuccess: (res, variables) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJobsList] })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.samples.getSamplesList] })
        }
    });
};


// save test results
export const useSaveResultsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ResultsAttributes) => {
            const response = await fetch("http://localhost:8000/api/results/save-results", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ data }),
            });

            await handleResponse<ApiResponse>(response);

            return { jobNumber: data.jobNumber };
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJob, variables.jobNumber] })
            queryClient.invalidateQueries({ queryKey: [...queryKeys.samples.getSamplesList] });
        },
    });
};


// handle changing user password
export const useUpdatePasswordMutation = () => {
    return useMutation({
        mutationFn: async ({ password, id }: { password: string, id: number }) => {
            const response = await fetch(`http://localhost:8000/api/user/${id}/update-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ password })
            });

            await handleResponse<ApiResponse>(response);
        },
    });
};
