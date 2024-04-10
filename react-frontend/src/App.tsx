import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Jobs from './components/Jobs';
import JobDetails from './components/JobDetails';
import SampleDetails from './components/SampleDetails';
import Clients from './components/Clients';
import ClientDetails from './components/ClientDetails';
import User from './components/User';
import NoMatch from './components/NoMatch';


const App: React.FC = () => {
    // track user login state
    const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);

    // changes users logged in state
    const handleLoginState: () => void = () => {
        setIsLoggedIn(true);
    }

    return (
        <Router>
            <Routes>
                { isLoggedIn ? (
                    <Route path='/*' element={<Layout />}>
                        <Route index element={<Dashboard />} />    {/* this is the default child route when '/' path is rendered */}
                        <Route path='/dashboard' element={<Dashboard />} />
                        <Route path='/jobs' element={<Jobs />} />
                        <Route path='/job-details/:jobId' element={<JobDetails />} />
                        <Route path='/sample-details/:sampleId' element={<SampleDetails />} />
                        <Route path='/clients' element={<Clients />} />
                        <Route path='/client-details/:clientId' element={<ClientDetails />} />
                        <Route path='/user/:userId' element={<User />} />
                        <Route path='*' element={<NoMatch />} />
                    </Route>
                    ) : (
                        <Route path='/' element={<Login handleLoginState={handleLoginState} />} />
                    )
                }   
            </Routes>
      </Router>
    )
};


export default App;
