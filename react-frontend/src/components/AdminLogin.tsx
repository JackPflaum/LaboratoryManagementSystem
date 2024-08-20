import { useForm } from "react-hook-form";
import Login from "./Login";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, UserLoginProps } from "./UserLogin";
import { useAdminLoginMutation } from "../queries/useQueries";
import { useNavigate } from "react-router-dom";
import { useState } from "react";


const AdminLogin = () => {

    const title = "Admin Login"

    const [errorMessage, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const { mutate: adminLogin, isPending } = useAdminLoginMutation();

    const onSubmit = (formData: UserLoginProps) => {
        if (formData) {
            adminLogin(formData, {
                onSuccess: () => {
                    // TODO: save auth credentials in context
                    // navigate("/admin");
                },
                onError: (error) => {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 5000)
                }
            });
        };
    };

    return (
        <Login
            title={title}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
        />
    );
};

export default AdminLogin;
