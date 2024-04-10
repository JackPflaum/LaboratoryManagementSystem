// import CurrentJobsTable from './components/CurrentJobsTable';
// import CompletedJobsTable from './components/CompletedJobsTable';
import React from "react";


const Dashboard = React.FC () => {
    return (
        <div>
            <h1>Laboratory Dashboard</h1>
            <div style={{border: "1px solid black"}}>
                <h3>Pending Jobs</h3>
                <p>16</p>
            </div>
            <div style={{border: "1px solid black"}}>
                <h3>Pending Samples</h3>
                <p>35</p>
            </div>
            <div style={{border: "1px solid black"}}>
                <h3>Completed Jobs</h3>
                <p>1060</p>
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