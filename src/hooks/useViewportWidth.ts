import { useEffect, useState } from "react";

const viewportWidth = window.innerWidth;
export default function useViewportWidth() {
  const [width, setWidth] = useState(viewportWidth);

  const centerPoint = width / 2;

  function center(targetWidth: number) {
    return centerPoint - (targetWidth || 0) / 2;
  }
  function right(targetWidth: number, margin = 0) {
    return width - margin - (targetWidth || 0);
  }

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return {
    center,
    right,
    width,
  };
}
