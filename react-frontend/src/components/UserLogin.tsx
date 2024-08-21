import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../queries/useQueries";
import LoginForm from "./LoginForm";

// login validation schema
export const loginSchema = yup.object().shape({
    email: yup.string().trim().required("Email is required").matches(/\S+@\S+\.\S/, "Invalid email address"),
    password: yup.string().required("Password is required"),
});

export interface UserLoginProps {
    email: string,
    password: string,
};


const UserLogin = () => {

    const [errorMessage, setErrorMessage] = useState<string>("");

    const title = "User Login"

    // used for navigation after successful submission
    const navigate = useNavigate();

    const { handleSubmit, control } = useForm({
        resolver: yupResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const { mutate: login, isPending } = useLoginMutation();

    // handle login submission
    const onSubmit = (formData: UserLoginProps) => {
        if (formData) {
            login(formData, {
                onSuccess: () => {
                    // TODO: save auth credentials in context
                    navigate("/dashboard");
                },
                onError: (error) => {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 5000)
                }
            });
        }
    };

    return (
        <LoginForm
            title={title}
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isPending={isPending}
            errorMessage={errorMessage}
        />
    )
};

export default UserLogin;