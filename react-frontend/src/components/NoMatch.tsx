import React from 'react';
import { Container, Typography, Link } from '@mui/material';


const NoMatch: React.FC = () => {
    return (
        <Container
            sx={{
                height: "80vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",

            }}
        >
            <Typography variant="h2">Oops!</Typography>
            <Typography variant="h5">404 Page Not Found!</Typography>
            <Typography variant="body1">Sorry, an error has occured</Typography>
            <Link href="/">Dashboard</Link>
        </Container>
    )
};

export default NoMatch;