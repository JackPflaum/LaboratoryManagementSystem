import React from 'react';
import { NavLink } from 'react-router-dom';


const NoMatch: React.FC = () => {
    return (
        <div>
            <h1>Oops!</h1>
            <h2>404 Page Not Found!</h2>
            <p>Sorry, an error has occured</p>
            <NavLink to="/">Dashboard</NavLink>
        </div>
    )
};

export default NoMatch;