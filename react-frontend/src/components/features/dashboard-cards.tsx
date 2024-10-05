import { Typography } from "@mui/material"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardData } from "../../types/interfaces";

interface DashboardCardProps {
    cardData: CardData[];
}

const DashboardCard = ({ cardData }: DashboardCardProps) => {
    return (
        <>
            {cardData.map((data, index) => (
                <Card
                    key={index}
                    sx={{
                        minWidth: "250px",
                        padding: 2,
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 2,
                        backgroundColor: `${data.colour}`,
                        borderRadius: 2,
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
                        <Typography variant="h4" mt={2}>
                            {data.count}
                        </Typography>
                        <Typography variant="h6" component="div">
                            {data.title}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </>
    );
};

export default DashboardCard;