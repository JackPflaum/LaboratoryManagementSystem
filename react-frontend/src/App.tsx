import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import NoMatch from './components/NoMatch';
import Jobs from './components/Jobs';
import Clients from './components/Clients';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import IndividualClient from './components/IndividualClient';
import Admin from './components/Admin';
import ProfilePage from './components/ProfilePage';
import IndividualJob from './components/IndividualJob';

interface AppProps {
    toggleTheme: () => void;
};

function App({ toggleTheme }: Readonly<AppProps>) {
    console.log("App.tsx refreshed");

    return (
        <BrowserRouter>
            <Routes>
                {/* User Routes */}
                <Route path="/*" element={<Layout toggleTheme={toggleTheme} />}>
                    <Route index element={<Dashboard />} />  {/* this is the default child route when '/' path is rendered */}
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="jobs" element={<Jobs />} />
                    <Route path="jobs/:jobNumber" element={<IndividualJob />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="clients/:id" element={<IndividualClient />} />
                    <Route path="user" element={<ProfilePage />} />
                    <Route path="*" element={<NoMatch />} />
                </Route>

                {/* Admin Routes */}
                <Route path="admin" element={<Admin />} />

                {/* Public Routes */}
                <Route path="/*" element={<UserLogin />} />
                <Route path="user-login" element={<UserLogin />} />
                <Route path="admin-login" element={<AdminLogin />} />
                {/* <Route path="*" element={<NoMatch />} /> */}
            </Routes>
        </BrowserRouter>
    );





    // return (
    //     <BrowserRouter>
    //         <Routes>
    //             {/* User Routes */}
    //             {user ?
    //                 (
    //                     <Route path="/*" element={<Layout user={user} />}>
    //                         <Route index element={<Dashboard />} />  {/* this is the default child route when '/' path is rendered */}
    //                         <Route path="dashboard" element={<Dashboard />} />
    //                         <Route path="jobs" element={<Jobs />} />
    //                         <Route path="jobs/:id" element={<IndividualJob />} />
    //                         <Route path="clients" element={<Clients />} />
    //                         <Route path="clients/:id" element={<IndividualClient />} />
    //                         <Route path="user/:id" element={<ProfilePage />} />
    //                         <Route path="*" element={<NoMatch />} />
    //                     </Route>
    //                 ) : null}

    //             {/* Admin Routes */}
    //             {admin ? (
    //                 <Route path="admin" element={<Admin />} />
    //             ) : null}

    //             {/* Public Routes */}
    //             {!user && !admin ? (
    //                 <>
    //                     <Route path="/*" element={<UserLogin />} />
    //                     <Route path="user-login" element={<UserLogin />} />
    //                     <Route path="admin-login" element={<AdminLogin />} />
    //                     <Route path="*" element={<NoMatch />} />
    //                 </>
    //             ) : null}
    //         </Routes>
    //     </BrowserRouter>
    // );
}

export default App;
