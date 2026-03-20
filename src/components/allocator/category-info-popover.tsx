"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Building2, FileText } from "lucide-react";
import type { CategoryDetail } from "@/lib/data/category-details";

interface CategoryInfoPopoverProps {
  detail: CategoryDetail;
  categoryName: string;
}

export function CategoryInfoPopover({
  detail,
  categoryName,
}: CategoryInfoPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gov-navy/10 hover:bg-gov-navy/20 transition-colors cursor-pointer shrink-0"
        aria-label={`Learn more about ${categoryName}`}
      >
        <Info className="w-2.5 h-2.5 text-gov-navy/60" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black/20 z-40 sm:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Popover */}
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                mass: 0.8,
              }}
              className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-auto bottom-4 sm:bottom-auto sm:top-6 sm:-left-2 z-50 sm:w-[340px]"
            >
              <div className="bg-white border border-gov-navy/15 shadow-xl overflow-hidden">
                {/* Header bar */}
                <motion.div
                  className="bg-gov-navy px-4 py-2.5 flex items-center justify-between"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <div>
                    <h4 className="text-white text-sm font-bold leading-tight">
                      {categoryName}
                    </h4>
                    <p className="text-white/70 text-xs mt-0.5">
                      {detail.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>

                {/* Bullet points */}
                <div className="px-4 py-3">
                  <ul className="space-y-2">
                    {detail.details.map((point, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.08 + i * 0.06,
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="flex gap-2 text-xs text-gov-text leading-relaxed"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.1 + i * 0.06,
                            type: "spring",
                            stiffness: 500,
                            damping: 15,
                          }}
                          className="w-1.5 h-1.5 rounded-full bg-gov-red shrink-0 mt-1.5"
                        />
                        <span>{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Footer with departments and source */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="px-4 py-2.5 bg-gov-well border-t border-gov-well-border"
                >
                  <div className="flex items-start gap-1.5 mb-1.5">
                    <Building2 className="w-3 h-3 text-gov-text/40 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gov-text/50 leading-snug">
                      {detail.departments.join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <FileText className="w-3 h-3 text-gov-text/40 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gov-text/50 leading-snug">
                      {detail.source}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
