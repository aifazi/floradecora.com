"use client";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { damping: 30, stiffness: 90 });

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.floor(latest).toString() + suffix;
    });
    return () => unsub();
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
