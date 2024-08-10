import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

    return (
        <BrowserRouter>
            <Routes>
                {isLoggedIn ?
                    (
                        <Route path="/*" element={<Layout />}>
                            <Route index element={<Dashboard />} />  {/* this is the default child route when '/' path is rendered */}
                            <Route path="dashboard" element={<Dashboard />} />
                        </Route>
                    ) : (
                        <Route path="/" element={<Login />} />
                    )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
