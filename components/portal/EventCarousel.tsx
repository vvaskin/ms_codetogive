"use client";

import Image from "next/image";
import { useRef } from "react";
import { formatEventDate, type PortalEvent } from "@/lib/portal/mock-data";

export function EventCarousel({ events }: { events: PortalEvent[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) return null;

  function scrollByCard(direction: 1 | -1) {
    const row = rowRef.current;
    if (!row) return;
    const card = row.querySelector<HTMLElement>(".event-card");
    const step = card ? card.offsetWidth + 16 : row.clientWidth * 0.8;
    row.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  return (
    <div className="event-carousel">
      <button
        type="button"
        className="event-carousel-arrow prev"
        onClick={() => scrollByCard(-1)}
        aria-label="Previous events"
      >
        ‹
      </button>

      <div className="event-carousel-row" ref={rowRef}>
        {events.map((event) => (
          <article className="event-card" key={event.id}>
            <div className="event-card-media">
              <Image
                src={event.image}
                alt={event.title}
                fill
                unoptimized
                sizes="(max-width: 560px) 80vw, (max-width: 860px) 45vw, 22vw"
              />
              <span className={`event-tag tag-${event.category.toLowerCase()}`}>
                {event.category}
              </span>
            </div>
            <div className="event-card-body">
              <time className="event-card-date">
                {formatEventDate(event.date)}
              </time>
              <h3 className="event-card-title">{event.title}</h3>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        className="event-carousel-arrow next"
        onClick={() => scrollByCard(1)}
        aria-label="Next events"
      >
        ›
      </button>
    </div>
  );
}
