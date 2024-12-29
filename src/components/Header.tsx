import { useEffect, useRef, useState } from "react";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import { Link, ListItem, Typography } from "@mui/material";

import useViewportWidth from "../hooks/useViewportWidth";

export default function Header() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<HTMLUListElement>(null);

  const [headerTextWidth, setHeaderTextWidth] = useState(0);
  const [listItemsWidth, setListItemsWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  });

  const { center, right, width } = useViewportWidth();

  // Transformations
  const height = useTransform(scrollYProgress, [0, 1], ["14%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const identityX = useTransform(
    scrollYProgress,
    [0, 1],
    [center(headerTextWidth), 10]
  );
  const listItemsX = useTransform(
    scrollYProgress,
    [0, 1],
    [width + listItemsWidth, right(listItemsWidth, 20)]
  );

  // Springs for smoother animations
  const springedIdentityX = useSpring(identityX, {
    stiffness: 400,
    damping: 90,
  });
  const springedListItemX = useSpring(listItemsX, {
    stiffness: 500,
    damping: 90,
  });

  useEffect(() => {
    setListItemsWidth(listItemsRef.current?.offsetWidth ?? 0);
    setHeaderTextWidth(headerTextRef.current?.offsetWidth ?? 0);
  }, []);

  return (
    <motion.div
      className="header"
      style={{ height }}
      // style={{ height: springedHeight }}
      ref={headerRef}
    >
      <motion.div
        ref={headerTextRef}
        style={{ x: springedIdentityX }}
        className="identity"
      >
        <FeedRoundedIcon fontSize="large" />
        <motion.h1 style={{ opacity }}>Header</motion.h1>
      </motion.div>
      {width > 550 && (
        <motion.ul
          ref={listItemsRef}
          style={{
            display: "flex",
            gap: 2,
            x: springedListItemX,
            position: "absolute",
          }}
        >
          {/* <motion.ul style={{ display: "none" }}> */}
          <ListItem>
            <Link href="#budget-section">
              <Typography>Budget</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#jobPreferences-section">
              <Typography>Job Preferences</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#jobParsing-section">
              <Typography>Job Parsing</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#clientPreferences-section">
              <Typography>Client Preferences</Typography>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="#extraFilters-section">
              <Typography>Extra</Typography>
            </Link>
          </ListItem>
        </motion.ul>
      )}
    </motion.div>
  );
}
