import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';
import Jobs from './components/Jobs';
import Clients from './components/Clients';
import { useAuth } from './context/AuthContext';

function App() {

    // get user authorization from AuthContext
    const { user } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {user ?
                    (
                        <Route path="/*" element={<Layout />}>
                            <Route index element={<Dashboard />} />  {/* this is the default child route when '/' path is rendered */}
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="jobs" element={<Jobs />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    ) : (
                        <>
                            <Route path="/" element={<Login />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="*" element={<NoMatch />} />
                        </>
                    )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
