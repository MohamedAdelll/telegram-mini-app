import { Box } from "@mui/material";

export default function FormSection({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <Box
      id={id}
      sx={{
        bgcolor: "primary.light",
        p: 2,
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      {children}
    </Box>
  );
}
