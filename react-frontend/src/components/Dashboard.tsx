import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CurrentJobsTable from '../components/CurrentJobsTable';
import CompletedJobsTable from '../components/CompletedJobsTable';


interface DashboardState {
    pendingJobsCount: number;
    pendingSamplesCount: number;
    completedJobsCount: number;
}

const Dashboard: React.FC = () => {

    const [ data, setData ] = useState<DashboardState>({
        pendingJobsCount: 0,
        pendingSamplesCount: 0,
        completedJobsCount: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/dashboard');

                const { pendingJobsCount, pendingSamplesCount, completedJobsCount } = response.data;
                
                setData({
                    pendingJobsCount: pendingJobsCount,
                    pendingSamplesCount: pendingSamplesCount,
                    completedJobsCount: completedJobsCount,
                });
            } catch (error) {
                console.log('Dashboard fetchData() Error:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Laboratory Dashboard</h1>
            <div style={{border: "1px solid black"}}>
                <h3>Pending Jobs</h3>
                <p>{data.pendingJobsCount}</p>
            </div>
            <div style={{border: "1px solid black"}}>
                <h3>Pending Samples</h3>
                <p>{data.pendingSamplesCount}</p>
            </div>
            <div style={{border: "1px solid black"}}>
                <h3>Completed Jobs in the past 60days</h3>
                <p>{data.pendingSamplesCount}</p>
            </div>
            <div style={{border: "1px solid black"}}>
                <CurrentJobsTable />
            </div>
            <div style={{border: "1px solid black"}}>
                <CompletedJobsTable />
            </div>
        </div>
    )
};

export default Dashboard;
