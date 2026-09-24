"use client";

import { useEffect, useRef, useState } from "react";

interface SlideUpOnScrollProps {
    children: React.ReactNode;
    className?: string;
    /** Delay before the animation starts, in ms. Handy for staggering. */
    delay?: number;
    /** How far up the element starts, in px. Default 48. */
    offset?: number;
}

/**
 * Fades + slides its children up when they scroll into the viewport.
 * Fires once and disconnects. Honours prefers-reduced-motion.
 */
export default function SlideUpOnScroll({
    children,
    className = "",
    delay = 0,
    offset = 48,
}: SlideUpOnScrollProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay > 0) {
                        const t = setTimeout(() => setVisible(true), delay);
                        return () => clearTimeout(t);
                    }
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            style={{
                transform: visible ? "translateY(0)" : `translateY(${offset}px)`,
                opacity: visible ? 1 : 0,
                transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out",
            }}
            className={className}
        >
            {children}
        </div>
    );
}
