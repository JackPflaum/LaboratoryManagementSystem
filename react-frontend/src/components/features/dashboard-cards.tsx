import { Typography } from "@mui/material"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

interface DashboardCardProps {
    titles: string[];
}

const DashboardCard = ({ titles }: DashboardCardProps) => {
    return (
        <>
            {titles.map((title, index) => (
                <Card
                    key={index}
                    sx={{
                        minWidth: "250px",
                        padding: 2,
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                        borderRadius: 6
                    }}
                    elevation={2}
                >
                    <CardContent
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginTop: 1
                        }}
                    >
                        <Typography variant="h6" component="div">
                            {title}
                        </Typography>
                        <Typography variant="body1" mt={2}>
                            17
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default DashboardCard;