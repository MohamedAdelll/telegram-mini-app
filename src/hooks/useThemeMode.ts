import { useRef, useState } from "react";

import type { PaletteMode } from "@mui/material/styles";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { miniApp, on, retrieveLaunchParams } from "@telegram-apps/sdk";

let initDataRaw = "";
if (window.parent !== window) {
  ({ initDataRaw = "" } = retrieveLaunchParams());
}

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
  const lastThemeBGColorRef = useRef<string | undefined>();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (!initDataRaw) {
      return prefersDarkMode ? "dark" : "light";
    }
    miniApp.mount.ifAvailable();
    const colorScheme = miniApp.isDark() ? "dark" : "light";
    console.log("colorScheme", colorScheme);

    return colorScheme;
  });

  on("theme_changed", (data) => {
    console.log({ data }, "THEME_CHANGED");
    if (data.theme_params.bg_color !== lastThemeBGColorRef.current) {
      console.log("hanghayar", {
        data: data.theme_params.bg_color,
        lastThemeBGColorRef: lastThemeBGColorRef.current,
      });
      lastThemeBGColorRef.current = data.theme_params.bg_color;
      setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
    }
  });

  const customTheme = theme(themeMode);
  const responsiveTheme = responsiveFontSizes(customTheme);

  return responsiveTheme;
};

export default useCustomTheme;
