import React from 'react';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';


const Layout: React.FunctionComponent = () => {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
};


export default Layout;
