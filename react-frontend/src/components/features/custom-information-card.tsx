import { Card, CardContent, CardHeader, Divider, Typography } from "@mui/material";

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
    return (
        <Card
            variant="outlined"
            sx={{
                // background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${colour || "rgba(0, 21, 255)"} 70%, ${colour || "rgba(0, 21, 255)"} 100%)`,
                height: 'auto',
                borderRadius: '12px',
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
