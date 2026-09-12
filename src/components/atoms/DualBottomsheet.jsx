import { useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";
import { useDrag } from "react-use-gesture";

const EXPANDED_Y = 40;
const COLLAPSED_Y = 350;

const DualBottomsheet = ({ className, children }) => {
  const [expanded, setExpanded] = useState(false);

  const [{ y }, set] = useSpring(() => ({
    y: COLLAPSED_Y,
    config: config.stiff,
  }));

  const bind = useDrag(
    ({ movement: [, my], down, tap, first, last }) => {
      if (tap) {
        return;
      }

      if (first) {
        set({ y: my });
      } else if (last) {
        const closeThreshold = EXPANDED_Y + 5;
        const openThreshold = COLLAPSED_Y - 5;

        if (expanded == true && my > closeThreshold) {
          set({ y: COLLAPSED_Y, config: { duration: 250 } });
          setExpanded(false);
        }
        if (expanded == false && my < openThreshold) {
          set({ y: EXPANDED_Y, config: { duration: 250 } });
          setExpanded(true);
        }
      } else {
        set({ y: my, immediate: down, config: { duration: 0 } });
      }
    },
    {
      initial: () => [0, y.get()],
      bounds: { left: 0, right: 0, top: EXPANDED_Y, bottom: COLLAPSED_Y },
      rubberband: true,
    },
  );

  return (
    <animated.div
      className={`h-screen min-h-0 overflow-hidden ${className}`}
      style={{ y, "--sheet-offset": y.to((value) => `${value}px`) }}
      {...bind()}
    >
      {children}
    </animated.div>
  );
};

export default DualBottomsheet;
