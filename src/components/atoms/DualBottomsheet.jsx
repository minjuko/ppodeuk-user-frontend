import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  useId,
} from "react";
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
  const dragControlId = useId();
  const suppressClickRef = useRef(false);
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
        const startY = expanded ? EXPANDED_Y : collapsedY;
        const dragDistance = yOffset - startY;
        const threshold = Math.min(
          80,
          Math.max(16, (collapsedY - EXPANDED_Y) * 0.35),
        );
        const shouldExpand = !expanded && dragDistance <= -threshold;
        const shouldCollapse = expanded && dragDistance >= threshold;
        const nextExpanded = shouldExpand || (expanded && !shouldCollapse);

        if (Math.abs(dragDistance) > 5) suppressClickRef.current = true;
        set({
          y: nextExpanded ? EXPANDED_Y : collapsedY,
          config: { duration: 250 },
        });
        setExpanded(nextExpanded);
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

  const dragHandle = (
    <button
      {...bind()}
      type="button"
      aria-label={expanded ? "세차장 목록 접기" : "세차장 목록 펼치기"}
      aria-expanded={expanded}
      aria-controls={dragControlId}
      onClick={(event) => {
        if (suppressClickRef.current && event.detail > 0) {
          suppressClickRef.current = false;
          return;
        }
        suppressClickRef.current = false;
        setExpanded((current) => !current);
      }}
      className="flex h-11 w-14 shrink-0 touch-none cursor-grab items-center justify-center self-center rounded-lg active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <span aria-hidden="true" className="h-1 w-8 rounded-full bg-slate-400" />
    </button>
  );
  const sheetContent = isValidElement(children)
    ? cloneElement(children, { dragHandle, id: dragControlId })
    : children;

  return (
    <animated.div
      className={`h-screen w-full min-h-0 overflow-hidden ${className}`}
      style={{
        y,
        height: y.to((value) => `calc(100dvh - ${value}px)`),
      }}
    >
      {sheetContent}
    </animated.div>
  );
};

export default DualBottomsheet;
