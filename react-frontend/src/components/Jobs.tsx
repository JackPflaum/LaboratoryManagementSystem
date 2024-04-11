import React, { useState } from "react";
import { NavLink } from 'react-router-dom';
import JobsTable from '../components/JobsTable';


const Jobs: React.FC = () => {
    const [ search, setSearch ] = useState<string>('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <div>
            <h2>Jobs</h2>
            <div>
                <input type="text" value={search} name="search" onChange={handleSearchChange} placeholder="search" />
                <NavLink to="#">Add Job</NavLink>
            </div>
            <JobsTable />
        </div>
    );
};

export default Jobs;
