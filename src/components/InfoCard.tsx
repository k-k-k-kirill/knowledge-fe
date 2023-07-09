import { Paper, Typography } from "@mui/material";

interface InfoCardProps {
  title?: string;
  content?: string;
}

export const InforCard: React.FC<InfoCardProps> = ({ title, content }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        padding: "1rem",
        display: "inline-block",
        borderRadius: "12px",
        maxWidth: "312px",
      }}
    >
      <Typography
        sx={{ fontSize: "0.875rem", fontWeight: 500, lineHeight: "20px" }}
        variant="body1"
      >
        {title}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.875rem",
          fontWeight: 400,
          lineHeight: "20px",
          marginTop: "0.5rem",
        }}
        variant="body1"
      >
        {content}
      </Typography>
    </Paper>
  );
};
