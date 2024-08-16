import { Avatar, Box, Container, CssBaseline, TextField, Typography, Button } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../queries/useQueries";

// login validation schema
const loginSchema = yup.object().shape({
    email: yup.string().trim().required("Email is required").matches(/\S+@\S+\.\S/, "Invalid email address"),
    password: yup.string().required("Password is required"),
});

interface LoginProps {
    email: string,
    password: string,
};

const Login = () => {

    // used for navigation after successful submission
    const navigate = useNavigate();

    const { handleSubmit, control } = useForm({ resolver: yupResolver(loginSchema) });

    const { mutate: login, isPending } = useLoginMutation();

    // handle login submission
    const onSubmit = (formData: LoginProps) => {
        if (formData) {
            login(formData, {
                onSuccess: () => {
                    // TODO: save auth credentials in context
                    // TODO: navigate to dashboard
                    navigate("/dashboard");
                }
            });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: 8
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: "#88D66C" }}>
                    <LoginIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        marginTop: 2,
                        // apply marginBottom to all items in Box except last item (<Button>)
                        "& > *:not(:last-child)": {
                            marginBottom: 2
                        }
                    }}
                >
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Email"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                            />
                        )}
                    />
                    <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        render={({ field, fieldState }) => (
                            <TextField
                                label="Password"
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                size="small"
                                type="password"
                            />
                        )}
                    />
                    <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
                        {isPending ? "Logging in..." : "Login"}
                    </Button>
                    <NavLink to="">Forgot password?</NavLink>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
