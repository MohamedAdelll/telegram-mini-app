import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import { StrictMode, useEffect } from "react";

import { createRoot } from "react-dom/client";

import { Box, ThemeProvider } from "@mui/material";

// import { init, miniApp } from "@telegram-apps/sdk-react";
import App from "./App.tsx";
import Header from "./components/Header.tsx";
import useCustomTheme from "./hooks/useThemeMode.ts";
import useViewportWidth from "./hooks/useViewportWidth.ts";

createRoot(document.getElementById("root")!).render(<Main />);

function Main() {
  const theme = useCustomTheme();
  const { width } = useViewportWidth();

  useEffect(() => {
    if (width < 551) return;
    const sections = document.querySelectorAll(
      ".MuiContainer-root[id$='section']"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const link = document.querySelector(`a[href="#${id}"]`);
            if (link) {
              link
                .closest("ul")
                ?.querySelectorAll("a")
                .forEach((link) => link.classList.remove("active"));
              link.classList.add("active");
            }
          }
        });
      },
      { threshold: 0.6 }
    );
    sections.forEach((section) => observer.observe(section));
  }, [width]);

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
  }, [theme]);
  return (
    <ThemeProvider theme={theme}>
      <StrictMode>
        <Box>
          <Header />
          <App />
        </Box>
      </StrictMode>
    </ThemeProvider>
  );
}
