import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import "./DriftWall.css";

export type DriftWallItem = {
  image: string;
  title?: string;
  href?: string;
};

type DriftWallDirection = "up" | "down";

type DriftWallProps = {
  items: DriftWallItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  radius?: number;
  tilt?: number;
  turn?: number;
  roll?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: DriftWallDirection;
  variance?: number;
  parallax?: number;
  pauseOnHover?: boolean;
  lift?: number;
  fade?: number;
  dim?: number;
  grayscale?: boolean;
  overlayColor?: string;
  className?: string;
};

type ColumnMeta = {
  copyHeight: number;
  copies: number;
};

type DriftWallStyle = CSSProperties & {
  "--dw-tile-w": string;
  "--dw-tile-h": string;
  "--dw-gap": string;
  "--dw-radius": string;
  "--dw-perspective": string;
  "--dw-lift": string;
  "--dw-dim": number;
  "--dw-gray": number;
  "--dw-overlay": string;
  "--dw-edge": string;
};

const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function DriftWall({
  items,
  columns = 5,
  tileWidth = 200,
  tileHeight = 132,
  gap = 18,
  radius = 14,
  tilt = 16,
  turn = -14,
  roll = 0,
  perspective = 1200,
  depth = 120,
  speed = 42,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  pauseOnHover = false,
  lift = 64,
  fade = 0.6,
  dim = 0.55,
  grayscale = false,
  overlayColor = "#060010",
  className = "",
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<Array<HTMLDivElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColumnRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTimestampRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (event: MediaQueryListEvent) =>
      setReduced(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const columnItems = useMemo(() => {
    const safeColumns = Math.max(1, Math.floor(columns));
    const grouped = Array.from(
      { length: safeColumns },
      () => [] as DriftWallItem[],
    );
    items.forEach((item, index) => grouped[index % safeColumns].push(item));
    return grouped.map((column) =>
      column.length ? column : items.slice(0, 1),
    );
  }, [columns, items]);

  const columnMeta = useMemo<ColumnMeta[]>(() => {
    const unit = tileHeight + gap;
    return columnItems.map((column) => {
      const copyHeight = Math.max(unit, column.length * unit);
      const copies = Math.max(
        2,
        Math.ceil((containerHeight * 1.6) / copyHeight) + 1,
      );
      return { copyHeight, copies };
    });
  }, [columnItems, containerHeight, gap, tileHeight]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const directionSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, index) => {
      const alternateSign = index % 2 === 0 ? 1 : -1;
      return (
        speed * columnFactor(index, variance) * directionSign * alternateSign
      );
    });
  }, [columnItems, direction, speed, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map(
      (meta, index) => meta.copyHeight * ((index * 0.37) % 1),
    );
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnItems, columnMeta]);

  const applyPlaneTransform = useCallback(
    (x: number, y: number) => {
      const plane = planeRef.current;
      const container = containerRef.current;
      if (!plane || !container) return;
      const basePlaneWidth = columnItems.length * (tileWidth + gap);
      const scale = Math.max(
        0.5,
        (container.clientWidth / Math.max(basePlaneWidth, 1)) * 1.08,
      );
      plane.style.transform =
        `translate(-50%, -50%) scale(${scale}) ` +
        `rotateX(${tilt + y}deg) rotateY(${turn + x}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [columnItems.length, depth, gap, roll, tilt, tileWidth, turn],
  );

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null)
        lastTimestampRef.current = timestamp;
      const delta = Math.min(
        0.05,
        Math.max(0, timestamp - lastTimestampRef.current) / 1000,
      );
      lastTimestampRef.current = timestamp;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damping = 1 - Math.exp(-delta / 0.12);
      pointerDampedRef.current.x +=
        (targetX - pointerDampedRef.current.x) * damping;
      pointerDampedRef.current.y +=
        (targetY - pointerDampedRef.current.y) * damping;
      applyPlaneTransform(
        pointerDampedRef.current.x,
        pointerDampedRef.current.y,
      );

      columnMeta.forEach((meta, index) => {
        const track = trackRefs.current[index];
        if (!track || !meta) return;
        if (reduced) {
          track.style.transform = `translate3d(0, ${-(offsetsRef.current[index] ?? 0)}px, 0)`;
          return;
        }
        const paused = wallHoveredRef.current && pauseOnHover;
        const factor = paused || hoveredColumnRef.current === index ? 0 : 1;
        const target = baseVelocities[index] * factor;
        const ease = 1 - Math.exp(-delta / (target === 0 ? 0.16 : 0.28));
        velocitiesRef.current[index] +=
          (target - velocitiesRef.current[index]) * ease;
        let next =
          (offsetsRef.current[index] ?? 0) +
          velocitiesRef.current[index] * delta;
        next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
        offsetsRef.current[index] = next;
        track.style.transform = `translate3d(0, ${-next}px, 0)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimestampRef.current = null;
    };
  }, [
    applyPlaneTransform,
    baseVelocities,
    columnMeta,
    parallax,
    pauseOnHover,
    reduced,
  ]);

  const activate = useCallback((id: string, column: number) => {
    activeIdRef.current = id;
    hoveredColumnRef.current = column;
    setActiveId(id);
  }, []);

  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColumnRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        };
      }
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const tile = hit?.closest<HTMLElement>("[data-tile-id]");
      if (!tile) return;
      const id = tile.dataset.tileId;
      const column = Number(tile.dataset.column);
      if (!id || id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColumnRef.current = column;
      setActiveId(id);
    },
    [parallax, reduced],
  );

  const handlePointerLeave = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const style = useMemo<DriftWallStyle>(
    () => ({
      "--dw-tile-w": `${tileWidth}px`,
      "--dw-tile-h": `${tileHeight}px`,
      "--dw-gap": `${gap}px`,
      "--dw-radius": `${radius}px`,
      "--dw-perspective": `${perspective}px`,
      "--dw-lift": `${lift}px`,
      "--dw-dim": dim,
      "--dw-gray": grayscale ? 1 : 0,
      "--dw-overlay": overlayColor,
      "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
    }),
    [
      dim,
      fade,
      gap,
      grayscale,
      lift,
      overlayColor,
      perspective,
      radius,
      tileHeight,
      tileWidth,
    ],
  );

  const renderTile = (item: DriftWallItem, id: string, column: number) => {
    const content = (
      <span className="drift-wall__inner">
        <img
          src={item.image}
          alt={item.title ?? ""}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <span className="drift-wall__overlay" aria-hidden="true" />
      </span>
    );
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? " is-active" : ""}`,
      "data-tile-id": id,
      "data-column": column,
      onFocus: () => activate(id, column),
      onBlur: release,
    };
    if (item.href) {
      return (
        <a
          key={id}
          href={item.href}
          target="_blank"
          rel="noreferrer noopener"
          {...commonProps}
        >
          {content}
        </a>
      );
    }
    return (
      <div
        key={id}
        tabIndex={0}
        role="button"
        aria-label={item.title ?? "Tile"}
        {...commonProps}
      >
        {content}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`drift-wall ${reduced ? "drift-wall--reduced" : ""} ${className}`.trim()}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeave}
      role="group"
      aria-label="Drifting wall of documentation images"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((column, columnIndex) => {
          const meta = columnMeta[columnIndex];
          return (
            <div className="drift-wall__col" key={`column-${columnIndex}`}>
              <div
                className="drift-wall__track"
                ref={(element) => {
                  trackRefs.current[columnIndex] = element;
                }}
              >
                {Array.from({ length: meta.copies }).flatMap((_, copyIndex) =>
                  column.map((item, itemIndex) =>
                    renderTile(
                      item,
                      `${columnIndex}-${copyIndex}-${itemIndex}`,
                      columnIndex,
                    ),
                  ),
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
