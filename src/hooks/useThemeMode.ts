import type { PaletteMode } from "@mui/material/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const theme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#469696",
        light: "rgba(107,171,171,0.05)",
        dark: "#2d5151",
        contrastText: "#fff",
      },
      secondary: {
        main: "#f50057",
        light: "rgba(245, 0, 87, 0.1)",
        dark: "#b70040",
        contrastText: "#fff",
      },
    },
    typography: {
      h2: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        opacity: 0.75,
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
      },

      h3: {
        fontSize: "1rem",
        fontWeight: "lighter",
        opacity: 0.75,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
      },
    },
  });

const useCustomTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const mode = prefersDarkMode ? "dark" : "light";
  const customTheme = theme(mode);
  const responsiveTheme = responsiveFontSizes(customTheme);

  return responsiveTheme;
};

export default useCustomTheme;
