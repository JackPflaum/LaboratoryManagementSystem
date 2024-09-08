import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminContextAttributes, ClientAttributes, CreateUserProps, JobAttributes, SampleAttributes, UserContextAttributes } from "../types/interfaces";
import { useAuthUser } from "../context/UserAuthContext";
import { useAuthAdmin } from "../context/AdminAuthContext";
import useDebouncer from "./debouncer";
import { DEBOUNCER_TIME } from "../types/enums";

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
        getSampleList: ["getSamplesList"],
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
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        },
        onSuccess: (res: AdminContextAttributes) => {
            // TODO: save returned JWT token?
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

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

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
    const { setUser } = useAuthUser();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(id)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        },
        onSuccess: (res: UserContextAttributes) => {
            // set returned authorization to null
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
                credentials: "include",
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        }
    });
};


// gets data for Dashboard screen
export const useGetJobsQuery = (searchFilter: string) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery({
        queryKey: queryKeys.jobs.getJobsList,
        queryFn: async () => {
            const url = new URL("http://localhost:8000/api/jobs");

            if (debouncedSearch) {
                url.searchParams.append("search", debouncedSearch);
            };

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: "include",
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
        },
    });
};


// gets individual Job data
export const useGetJobQuery = (id: string | undefined) => {
    return useQuery<JobAttributes>({
        queryKey: id ? [...queryKeys.jobs.getJob, id] : [],
        queryFn: async () => {
            if (!id) {
                throw new Error("Job ID is required")
            };
            const response = await fetch(`http://localhost:8000/api/jobs/${id}`, {
                method: "GET",
                credentials: "include",
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong");
            };

            return responseData;
        },
    });
};


// handles creating new Job
export const useCreateJobMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: JobAttributes) => {
            await fetch("http://localhost:8000/api/jobs/add-new-job", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJobsList] })
        }
    });
};


// handles updating existing Jobs
export const useUpdateJobMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ formData, id }: { formData: JobAttributes, id: number }) => {
            await fetch("http://localhost:8000/api/jobs/update-job", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ data: formData, id: id })
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJob] });
        },
    });
};


// gets list of all Clients
export const useGetClientsQuery = (
    searchFilter: string
) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery({
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

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
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

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };

            return responseData;
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

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong.");
            };
        },
        onSuccess: (res) => {
            // refresh the cached Client list
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.getClientsList });
        },
    });
};


// update existing Client in the database
export const useUpdateClientMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, id }: { data: ClientAttributes, id: number }) => {
            await fetch(`http://localhost:8000/api/clients/${id}/update-client-details`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
        },
        onSuccess: (res, variables) => {
            // refresh the cached Client list
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.getClientsList });
            queryClient.invalidateQueries({ queryKey: [...queryKeys.clients.getClient, variables.id.toString()] })
        },
    });
};


// gets list of all Samples
export const useGetSamplesQuery = (searchFilter: string) => {
    const debouncedSearch = useDebouncer(searchFilter, DEBOUNCER_TIME.TIME);

    return useQuery<SampleAttributes>({
        queryKey: [...queryKeys.samples.getSampleList, debouncedSearch],
        queryFn: async () => {
            const url = new URL("http://localhost/8000/samples");

            if (debouncedSearch) {
                url.searchParams.append("search", debouncedSearch);
            };

            const response = await fetch(url.toString(), {
                method: "GET",
                credentials: "include",
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong");
            };

            return responseData;
        }
    });
};


// get individual Sample data
export const useGetSampleQuery = (id: string | undefined) => {
    return useQuery<SampleAttributes>({
        queryKey: id ? [...queryKeys.samples.getSample, id] : [],
        queryFn: async () => {
            if (!id) {
                throw new Error("Sample ID is required");
            };

            const response = await fetch(`http://localhost:8000/api/sample/${id}`, {
                method: "GET",
                credentials: "include",
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || "Something went wrong");
            };

            return responseData;
        },
    });
};


// handle adding new sample to Job
export const useAddSampleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: SampleAttributes) => {
            await fetch("http://localhost:8000/api/add-new-sample", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            })
        },
        onSuccess: () => {
            // refresh the cached Jobs list
            queryClient.invalidateQueries({ queryKey: [...queryKeys.jobs.getJobsList] })
        }
    });
};


// handle deleting Sample from database
export const useDeleteSampleMutation = () => {
    return useMutation({
        mutationFn: async (id: string) => {
            await fetch(`http://localhost:8000/api/sample-details/${id}/delete-sample`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(id)
            })
        },
        onSuccess: () => {
            // invalidate Jobs query?
            // query.invalidateQueries({queryKeys: [...queryKeys.query.jobs]})
        }
    });
};




// handle changing user password
export const useUpdatePasswordMutation = () => {
    return useMutation({
        mutationFn: async ({ password, id }: { password: string, id: string }) => {
            await fetch(`http://localhost:8000/api/profile/${id}/update-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(password)
            });
        },
    });
};
