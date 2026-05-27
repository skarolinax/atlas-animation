import React, { useMemo } from "react";

/**
 * Progressive / gradual blur strip.
 *
 * Stacks `divCount` layers, each with a stronger blur, masked by a gradient
 * so the blur ramps from 0 → max across `height`. Output is rendered
 * absolutely so it sits inside any `position: relative` parent.
 *
 * Props mirror the popular Ansh Dhanani / Reactbits component shape so the
 * usage code from that snippet works as-is.
 */
export default function GradualBlur({
    position = "bottom",
    height = "6rem",
    strength = 2,
    divCount = 5,
    curve = "linear", // "linear" | "bezier"
    exponential = false,
    opacity = 1,
    zIndex = 1,
    target = "parent", // accepted but always renders absolute
    style,
    className,
}) {
    const layers = useMemo(() => {
        const arr = [];
        for (let i = 0; i < divCount; i++) {
            // 0..1 progress across stack
            const t = (i + 1) / divCount;
            // Choose easing for blur amount
            const easeBlur = exponential
                ? Math.pow(t, 2)
                : curve === "bezier"
                    ? t * t * (3 - 2 * t)
                    : t;
            const blurPx = easeBlur * strength * 8; // 8px is the visual unit
            // Each layer is masked so it only contributes to a slice further from the edge
            const sliceStart = (i / divCount) * 100;
            const sliceEnd = 100;
            const fadeFromEdge = position === "top" || position === "left";
            const gradStops = fadeFromEdge
                ? `black ${sliceStart}%, transparent ${sliceEnd}%`
                : `transparent ${100 - sliceEnd}%, black ${100 - sliceStart}%`;
            const gradDir = position === "top" || position === "bottom"
                ? "to bottom"
                : "to right";
            const mask = `linear-gradient(${gradDir}, ${gradStops})`;
            arr.push({ blurPx, mask });
        }
        return arr;
    }, [divCount, strength, exponential, curve, position]);

    const baseStyle = {
        position: "absolute",
        pointerEvents: "none",
        opacity,
        zIndex,
        ...(position === "bottom" && { left: 0, right: 0, bottom: 0, height }),
        ...(position === "top"    && { left: 0, right: 0, top: 0,    height }),
        ...(position === "left"   && { top: 0, bottom: 0, left: 0,   width: height }),
        ...(position === "right"  && { top: 0, bottom: 0, right: 0,  width: height }),
        ...style,
    };

    return (
        <div className={className} style={baseStyle} aria-hidden="true">
            {layers.map((l, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        inset: 0,
                        backdropFilter: `blur(${l.blurPx.toFixed(2)}px)`,
                        WebkitBackdropFilter: `blur(${l.blurPx.toFixed(2)}px)`,
                        maskImage: l.mask,
                        WebkitMaskImage: l.mask,
                    }}
                />
            ))}
        </div>
    );
}
