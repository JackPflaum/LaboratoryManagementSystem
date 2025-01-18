import { Card, CardContent, CardHeader, Divider, Typography, useTheme } from "@mui/material";

interface CardInformationItem {
    label: string;
    data: string | number | undefined | JSX.Element;
};

interface CustomInformationCardProps {
    title: string | undefined;
    data: CardInformationItem[];
    colour?: string;
};

const CustomInformationCard = ({ title, data, colour }: CustomInformationCardProps) => {

    const theme = useTheme();

    return (
        <Card
            variant="outlined"
            sx={{
                height: 'auto',
                borderRadius: '12px',
                backgroundColor: "rgb(8, 72, 99)",
                color: "white"
            }}
        >
            <CardHeader title={title} />
            <Divider />
            <CardContent>
                {data.map((item, index) => (
                    <Typography key={index} variant="body1" sx={{ padding: 1 }}>
                        <span style={{ fontSize: "18px", fontWeight: "bold", marginRight: 8 }}>
                            {item.label}:
                        </span>{item.data}
                    </Typography>
                ))}
            </CardContent>
        </Card>
    );
};

export default CustomInformationCard;
