import { Typography } from "@mui/material"

interface PageTitleProps {
    title?: string,
};

const PageTitle = ({ title }: PageTitleProps) => {
    return (
        <Typography variant="h4" sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
            {title}
        </Typography>
    );
};

export default PageTitle;