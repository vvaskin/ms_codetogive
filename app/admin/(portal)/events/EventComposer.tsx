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
    // the "Add event" header link navigates to #add-event, but browsers don't
    // open a <details> on hash navigation, so the composer opens itself and
    // moves focus to the summary for keyboard users
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
    <details
      className={className}
      id={id}
      ref={detailsRef}
      onToggle={(event) => {
        // closing the composer clears the hash so the effect above doesn't
        // immediately reopen it
        if (!event.currentTarget.open && window.location.hash === `#${id}`) {
          window.history.replaceState(
            window.history.state,
            "",
            `${window.location.pathname}${window.location.search}`,
          );
        }
      }}
    >
      {children}
    </details>
  );
}
