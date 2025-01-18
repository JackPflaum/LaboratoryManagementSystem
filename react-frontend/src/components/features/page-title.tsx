import { Typography, useTheme } from "@mui/material"

interface PageTitleProps {
    title?: string,
};

const PageTitle = ({ title }: PageTitleProps) => {
    const theme = useTheme();
    return (
        <Typography
            variant="h3"
            sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: 3,
                color: theme.palette.primary.main,
            }}
        >
            {title}
        </Typography>
    );
};

export default PageTitle;