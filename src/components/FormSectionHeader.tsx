import { Avatar, Divider, Typography } from "@mui/material";

export default function FormSectionHeader({
  Icon,
  title,
  subtitle,
}: {
  Icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <>
      <Typography variant="h2" sx={{ color: "text.primary" }}>
        <Avatar
          sx={{
            bgcolor: "secondary.main",
            fontSize: "inherit",
          }}
          children={<Icon fontSize="large" />}
        />
        {title}
      </Typography>
      <Typography variant="h3" sx={{ color: "text.secondary" }}>
        {subtitle}
      </Typography>
      <Divider sx={{ marginBottom: "1rem" }} />
    </>
  );
}
