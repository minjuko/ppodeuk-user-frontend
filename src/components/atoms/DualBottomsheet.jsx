import { useEffect, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const EXPANDED_Y = 40;
const MAX_COLLAPSED_Y = 350;

const getCollapsedY = (height) =>
  Math.max(
    EXPANDED_Y,
    Math.min(MAX_COLLAPSED_Y, Math.round(height * 0.42), height - 400),
  );

const DualBottomsheet = ({ className, children }) => {
  const [expanded, setExpanded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    () => window.innerHeight,
  );
  const collapsedY = getCollapsedY(viewportHeight);

  const [{ y }, set] = useSpring(() => ({
    y: collapsedY,
    config: config.stiff,
  }));

  useEffect(() => {
    const updateViewportHeight = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", updateViewportHeight);

    return () => window.removeEventListener("resize", updateViewportHeight);
  }, []);

  useEffect(() => {
    set({ y: expanded ? EXPANDED_Y : collapsedY, config: config.stiff });
  }, [collapsedY, expanded, set]);

  const bind = useDrag(
    ({ offset: [, yOffset], down, tap, first, last }) => {
      if (tap) {
        return;
      }

      if (first) {
        set({ y: yOffset });
      } else if (last) {
        const closeThreshold = EXPANDED_Y + 5;
        const openThreshold = collapsedY - 5;

        if (expanded == true && yOffset > closeThreshold) {
          set({ y: collapsedY, config: { duration: 250 } });
          setExpanded(false);
        }
        if (expanded == false && yOffset < openThreshold) {
          set({ y: EXPANDED_Y, config: { duration: 250 } });
          setExpanded(true);
        }
      } else {
        set({ y: yOffset, immediate: down, config: { duration: 0 } });
      }
    },
    {
      from: () => [0, y.get()],
      bounds: { left: 0, right: 0, top: EXPANDED_Y, bottom: collapsedY },
      rubberband: true,
    },
  );

  return (
    <animated.div
      className={`h-screen min-h-0 overflow-hidden ${className}`}
      style={{
        y,
        height: y.to((value) => `calc(100dvh - ${value}px)`),
      }}
      {...bind()}
    >
      {children}
    </animated.div>
  );
};

export default DualBottomsheet;
