"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function EventComposer({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function openTargetedComposer() {
      if (window.location.hash !== `#${id}` || !detailsRef.current) return;

      detailsRef.current.open = true;
      window.requestAnimationFrame(() => {
        detailsRef.current?.scrollIntoView({ block: "start" });
        detailsRef.current?.querySelector<HTMLElement>("summary")?.focus({
          preventScroll: true,
        });
      });
    }

    openTargetedComposer();
    window.addEventListener("hashchange", openTargetedComposer);
    return () => window.removeEventListener("hashchange", openTargetedComposer);
  }, [id]);

  return (
    <details className={className} id={id} ref={detailsRef}>
      {children}
    </details>
  );
}
