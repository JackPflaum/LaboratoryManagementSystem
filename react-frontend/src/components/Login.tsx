import { Avatar, Box, Container, CssBaseline, TextField, Typography, Button, Link, Alert } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { Controller, UseFormHandleSubmit, Control, SubmitHandler } from "react-hook-form";
import { UserLoginProps } from "./UserLogin";

interface LoginProps {
    title: string,
    control: Control<UserLoginProps>,
    handleSubmit: UseFormHandleSubmit<UserLoginProps>,
    onSubmit: SubmitHandler<UserLoginProps>,
    isPending: boolean;
    errorMessage?: string;
};

const Login = ({ title, control, handleSubmit, onSubmit, isPending, errorMessage }: LoginProps) => {

    return (
        <>
            {title === "User Login" ? (
                <Link
                    href="admin-login"
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: 2
                    }}
                >
                    Admin Login
                </Link>
            ) : (
                <Link
                    href="user-login"
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        margin: 2
                    }}
                >
                    User Login
                </Link>
            )}
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
                    <Avatar sx={{
                        m: 1,
                        bgcolor: title === "User Login" ? "#88D66C" : "#ef233c"
                    }}>
                        <LoginIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {title}
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
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                        {title === "User Login" ? (
                            <Link href="" underline="always" variant="body2">Forgot password?</Link>
                        ) : null}
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default Login;
