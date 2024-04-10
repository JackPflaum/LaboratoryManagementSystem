import React, { FormEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import MdErrorOutline from "react-icons/md";


interface LoginProps {
    handleLoginState: () => void;
};


interface LoginState {
    email: string;
    password: string;
};

const Login: React.FC<LoginProps> = ({handleLoginState}) => {
    // login form data
    const [ loginData, setLoginData ] = useState<LoginState>({
        email: '',
        password: '',
    });

    // login error messages
    const [ localError, setLocalError ] = useState<string>('');

    // login form submittion
    const handleLoginSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // check if both fields are filled in
        if (!loginData.email || !loginData.password) {
            setLocalError(`<${MdErrorOutline}/> All fields are required!`);
            return;
        }

        try {
            //handle login request
            // call a function from authcontext to log user in

            // set login state to true in parent component App.tsx
            handleLoginState();
            return;
        } catch (error) {
            console.log("Login Error: ", error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <Form onSubmit={handleLoginSubmit}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={loginData.email}
                        name="email"
                        placeholder="enter email"
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={loginData.password}
                        name="password"
                        placeholder="enter password"
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}/>
                </Form.Group>
                {localError && <p>{localError}</p>}
                <Button type="submit" variant="primary">Login</Button>
            </Form>
        </div>
    );
};

export default Login;
