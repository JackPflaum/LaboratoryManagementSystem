import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from'react-router-dom';
import Layout from './components/Layout';
import Dashboard from '.components/Dashboard';


const App = () => {
  // track user login state
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);

  // changes logged in state
  const handleLoginState = () => {
      setIsLoggedIn(true);
  }

  return (
      <Routes>
          { isLoggedIn ? (
              <Route path='/*' element={<Layout />} />
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
                  <Route path='/' element={<Login onLogin={handleLoginState} />} />
              )
          }   
      </Routes>
  )
};

export default App;