"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<"bloom" | "done">("bloom");

  useEffect(() => {
    // Only show once per session — comment out if you want every refresh
    const seen = sessionStorage.getItem("flora-loaded");
    if (seen) {
      setShow(false);
      return;
    }
    const t1 = setTimeout(() => setPhase("done"), 1900);
    const t2 = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("flora-loaded", "1");
    }, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-cream dark:bg-forest-dim overflow-hidden"
        >
          {/* subtle gradient orbs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-ochre/10 rounded-full blur-[100px]"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-sage/10 rounded-full blur-[100px]"
          />

          <div className="relative flex flex-col items-center gap-8">
            {/* Flower bloom */}
            <div className="relative w-[160px] h-[160px] grid place-items-center">
              {/* stem */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 left-1/2 w-[3px] h-[56px] bg-sage-dark origin-bottom rounded-full -translate-x-1/2"
              />
              {/* leaves */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.55, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[38px] left-[calc(50%-10px)] w-6 h-3 bg-sage rounded-[100%_0_100%_0] origin-right"
              />
              <motion.div
                initial={{ scale: 0, rotate: 20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.62, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[46px] left-[calc(50%+2px)] w-5 h-2.5 bg-sage-dark rounded-[0_100%_0_100%] origin-left"
              />

              {/* petals container */}
              <motion.div
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-[110px] h-[110px]"
              >
                {/* 8 petals blooming */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 360) / 8;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: angle - 18, opacity: 0 }}
                      animate={{ scale: 1, rotate: angle, opacity: 1 }}
                      transition={{
                        delay: 0.22 + i * 0.06,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="absolute left-1/2 top-1/2 w-[36px] h-[54px] -ml-[18px] -mt-[42px] origin-bottom"
                      style={{ transformOrigin: "50% 100%" }}
                    >
                      <motion.div
                        animate={phase === "done" ? { scale: [1, 1.02, 1] } : {}}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
                        className="w-full h-full rounded-[100%_100%_55%_55%] bg-gradient-to-b from-ochre-light to-ochre shadow-[0_2px_12px_rgba(192,138,46,0.25)]"
                      />
                    </motion.div>
                  );
                })}

                {/* inner petals */}
                {Array.from({ length: 8 }).map((_, i) => {
                  const angle = (i * 360) / 8 + 22.5;
                  return (
                    <motion.div
                      key={`inner-${i}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.62 + i * 0.03, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-1/2 w-[22px] h-[32px] -ml-[11px] -mt-[26px] origin-bottom"
                      style={{ rotate: `${angle}deg` }}
                    >
                      <div className="w-full h-full rounded-[100%_100%_45%_45%] bg-gradient-to-b from-amber-200 to-ochre/80" />
                    </motion.div>
                  );
                })}

                {/* center */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.95, duration: 0.5, type: "spring", stiffness: 260, damping: 14 }}
                  className="absolute left-1/2 top-1/2 w-[30px] h-[30px] -ml-[15px] -mt-[15px] rounded-full bg-forest grid place-items-center shadow-glow"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-ochre-light"
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* logo + progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="text-center">
              <div className="font-display text-2xl tracking-tight">Flora Decora</div>
              <div className="eyebrow text-ink/40 dark:text-white/40 mt-1">Landscaping • Al Ain</div>
              <div className="mt-5 mx-auto w-[140px] h-[2px] rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-ochre origin-left"
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-3 text-xs text-ink/50 dark:text-white/50 tracking-wide"
              >
                Blooming…
              </motion.div>
            </motion.div>
          </div>

          {/* skip */}
          <button
            onClick={() => setShow(false)}
            className="absolute bottom-8 right-8 text-xs tracking-[0.14em] uppercase text-ink/40 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors"
          >
            Skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
