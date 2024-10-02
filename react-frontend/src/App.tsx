import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';
import Jobs from './components/Jobs';
import Clients from './components/Clients';
import { useAuthUser } from './context/UserAuthContext';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import { useAuthAdmin } from './context/AdminAuthContext';
import IndividualClient from './components/IndividualClient';
import { Box } from '@mui/material';
import Admin from './components/Admin';
import ProfilePage from './components/ProfilePage';

function App() {

    // get user authorization from UserAuthContext and AdminAuthContext
    const { user, isLoading } = useAuthUser();
    const { admin, isRefreshing } = useAuthAdmin();

    // if (isLoading || isRefreshing) {
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 6
                }}
            >
                ...loading
            </Box>
        );
    };

    return (
        <BrowserRouter>
            <Routes>
                {/* User Routes */}
                {user ?
                    (
                        <Route path="/*" element={<Layout />}>
                            <Route index element={<Dashboard />} />  {/* this is the default child route when '/' path is rendered */}
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="jobs" element={<Jobs />} />
                            <Route path="clients" element={<Clients />} />
                            <Route path="clients/:id" element={<IndividualClient />} />
                            <Route path="user/:id" element={<ProfilePage />} />
                            <Route path="*" element={<NoMatch />} />
                        </Route>
                    ) : null}

                {/* Admin Routes */}
                {admin ? (
                    <Route path="admin" element={<Admin />} />
                ) : null}

                {/* Public Routes */}
                {!user && !admin ? (
                    <>
                        <Route path="/*" element={<UserLogin />} />
                        <Route path="user-login" element={<UserLogin />} />
                        <Route path="admin-login" element={<AdminLogin />} />
                        <Route path="*" element={<NoMatch />} />
                    </>
                ) : null}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
