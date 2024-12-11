import { Card, CardContent, CardHeader, Typography } from "@mui/material";

interface CardInformationItem {
    label: string;
    data: string | number | undefined;
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
                // position: 'relative',
                background: `linear-gradient(to left, rgba(255, 255, 255, 0) 0%, ${colour} 100%`,
                // height: 'auto',
                // borderRadius: '8px',
                // overflow: 'hidden',
                // display: 'flex',
                // flexDirection: 'column',
            }}
        >
            <CardHeader title={title} />
            <CardContent>
                {data.map((item, index) => (
                    <Typography key={index} variant="body2">
                        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                            {item.label}:
                        </span>{"  "}{item.data}
                    </Typography>
                ))}
            </CardContent>
        </Card>
    );
};

export default CustomInformationCard;
