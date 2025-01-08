import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { HTMLAttributes, useCallback, useMemo } from "react";

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  perspective?: number;
  beamsPerSide?: number;
  beamSize?: number;
  beamDelayMax?: number;
  beamDelayMin?: number;
  beamDuration?: number;
  gridColor?: string;
}

const Beam = ({
  width,
  x,
  delay,
  duration,
}: {
  width: string | number;
  x: string | number;
  delay: number;
  duration: number;
}) => {
  const hue = 196; // #00AAEE hue
  const saturation = 100;
  const lightness = 47;

  return (
    <motion.div
      style={{
        position: "absolute",
        left: `${x}`,
        width: `${width}`,
        aspectRatio: "1/2",
        background: `linear-gradient(180deg, hsla(${hue}, ${saturation}%, ${lightness}%, 0.3), transparent)`,
      }}
      initial={{ y: "100cqmax", x: "-50%" }}
      animate={{ y: "-100%", x: "-50%" }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

export function WarpBackground({
  children,
  className,
  containerClassName,
  perspective = 1000,
  beamsPerSide = 4,
  beamSize = 8,
  beamDelayMax = 4,
  beamDelayMin = 0,
  beamDuration = 4,
  gridColor = "rgba(0, 170, 238, 0.1)",
  ...props
}: WarpBackgroundProps) {
  const generateBeams = useCallback(() => {
    const beams = [];
    const cellsPerSide = Math.floor(100 / beamSize);
    const step = cellsPerSide / beamsPerSide;

    for (let i = 0; i < beamsPerSide; i++) {
      const x = Math.floor(i * step);
      const delay = Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin;
      beams.push({ x, delay });
    }
    return beams;
  }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin]);

  const topBeams = useMemo(() => generateBeams(), [generateBeams]);
  const rightBeams = useMemo(() => generateBeams(), [generateBeams]);
  const bottomBeams = useMemo(() => generateBeams(), [generateBeams]);
  const leftBeams = useMemo(() => generateBeams(), [generateBeams]);

  return (
    <div
      className={cn("relative rounded-lg border bg-background p-8", className)}
      {...props}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg [mask-image:radial-gradient(white,transparent_85%)]",
          containerClassName
        )}
      >
        <div
          className="absolute inset-0"
          style={{
            perspective: `${perspective}px`,
            transform: "rotateX(65deg) translateY(-50%)",
          }}
        >
          {[topBeams, rightBeams, bottomBeams, leftBeams].map((beams, i) => (
            <div
              key={i}
              className="absolute inset-0 h-[200%]"
              style={{
                background: `
                  linear-gradient(${gridColor} 0 1px, transparent 1px) 50% -0.5px / ${beamSize}% ${beamSize}% repeat,
                  linear-gradient(90deg, ${gridColor} 0 1px, transparent 1px) 50% 50% / ${beamSize}% ${beamSize}% repeat
                `,
                transform: `rotate(${i * 90}deg)`,
                transformOrigin: i % 2 ? "100% 0" : "50% 0",
              }}
            >
              {beams.map((beam, index) => (
                <Beam
                  key={index}
                  width={`${beamSize}%`}
                  x={`${beam.x * beamSize}%`}
                  delay={beam.delay}
                  duration={beamDuration}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="relative">{children}</div>
    </div>
  );
} 