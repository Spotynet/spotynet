"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type AnimationName = "fade-up" | "fade-in" | "slide-right" | "scale-in";

interface Props {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  animation?: AnimationName;
  delay?: number;
  threshold?: number;
}

const classMap: Record<AnimationName, string> = {
  "fade-up":     "anim-fade-up",
  "fade-in":     "anim-fade-in",
  "slide-right": "anim-slide-right",
  "scale-in":    "anim-scale-in",
};

export function AnimateIn({
  children,
  className,
  as: Tag = "div",
  animation = "fade-up",
  delay = 0,
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const Comp = Tag as React.ElementType;

  return (
    <Comp
      ref={ref}
      className={cn(visible ? classMap[animation] : "", className)}
      style={{
        opacity: visible ? undefined : 0,
        animationDelay: visible ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Comp>
  );
}
