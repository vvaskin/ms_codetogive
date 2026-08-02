"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import React from "react";
import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { SiteToolsTray } from "@/components/SiteTools";
import { localePaths } from "@/content/site-data";
import styles from "./ContributorPortalExperience.module.css";

const s = (w = 20) => ({ width: w, height: w, display: "block" as const });
const ico = (strokeWidth = 2) => ({
  fill: "none",
  stroke: "currentColor",
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

const IcoClock = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={12} cy={12} r={10} />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcoCalendar = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <rect x={3} y={4} width={18} height={18} rx={2} />
    <line x1={16} y1={2} x2={16} y2={6} />
    <line x1={8} y1={2} x2={8} y2={6} />
    <line x1={3} y1={10} x2={21} y2={10} />
  </svg>
);
const IcoActivity = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IcoHeart = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IcoLeaf = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M17 8C8 10 5.9 16.17 3.82 19.34A1 1 0 0 0 4.69 21A13 13 0 0 0 19 12.68" />
    <path d="M17 8L12 3 7 8" />
    <line x1={12} y1={3} x2={12} y2={19} />
  </svg>
);
const IcoStar = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IcoUsers = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx={9} cy={7} r={4} />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IcoLock = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IcoDollar = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <line x1={12} y1={1} x2={12} y2={23} />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IcoHome = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const IcoRefresh = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
const IcoAward = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={12} cy={8} r={6} />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const IcoTrophy = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="8 6 2 6 2 12 8 12" />
    <polyline points="16 6 22 6 22 12 16 12" />
    <path d="M12 19v3" />
    <path d="M8 21h8" />
    <path d="M8 6v7a4 4 0 0 0 8 0V6" />
  </svg>
);
const IcoNutrition = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const IcoBell = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IcoSearch = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={11} cy={11} r={8} />
    <line x1={21} y1={21} x2={16.65} y2={16.65} />
  </svg>
);
const IcoMapPin = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);
const IcoPencil = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IcoHandshake = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
  </svg>
);
const IcoShield = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcoCheck = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico(2.5)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcoUser = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={12} cy={8} r={4} />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IcoMessage = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const IcoShare = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <circle cx={18} cy={5} r={3} />
    <circle cx={6} cy={12} r={3} />
    <circle cx={18} cy={19} r={3} />
    <line x1={8.59} y1={13.51} x2={15.42} y2={17.49} />
    <line x1={15.41} y1={6.51} x2={8.59} y2={10.49} />
  </svg>
);
const IcoSparkle = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    <line x1={12} y1={12} x2={12} y2={12} />
  </svg>
);
const IcoChevronLeft = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" style={s(size)} {...ico()}>
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const navLinks = ["My Portal", "My Donations", "My Volunteer", "Events", "Donate"];

const donorJourneySteps = [
  { label: "First donation", done: true },
  { label: "Regular donor", done: true, active: true },
  { label: "Champion", done: false, badge: "$" },
  { label: "Patron", done: false, badge: "*" },
];

const donorStats: { icon: React.ReactNode; value: string; label: string; color: string }[] = [
  { icon: <IcoDollar size={22} />, value: "$325", label: "total donated", color: "#e85d7a" },
  { icon: <IcoCalendar size={22} />, value: "7", label: "donations made", color: "#4a9fd4" },
  { icon: <IcoHome size={22} />, value: "4", label: "programmes funded", color: "#4caf89" },
  { icon: <IcoUsers size={22} />, value: "~60", label: "families impacted", color: "#d4a017" },
];

const donorDonationHistory = [
  { month: "Feb", value: 25 },
  { month: "Mar", value: 50 },
  { month: "Apr", value: 25 },
  { month: "May", value: 50 },
  { month: "Jun", value: 100 },
  { month: "Jul", value: 75, highlight: true },
];

const donorBadges: { icon: React.ReactNode; label: string; desc: string; earned: boolean; bg: string; iconBg: string; iconColor: string }[] = [
  { icon: <IcoHeart size={20} />, label: "First Give", desc: "Made your first donation", earned: true, bg: "#fdf6e3", iconBg: "#fff", iconColor: "#a07800" },
  { icon: <IcoRefresh size={20} />, label: "Consistent", desc: "Donated 3 months in a row", earned: true, bg: "#edf7f0", iconBg: "#fff", iconColor: "#2e7d5f" },
  { icon: <IcoAward size={20} />, label: "Supporter", desc: "Donated $25 or more", earned: true, bg: "#fdf0f2", iconBg: "#fff", iconColor: "#c13057" },
  { icon: <IcoLock size={20} />, label: "Champion", desc: "Donated $100+ in one month", earned: false, bg: "#f7f5f3", iconBg: "#eee", iconColor: "#bbb" },
  { icon: <IcoLock size={20} />, label: "Patron", desc: "Total giving exceeds $500", earned: false, bg: "#f7f5f3", iconBg: "#eee", iconColor: "#bbb" },
  { icon: <IcoLock size={20} />, label: "Year One", desc: "Donated for 12 months", earned: false, bg: "#f7f5f3", iconBg: "#eee", iconColor: "#bbb" },
];

const donationBreakdown = [
  { name: "Sport", pct: 35, color: "#e85d7a" },
  { name: "Nutrition", pct: 25, color: "#4caf89" },
  { name: "Family", pct: 22, color: "#4a9fd4" },
  { name: "CSR", pct: 18, color: "#c8961a" },
];

const donationTiers: { amount: number; label: string; desc: string; icon: React.ReactNode }[] = [
  { amount: 25, label: "Supporter", desc: "Covers sport equipment for one child for a term", icon: <IcoAward size={22} /> },
  { amount: 50, label: "Champion", desc: "Funds a family's nutrition session and meal kit", icon: <IcoNutrition size={22} /> },
  { amount: 100, label: "Hero", desc: "Sponsors a full volunteer shift for one programme", icon: <IcoStar size={22} /> },
  { amount: 250, label: "Patron", desc: "Covers a week of family support for one household", icon: <IcoTrophy size={22} /> },
];

const impactStats = [
  { value: "$42K", label: "raised this year", color: "#e85d7a" },
  { value: "1,200+", label: "families supported", color: "#4a9fd4" },
  { value: "18", label: "programmes funded", color: "#4caf89" },
  { value: "94%", label: "goes directly to families", color: "#d4a017" },
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, outerR: number, innerR: number, startDeg: number, endDeg: number) {
  const s1 = polarToCartesian(cx, cy, outerR, startDeg);
  const e1 = polarToCartesian(cx, cy, outerR, endDeg);
  const s2 = polarToCartesian(cx, cy, innerR, endDeg);
  const e2 = polarToCartesian(cx, cy, innerR, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s1.x} ${s1.y}`,
    `A ${outerR} ${outerR} 0 ${large} 1 ${e1.x} ${e1.y}`,
    `L ${s2.x} ${s2.y}`,
    `A ${innerR} ${innerR} 0 ${large} 0 ${e2.x} ${e2.y}`,
    "Z",
  ].join(" ");
}

function DonutChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = 90;
  const cy = 90;
  const outerR = 68;
  const innerR = 42;
  const segments = donationBreakdown.reduce<Array<{ name: string; pct: number; color: string; start: number; end: number }>>((acc, d) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    const span = (d.pct / 100) * 360;
    const end = start + span;
    acc.push({ ...d, start, end });
    return acc;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <svg width={180} height={180} viewBox="0 0 180 180">
        {segments.map((seg, i) => {
          const isHov = hovered === i;
          return (
            <path
              key={seg.name}
              d={arcPath(cx, cy, isHov ? outerR + 6 : outerR, innerR, seg.start, seg.end - 0.5)}
              fill={seg.color}
              opacity={hovered !== null && !isHov ? 0.5 : 1}
              style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize={20} fontWeight={800} fill="#1a1a1a">
          {hovered !== null ? `${segments[hovered].pct}%` : "$325"}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize={11} fill="#999">
          {hovered !== null ? segments[hovered].name : "total donated"}
        </text>
      </svg>
      <div style={{ display: "flex", gap: 0, width: "100%", borderRadius: 12, overflow: "hidden", border: "1px solid #ede8e3" }}>
        {segments.map((seg, i) => (
          <div
            key={seg.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: seg.pct,
              padding: "12px 14px",
              backgroundColor: hovered === i ? seg.color : "#fff",
              cursor: "default",
              transition: "background 0.2s",
              borderRight: i < segments.length - 1 ? "1px solid #ede8e3" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: seg.color, flexShrink: 0, opacity: hovered === i ? 0 : 1, transition: "opacity 0.15s" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: hovered === i ? "#fff" : "#1a1a1a" }}>{seg.name}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: hovered === i ? "#fff" : seg.color }}>{seg.pct}%</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>Hover a segment to explore - 94% goes directly to programmes</p>
    </div>
  );
}

function ProfilePage({ onBack }: { onBack: () => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: "Sarah Chan",
    email: "sarah.chan@email.com",
    phone: "+61 412 345 678",
    location: "Sydney, NSW",
    about: "Passionate about community sport and making a difference for families in need. I've been volunteering with this organisation since 2023 and it's been one of the most rewarding experiences of my life.",
  });
  const [draft, setDraft] = useState({ ...form });

  const fieldStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1.5px solid #e8e3de",
    borderRadius: 9,
    fontSize: 13,
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box" as const,
    backgroundColor: "#fafaf9",
    fontFamily: "inherit",
    transition: "border-color 0.15s",
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 6, marginBottom: 28, padding: 0 }}>
        <IcoChevronLeft size={14} /> Back to portal
      </button>

      <div style={{ backgroundColor: "#fdf0f2", borderRadius: 20, padding: "36px 40px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -30, width: 140, height: 140, borderRadius: "50%", backgroundColor: "#7ecec4", opacity: 0.18 }} />
        <div style={{ position: "absolute", right: 60, bottom: -40, width: 100, height: 100, borderRadius: "50%", backgroundColor: "#e85d7a", opacity: 0.1 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 28, position: "relative", zIndex: 1 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 88, height: 88, borderRadius: "50%", backgroundColor: "#8bbdd9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, color: "#fff", border: "4px solid #fff", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>SC</div>
            <div style={{ position: "absolute", bottom: 2, right: 2, width: 18, height: 18, borderRadius: "50%", backgroundColor: "#4caf89", border: "2px solid #fff" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{form.fullName}</h1>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 12px" }}>Regular Volunteer - Member since March 2023</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              <span style={{ fontSize: 12, backgroundColor: "#fbd4dc", color: "#c13057", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}>Regular volunteer</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, backgroundColor: "#d6f0e8", color: "#2e7d5f", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}><IcoLeaf size={11} />First Steps</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, backgroundColor: "#fdf6e3", color: "#a07800", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}><IcoStar size={11} />Regular</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, backgroundColor: "#e8f2fb", color: "#1e5c8a", borderRadius: 20, padding: "3px 10px", fontWeight: 600 }}><IcoHandshake size={11} />Team Player</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.07)", position: "relative", zIndex: 1 }}>
          {[
            { value: "42", label: "Hours given", color: "#e85d7a" },
            { value: "19", label: "Sessions", color: "#4a9fd4" },
            { value: "3", label: "Programmes", color: "#e07043" },
            { value: "~35", label: "People helped", color: "#d4a017" },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 14, padding: "28px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>Contact &amp; About</p>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 8, border: "1.5px solid #e85d7a", backgroundColor: "transparent", color: "#e85d7a", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fdf0f2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <IcoPencil size={14} /> Edit profile
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setDraft({ ...form }); setEditing(false); }} style={{ padding: "7px 18px", borderRadius: 8, border: "1.5px solid #e8e3de", backgroundColor: "#fff", color: "#888", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { setForm({ ...draft }); setEditing(false); }} style={{ padding: "7px 18px", borderRadius: 8, border: "none", backgroundColor: "#e85d7a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save changes</button>
            </div>
          )}
        </div>

        {editing ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {([
                ["Full name", "fullName"],
                ["Email", "email"],
                ["Phone", "phone"],
                ["Location", "location"],
              ] as [string, keyof typeof draft][]).map(([label, key]) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
                  <input
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                    style={fieldStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#e85d7a";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e8e3de";
                    }}
                  />
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 6 }}>About</div>
              <textarea
                value={draft.about}
                onChange={(e) => setDraft({ ...draft, about: e.target.value })}
                rows={4}
                style={{ ...fieldStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#e85d7a";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e8e3de";
                }}
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {([
                ["Full name", form.fullName],
                ["Email", form.email],
                ["Phone", form.phone],
                ["Location", form.location],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: "#bbb", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "#1a1a1a", fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #f0ece8", paddingTop: 20 }}>
              <div style={{ fontSize: 11, color: "#bbb", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 8 }}>About</div>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, margin: 0 }}>{form.about}</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

const newsEvents = [
  { tag: "Sport", tagColor: "#e85d7a", tagBg: "#fbd4dc", title: "Saturday Morning Football Clinic returns for Term 3", date: "Aug 9, 2026", photo: "https://images.unsplash.com/photo-1752681305099-89eab8580496?w=480&h=280&fit=crop&auto=format" },
  { tag: "CSR", tagColor: "#1e5c8a", tagBg: "#d6e9f8", title: "Corporate Partner Day - ANZ Bank Team Joining Us", date: "Aug 14, 2026", photo: "https://images.unsplash.com/photo-1560220604-1985ebfe28b1?w=480&h=280&fit=crop&auto=format" },
  { tag: "Nutrition", tagColor: "#2e7d5f", tagBg: "#d6f0e8", title: "Healthy Lunchbox Workshop - Spots Still Open", date: "Aug 16, 2026", photo: "https://images.unsplash.com/photo-1653233797467-1a528819fd4f?w=480&h=280&fit=crop&auto=format" },
  { tag: "Community", tagColor: "#a07800", tagBg: "#fdf6e3", title: "Annual Community Picnic Planning Kickoff", date: "Aug 20, 2026", photo: "https://images.unsplash.com/photo-1592753054398-9fa298d40e85?w=480&h=280&fit=crop&auto=format" },
  { tag: "Sport", tagColor: "#e85d7a", tagBg: "#fbd4dc", title: "New Swimming Programme Launching in September", date: "Aug 22, 2026", photo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=480&h=280&fit=crop&auto=format" },
  { tag: "CSR", tagColor: "#1e5c8a", tagBg: "#d6e9f8", title: "Westpac Foundation Grant - Community Impact Report", date: "Aug 28, 2026", photo: "https://images.unsplash.com/photo-1616680214084-22670de1bc82?w=480&h=280&fit=crop&auto=format" },
  { tag: "Family Support", tagColor: "#7b3fa0", tagBg: "#ede0f7", title: "Back-to-School Backpack Drive - Help Us Pack 300 Bags", date: "Sep 3, 2026", photo: "https://images.unsplash.com/photo-1758599668178-d9716bbda9d5?w=480&h=280&fit=crop&auto=format" },
  { tag: "Nutrition", tagColor: "#2e7d5f", tagBg: "#d6f0e8", title: "Chef Volunteer Spotlight: Meet Marcus", date: "Sep 5, 2026", photo: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=480&h=280&fit=crop&auto=format" },
  { tag: "Sport", tagColor: "#e85d7a", tagBg: "#fbd4dc", title: "Junior Athletics Day - Register Your Club", date: "Sep 12, 2026", photo: "https://images.unsplash.com/photo-1766066015219-b10a97dbb781?w=480&h=280&fit=crop&auto=format" },
];

function NewsCarousel() {
  const [page, setPage] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const CARDS_PER_PAGE = 3;
  const totalPages = Math.ceil(newsEvents.length / CARDS_PER_PAGE);

  const goTo = (next: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setPage(next % totalPages);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => goTo(page + 1), 5000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [page]);

  const visible = newsEvents.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  return (
    <section style={{ marginBottom: 56 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4a9fd4", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>What&apos;s On</p>
        <button style={{ fontSize: 12, color: "#e85d7a", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>See all events -&gt;</button>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>News &amp; upcoming events.</h2>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === page ? 20 : 7, height: 7, borderRadius: 4, border: "none", cursor: "pointer", padding: 0, backgroundColor: i === page ? "#e85d7a" : "#e0d8d2", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, opacity: animating ? 0 : 1, transform: animating ? "translateX(-24px)" : "translateX(0)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
        {visible.map((ev, i) => (
          <div
            key={`${page}-${i}`}
            style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.09)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ height: 140, overflow: "hidden", backgroundColor: "#f0ece8" }}>
              <img src={ev.photo} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ padding: "14px 16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: ev.tagColor, backgroundColor: ev.tagBg, borderRadius: 20, padding: "3px 10px" }}>{ev.tag}</span>
                <span style={{ fontSize: 11, color: "#bbb" }}>{ev.date}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.45 }}>{ev.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dashboard() {
  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px" }}>
      <section style={{ backgroundColor: "#fdf0f2", borderRadius: 16, padding: "36px 40px", marginBottom: 48, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", right: 140, top: -18, width: 60, height: 60, borderRadius: "50%", backgroundColor: "#7ecec4", opacity: 0.6, zIndex: 0 }} />
        <div style={{ position: "absolute", right: 108, bottom: -12, width: 36, height: 36, borderRadius: "50%", backgroundColor: "#7ecec4", opacity: 0.45, zIndex: 0 }} />
        <div style={{ zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "#fbd4dc", borderRadius: 20, padding: "4px 12px", marginBottom: 14 }}>
            <span style={{ color: "#c13057", display: "flex" }}><IcoSparkle size={12} /></span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#c13057", letterSpacing: "0.06em", textTransform: "uppercase" }}>Thank you for showing up</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>Welcome back, Sarah.</h1>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, maxWidth: 340, margin: 0 }}>Because of people like you, 490+ families get to show the world #somuchability. Seriously - thank you.</p>
        </div>
        <div style={{ zIndex: 1, backgroundColor: "#e85d7a", borderRadius: 14, padding: "24px 32px", textAlign: "center", minWidth: 140, color: "#fff", flexShrink: 0 }}>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>42</div>
          <div style={{ fontSize: 13, marginTop: 6, opacity: 0.9 }}>hours given this year</div>
        </div>
      </section>
      <NewsCarousel />
    </main>
  );
}

function MyDonationsPage() {
  const maxDonation = Math.max(...donorDonationHistory.map((d) => d.value));

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4a9fd4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Donor Dashboard</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>My Donations.</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>See your giving history, your impact, and how your money is put to work.</p>
      </div>

      <section style={{ marginBottom: 56 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4a9fd4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Donor Journey</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>Your giving path.</h2>
        <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 14, padding: "32px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            {donorJourneySteps.map((step, i) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i < donorJourneySteps.length - 1 ? 1 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  {step.done ? (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: step.active ? "#4a9fd4" : "#4caf89", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: step.active ? "0 0 0 4px #d6e9f8" : "none" }}>
                      <IcoCheck size={16} />
                    </div>
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#999", backgroundColor: "#fafafa" }}>{step.badge}</div>
                  )}
                  <span style={{ fontSize: 11, color: step.active ? "#4a9fd4" : "#555", fontWeight: step.active ? 700 : 400, textAlign: "center", whiteSpace: "nowrap" }}>{step.label}</span>
                </div>
                {i < donorJourneySteps.length - 1 && <div style={{ flex: 1, height: 3, backgroundColor: step.done && !step.active ? "#4caf89" : "#e8e3df", margin: "0 8px", marginBottom: 22, borderRadius: 2 }} />}
              </div>
            ))}
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: "#666", margin: 0 }}>$175 more to reach Champion status - your impact is growing.</p>
        </div>
      </section>

      <section style={{ marginBottom: 56 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4a9fd4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Your Impact</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>What your generosity has made possible.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {donorStats.map((stat) => (
            <div key={stat.label} style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 14, padding: "24px 20px" }}>
              <div style={{ color: stat.color, marginBottom: 10 }}>{stat.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: "#777", lineHeight: 1.4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 56 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#4a9fd4", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Fund Allocation</p>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>Where your money goes.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 16, padding: "28px 32px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>Programme breakdown</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 20 }}>How your donations are allocated</div>
            <DonutChart />
          </div>
          <div style={{ backgroundColor: "#f8f5f2", borderRadius: 16, padding: "28px 32px" }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a", marginBottom: 2 }}>Donation history</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 24 }}>Last 6 months - $325 total</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 120, paddingBottom: 4 }}>
              {donorDonationHistory.map((bar) => (
                <div key={bar.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: bar.highlight ? 700 : 400, color: bar.highlight ? "#4a9fd4" : "#555" }}>${bar.value}</span>
                  <div style={{ width: "100%", height: `${(bar.value / maxDonation) * 90}px`, backgroundColor: bar.highlight ? "#4a9fd4" : "#b8d8f0", borderRadius: "5px 5px 0 0" }} />
                  <span style={{ fontSize: 11, color: "#888" }}>{bar.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#4a9fd4", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Donor Badges</p>
          <div style={{ backgroundColor: "#d6e9f8", color: "#1e5c8a", fontSize: 12, fontWeight: 600, borderRadius: 20, padding: "4px 12px" }}>3 of 6 earned</div>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 24px" }}>Celebrating your generosity.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
          {donorBadges.map((badge) => (
            <div key={badge.label} style={{ backgroundColor: badge.bg, borderRadius: 14, padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: badge.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: badge.iconColor, boxShadow: badge.earned ? "0 2px 8px rgba(0,0,0,0.08)" : "none" }}>{badge.icon}</div>
                {badge.earned && <span style={{ fontSize: 10, fontWeight: 700, color: "#4caf89", letterSpacing: "0.06em", textTransform: "uppercase" as const, backgroundColor: "rgba(255,255,255,0.7)", padding: "3px 8px", borderRadius: 10 }}>Earned</span>}
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: badge.earned ? "#1a1a1a" : "#888", marginBottom: 4 }}>{badge.label}</div>
              <div style={{ fontSize: 11, color: badge.earned ? "#555" : "#aaa", lineHeight: 1.4 }}>{badge.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function MyVolunteerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ chineseName: "", ageGroup: "", gender: "", about: "", hearAbout: "" });

  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 };
  const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 14px", border: "1.5px solid #e8e3de", borderRadius: 10, fontSize: 14, color: "#1a1a1a", outline: "none", boxSizing: "border-box", backgroundColor: "#fff", fontFamily: "inherit", transition: "border-color 0.15s" };

  const RadioOption = ({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) => (
    <div onClick={onSelect} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${selected ? "#e85d7a" : "#e8e3de"}`, backgroundColor: selected ? "#fdf0f2" : "#fff", cursor: "pointer", transition: "all 0.15s" }}>
      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selected ? "#e85d7a" : "#d0cbc5"}`, backgroundColor: selected ? "#e85d7a" : "#fff", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
        {selected && <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#fff" }} />}
      </div>
      <span style={{ fontSize: 14, color: selected ? "#c13057" : "#333", fontWeight: selected ? 600 : 400 }}>{label}</span>
    </div>
  );

  const canSubmit = form.ageGroup && form.gender && form.hearAbout;

  if (submitted) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "#d6f0e8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#2e7d5f" }}>
          <IcoCheck size={28} />
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Application submitted!</h1>
        <p style={{ fontSize: 16, color: "#666", maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.7 }}>Thank you for wanting to volunteer with us. Our team will review your application and reach out within 5 business days.</p>
        <button onClick={() => { setSubmitted(false); setForm({ chineseName: "", ageGroup: "", gender: "", about: "", hearAbout: "" }); }} style={{ padding: "12px 32px", borderRadius: 12, border: "none", backgroundColor: "#e85d7a", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          Submit another application
        </button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 48px" }}>
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Get Involved</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Become a Volunteer.</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Join our community and make a real difference for families across Western Sydney.</p>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 16, padding: "36px 40px", display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <div style={labelStyle}><span style={{ color: "#888", display: "flex" }}><IcoUser size={16} /></span>Chinese name<span style={{ fontSize: 12, color: "#bbb", fontWeight: 400 }}>(optional - 中文姓名)</span></div>
          <input value={form.chineseName} onChange={(e) => setForm({ ...form, chineseName: e.target.value })} placeholder="陳大文" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "#888", display: "flex" }}><IcoCalendar size={16} /></span>Age group<span style={{ color: "#e85d7a" }}>*</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["14-15 yrs", "16-17 yrs", "18 or above"].map((opt) => <RadioOption key={opt} label={opt} selected={form.ageGroup === opt} onSelect={() => setForm({ ...form, ageGroup: opt })} />)}
          </div>
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "#888", display: "flex" }}><IcoUsers size={16} /></span>Gender<span style={{ color: "#e85d7a" }}>*</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Female", "Male", "Prefer not to say"].map((opt) => <RadioOption key={opt} label={opt} selected={form.gender === opt} onSelect={() => setForm({ ...form, gender: opt })} />)}
          </div>
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "#888", display: "flex" }}><IcoMessage size={16} /></span>About you</div>
          <p style={{ fontSize: 12, color: "#999", margin: "0 0 10px" }}>Tell us about your skills or why you want to volunteer...</p>
          <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={5} placeholder="I'm passionate about community sport and want to use my background in coaching to help young athletes build confidence..." style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65 }} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
        </div>
        <div>
          <div style={labelStyle}><span style={{ color: "#888", display: "flex" }}><IcoShare size={16} /></span>How did you hear about us?<span style={{ color: "#e85d7a" }}>*</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Existing Love 21 volunteer", "Love 21 social media", "Love 21 email newsletter", "Company referral", "Other"].map((opt) => (
              <RadioOption key={opt} label={opt} selected={form.hearAbout === opt} onSelect={() => setForm({ ...form, hearAbout: opt })} />
            ))}
          </div>
        </div>
        <button onClick={() => { if (canSubmit) setSubmitted(true); }} style={{ padding: "13px", borderRadius: 11, border: "none", backgroundColor: canSubmit ? "#e85d7a" : "#f0ece8", color: canSubmit ? "#fff" : "#bbb", fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "default", transition: "all 0.15s", marginTop: 4 }}>
          Submit application
        </button>
      </div>
    </main>
  );
}

const initialComments = [
  { id: 1, name: "Mei Tanaka", initials: "MT", avatarColor: "#8bbdd9", role: "Parent", date: "Jul 28, 2026", message: "Sarah helped my daughter tie her shoelaces before every session and never made her feel rushed. That small act of patience meant the world to us. Thank you for showing up every single week." },
  { id: 2, name: "David Okafor", initials: "DO", avatarColor: "#4caf89", role: "Parent", date: "Jul 19, 2026", message: "My son used to be terrified of group activities. After just three sessions with this programme, he's asking to go back. The volunteers made him feel safe and included. We're so grateful." },
  { id: 3, name: "Priya Sharma", initials: "PS", avatarColor: "#d4a017", role: "Parent", date: "Jul 12, 2026", message: "Knowing there are people like the volunteers here who genuinely care - it restores your faith in community. Our family has been part of this programme for six months and we feel so supported." },
  { id: 4, name: "James Nguyen", initials: "JN", avatarColor: "#7b3fa0", role: "Parent", date: "Jun 30, 2026", message: "The nutrition workshop changed how we cook at home. My kids are eating vegetables they never touched before! Whoever organised and volunteered for that session - you changed our weekly routine." },
];

function CommunityVoices() {
  return (
    <section style={{ marginTop: 72, paddingTop: 56, borderTop: "1px solid #ede8e3" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Community</p>
        <span style={{ fontSize: 12, color: "#bbb" }}>{initialComments.length} messages</span>
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>Voices from our community.</h2>
      <p style={{ fontSize: 14, color: "#888", margin: "0 0 36px" }}>Warm words from the families whose lives you&apos;ve touched.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {initialComments.map((comment) => (
          <div key={comment.id} style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 16, padding: "24px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, lineHeight: 1, color: "#fbd4dc", fontFamily: "Georgia, serif", marginBottom: 10, marginTop: -6 }}>&quot;</div>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, margin: "0 0 20px", flex: 1 }}>{comment.message}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: comment.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{comment.initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{comment.name}</div>
                <div style={{ fontSize: 11, color: "#bbb" }}>{comment.role} - {comment.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const allEvents = [
  { id: 1, tag: "Sport", tagColor: "#e85d7a", tagBg: "#fbd4dc", title: "Saturday Morning Football Clinic", date: "2026-08-09", dateLabel: "Sat 9 Aug", time: "8:00 AM - 11:00 AM", location: "Parramatta Park, NSW", spots: 4, totalSpots: 12, overview: "Join 60+ kids on the field for our flagship sport programme. Help coaches run drills, manage equipment, and keep the energy high for families from across Western Sydney.", photo: "https://images.unsplash.com/photo-1752681305099-89eab8580496?w=600&h=340&fit=crop&auto=format" },
  { id: 2, tag: "CSR", tagColor: "#1e5c8a", tagBg: "#d6e9f8", title: "Corporate Partner Day - ANZ Bank", date: "2026-08-14", dateLabel: "Fri 14 Aug", time: "9:00 AM - 2:00 PM", location: "Bankstown Community Centre", spots: 8, totalSpots: 20, overview: "Our CSR partner ANZ is sending 20 staff to help with the family support packing day. Volunteers are needed to coordinate stations and assist with logistics.", photo: "https://images.unsplash.com/photo-1560220604-1985ebfe28b1?w=600&h=340&fit=crop&auto=format" },
  { id: 3, tag: "Nutrition", tagColor: "#2e7d5f", tagBg: "#d6f0e8", title: "Healthy Lunchbox Workshop", date: "2026-08-16", dateLabel: "Sun 16 Aug", time: "10:00 AM - 12:30 PM", location: "Auburn Community Kitchen", spots: 4, totalSpots: 8, overview: "Help families learn practical, affordable meal prep skills. This hands-on session is led by a nutritionist and needs volunteers who can assist with food handling and translation.", photo: "https://images.unsplash.com/photo-1653233797467-1a528819fd4f?w=600&h=340&fit=crop&auto=format" },
  { id: 4, tag: "Community", tagColor: "#a07800", tagBg: "#fdf6e3", title: "Annual Community Picnic Planning", date: "2026-08-20", dateLabel: "Thu 20 Aug", time: "6:00 PM - 8:00 PM", location: "Online via Zoom", spots: 20, totalSpots: 30, overview: "Help shape our biggest community event of the year. Join the planning committee to contribute ideas on activities, catering, entertainment, and volunteer coordination.", photo: "https://images.unsplash.com/photo-1500293669-115211273e5c?w=600&h=340&fit=crop&auto=format" },
  { id: 5, tag: "Sport", tagColor: "#e85d7a", tagBg: "#fbd4dc", title: "New Swimming Programme Launch", date: "2026-08-22", dateLabel: "Sat 22 Aug", time: "7:30 AM - 10:00 AM", location: "Auburn Swim Centre", spots: 6, totalSpots: 10, overview: "Partnering with Auburn Swim Centre to bring free swim lessons to 80 families. Volunteers assist with registration, supervision, and encouraging nervous first-timers.", photo: "https://images.unsplash.com/photo-1651614158095-b98b6c1da74b?w=600&h=340&fit=crop&auto=format" },
  { id: 6, tag: "Family Support", tagColor: "#7b3fa0", tagBg: "#ede0f7", title: "Back-to-School Backpack Drive", date: "2026-09-03", dateLabel: "Thu 3 Sep", time: "10:00 AM - 4:00 PM", location: "Granville Warehouse", spots: 15, totalSpots: 40, overview: "Every child deserves to start the term ready. Join the packing line to fill 300 backpacks with stationery, books and essentials for families who need it most.", photo: "https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=600&h=340&fit=crop&auto=format" },
  { id: 7, tag: "Nutrition", tagColor: "#2e7d5f", tagBg: "#d6f0e8", title: "Chef Volunteer Cooking Class", date: "2026-09-05", dateLabel: "Sat 5 Sep", time: "9:00 AM - 12:00 PM", location: "Merrylands Community Hall", spots: 3, totalSpots: 6, overview: "Join our resident volunteer chef Marcus to run a live cooking class for 30 families. Help prep ingredients, manage stations, and assist participants through each recipe step.", photo: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=600&h=340&fit=crop&auto=format" },
  { id: 8, tag: "Community", tagColor: "#a07800", tagBg: "#fdf6e3", title: "Junior Athletics Day", date: "2026-09-12", dateLabel: "Sat 12 Sep", time: "8:00 AM - 1:00 PM", location: "Blacktown Athletics Centre", spots: 10, totalSpots: 18, overview: "A full morning of track and field fun for kids aged 6-14. Volunteers help run events, manage timing, hand out medals, and keep the atmosphere positive and inclusive.", photo: "https://images.unsplash.com/photo-1766066015219-b10a97dbb781?w=600&h=340&fit=crop&auto=format" },
];

const ALL_TAGS = ["Sport", "CSR", "Nutrition", "Community", "Family Support"];

function EventsPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [registered, setRegistered] = useState<number[]>([]);

  const toggleTag = (tag: string) => setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));

  const filtered = allEvents.filter((ev) => {
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase()) || ev.tag.toLowerCase().includes(search.toLowerCase());
    const matchTag = selectedTags.length === 0 || selectedTags.includes(ev.tag);
    const matchDate = !dateFrom || ev.date >= dateFrom;
    return matchSearch && matchTag && matchDate;
  });

  const tagMeta: Record<string, { color: string; bg: string }> = {
    Sport: { color: "#e85d7a", bg: "#fbd4dc" },
    CSR: { color: "#1e5c8a", bg: "#d6e9f8" },
    Nutrition: { color: "#2e7d5f", bg: "#d6f0e8" },
    Community: { color: "#a07800", bg: "#fdf6e3" },
    "Family Support": { color: "#7b3fa0", bg: "#ede0f7" },
  };

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px" }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Get Involved</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Upcoming Events</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Find a session that fits your schedule and register your spot.</p>
      </div>
      <div style={{ backgroundColor: "#faf8f6", border: "1px solid #ede8e3", borderRadius: 16, padding: "20px 24px", marginBottom: 36 }}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#bbb", display: "flex", pointerEvents: "none" }}><IcoSearch size={16} /></span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by event name or type..." style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1.5px solid #e8e3de", borderRadius: 10, fontSize: 13, color: "#1a1a1a", outline: "none", boxSizing: "border-box", backgroundColor: "#fff", fontFamily: "inherit" }} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
          </div>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={{ padding: "10px 12px", border: "1.5px solid #e8e3de", borderRadius: 10, fontSize: 13, color: dateFrom ? "#1a1a1a" : "#aaa", outline: "none", backgroundColor: "#fff", fontFamily: "inherit", cursor: "pointer" }} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
          {(search || selectedTags.length > 0 || dateFrom) && (
            <button onClick={() => { setSearch(""); setSelectedTags([]); setDateFrom(""); }} style={{ padding: "10px 16px", borderRadius: 10, border: "1.5px solid #e8e3de", backgroundColor: "#fff", color: "#888", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#999", alignSelf: "center", marginRight: 2 }}>Filter by:</span>
          {ALL_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            const meta = tagMeta[tag];
            return (
              <button key={tag} onClick={() => toggleTag(tag)} style={{ padding: "5px 14px", borderRadius: 20, border: `1.5px solid ${active ? meta.color : "#e8e3de"}`, backgroundColor: active ? meta.bg : "#fff", color: active ? meta.color : "#777", fontSize: 12, fontWeight: active ? 700 : 500, cursor: "pointer", transition: "all 0.15s" }}>{tag}</button>
            );
          })}
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>{filtered.length === allEvents.length ? `${allEvents.length} events available` : `${filtered.length} of ${allEvents.length} events`}</p>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#bbb" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: "#ccc" }}><IcoSearch size={40} /></div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#aaa" }}>No events match your search</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {filtered.map((ev) => {
            const isReg = registered.includes(ev.id);
            const spotsLeft = ev.spots;
            const pct = ((ev.totalSpots - spotsLeft) / ev.totalSpots) * 100;
            return (
              <div
                key={ev.id}
                style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s, transform 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ height: 170, overflow: "hidden", backgroundColor: "#f0ece8", position: "relative" }}>
                  <img src={ev.photo} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <span style={{ position: "absolute", top: 14, left: 14, fontSize: 11, fontWeight: 700, color: ev.tagColor, backgroundColor: ev.tagBg, borderRadius: 20, padding: "4px 12px" }}>{ev.tag}</span>
                  {isReg && (
                    <span style={{ position: "absolute", top: 14, right: 14, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: "#2e7d5f", backgroundColor: "#d6f0e8", borderRadius: 20, padding: "4px 10px" }}>
                      <IcoCheck size={11} /> Registered
                    </span>
                  )}
                </div>
                <div style={{ padding: "20px 22px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", margin: 0, lineHeight: 1.4 }}>{ev.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
                      <span style={{ color: "#aaa", display: "flex" }}><IcoCalendar size={13} /></span>
                      <span style={{ fontWeight: 600 }}>{ev.dateLabel}</span><span style={{ color: "#bbb" }}>·</span><span>{ev.time}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#888" }}>
                      <span style={{ color: "#aaa", display: "flex" }}><IcoMapPin size={13} /></span><span>{ev.location}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>{ev.overview}</p>
                  <div style={{ marginTop: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: "#999" }}>Volunteer spots</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: spotsLeft <= 3 ? "#e85d7a" : "#555" }}>{spotsLeft} left of {ev.totalSpots}</span>
                    </div>
                    <div style={{ height: 5, backgroundColor: "#f0ece8", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, backgroundColor: spotsLeft <= 3 ? "#e85d7a" : "#4caf89", borderRadius: 3, transition: "width 0.4s" }} />
                    </div>
                  </div>
                  <button onClick={() => setRegistered((prev) => isReg ? prev.filter((id) => id !== ev.id) : [...prev, ev.id])} style={{ marginTop: 6, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, backgroundColor: isReg ? "#f0ece8" : "#e85d7a", color: isReg ? "#888" : "#fff", transition: "all 0.15s" }}>
                    {isReg ? "Cancel registration" : "Register for this event"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function DonatePage() {
  const [selected, setSelected] = useState(50);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [donated, setDonated] = useState(false);
  const finalAmount = custom ? Number(custom) : selected;
  const inputStyle = { width: "100%", padding: "10px 14px", border: "1.5px solid #e8e3de", borderRadius: 10, fontSize: 14, color: "#1a1a1a", outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit", backgroundColor: "#fafaf9" };

  if (donated) {
    return (
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20, color: "#e85d7a" }}><IcoHeart size={56} /></div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Thank you, {name || "friend"}!</h1>
        <p style={{ fontSize: 16, color: "#666", maxWidth: 480, margin: "0 auto 32px" }}>Your donation of <strong>${finalAmount}</strong> is making a real difference for families in our community.</p>
        <button onClick={() => setDonated(false)} style={{ padding: "12px 32px", borderRadius: 12, border: "none", backgroundColor: "#e85d7a", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Donate again</button>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 48px" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Give Back</p>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Your donation matters.</h1>
        <p style={{ fontSize: 14, color: "#888", margin: 0, maxWidth: 520 }}>Every dollar goes directly to programmes supporting children and families across Western Sydney.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 48 }}>
        {impactStats.map((item) => (
          <div key={item.label} style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 14, padding: "24px 20px" }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: item.color, marginBottom: 4 }}>{item.value}</div>
            <div style={{ fontSize: 12, color: "#777" }}>{item.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 32, alignItems: "start" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>Choose your impact</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {donationTiers.map((tier) => {
              const active = selected === tier.amount && !custom;
              return (
                <button key={tier.amount} onClick={() => { setSelected(tier.amount); setCustom(""); }} style={{ padding: "20px", borderRadius: 14, textAlign: "left", cursor: "pointer", border: `2px solid ${active ? "#e85d7a" : "#ede8e3"}`, backgroundColor: active ? "#fdf0f2" : "#fff", boxShadow: active ? "0 0 0 3px #fcd8df" : "none", transition: "all 0.15s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ color: active ? "#e85d7a" : "#888", display: "flex" }}>{tier.icon}</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: active ? "#e85d7a" : "#1a1a1a" }}>${tier.amount}</span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 4 }}>{tier.label}</div>
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{tier.desc}</div>
                </button>
              );
            })}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 700, color: "#888", fontSize: 15 }}>$</span>
            <input type="number" value={custom} onChange={(e) => { setCustom(e.target.value); setSelected(0); }} placeholder="Enter a custom amount" style={{ ...inputStyle, paddingLeft: 28, border: `1.5px solid ${custom ? "#e85d7a" : "#e8e3de"}` }} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { if (!custom) e.target.style.borderColor = "#e8e3de"; }} />
          </div>
        </div>
        <div style={{ backgroundColor: "#faf8f6", border: "1px solid #ede8e3", borderRadius: 18, padding: "28px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#e85d7a", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 20px" }}>Your details</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
            {([
              ["Full name", name, setName, "Sarah Chan"],
              ["Email", email, setEmail, "sarah@email.com"],
            ] as [string, string, React.Dispatch<React.SetStateAction<string>>, string][]).map(([label, val, setter, ph]) => (
              <div key={label}>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</div>
                <input value={val} onChange={(e) => setter(e.target.value)} placeholder={ph} style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Card number</div>
              <input placeholder=".... .... .... ...." style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Expiry</div>
                <input placeholder="MM / YY" style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>CVC</div>
                <input placeholder="..." style={inputStyle} onFocus={(e) => { e.target.style.borderColor = "#e85d7a"; }} onBlur={(e) => { e.target.style.borderColor = "#e8e3de"; }} />
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: "#fff", border: "1px solid #ede8e3", borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#555", marginBottom: 6 }}><span>Donation amount</span><span style={{ fontWeight: 700, color: "#1a1a1a" }}>${finalAmount || "-"}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#aaa" }}><span>Processing fee</span><span>$0.00</span></div>
          </div>
          <button onClick={() => { if (finalAmount > 0) setDonated(true); }} style={{ width: "100%", padding: "13px", borderRadius: 11, border: "none", backgroundColor: finalAmount > 0 ? "#e85d7a" : "#f0ece8", color: finalAmount > 0 ? "#fff" : "#bbb", fontSize: 15, fontWeight: 700, cursor: finalAmount > 0 ? "pointer" : "default", transition: "all 0.15s" }}>
            Donate ${finalAmount || "-"}
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, color: "#bbb", fontSize: 11 }}>
            <IcoShield size={13} /> Secure payment - Tax receipt emailed automatically
          </div>
        </div>
      </div>
    </main>
  );
}

export function ContributorPortalExperience({
  initialNav,
  name: _name,
}: {
  initialNav: "My Portal" | "My Donations" | "My Volunteer" | "Events" | "Donate" | "Profile";
  name?: string;
}) {
  void _name;
  const [activeNav, setActiveNav] = useState(initialNav === "Profile" ? "My Portal" : initialNav);
  const [showProfile, setShowProfile] = useState(initialNav === "Profile");

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header style={{ backgroundColor: "#fff", borderBottom: "1px solid #f0ece8", padding: "0 48px", display: "flex", alignItems: "center", height: 56, gap: 24, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8, flexShrink: 0 }}>
          <div style={{ width: 28, height: 28, backgroundColor: "#e85d7a", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>21</div>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1a1a" }}>Volunteer Portal</span>
        </div>
        <nav style={{ display: "flex", gap: 2, flex: 1 }}>
          {navLinks.map((link) => (
            <button key={link} onClick={() => { setActiveNav(link); setShowProfile(false); }} style={{ padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: !showProfile && activeNav === link ? 600 : 400, backgroundColor: !showProfile && activeNav === link ? "#fcd8df" : "transparent", color: !showProfile && activeNav === link ? "#c13057" : "#555", transition: "all 0.15s", whiteSpace: "nowrap" }}>
              {link}
            </button>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "#888", display: "flex", alignItems: "center" }}><IcoBell size={20} /></button>
          <button onClick={() => setShowProfile(!showProfile)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8, transition: "background 0.15s", backgroundColor: showProfile ? "#fdf0f2" : "transparent" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "#8bbdd9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>SC</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: showProfile ? "#c13057" : "#1a1a1a" }}>Sarah Chan</span>
          </button>
          <div className={styles.headerActions}>
            <Link href="/" className={styles.websiteButton}>
              Go to website
            </Link>
            <SignOutButton className={styles.logoutButton} />
          </div>
        </div>
      </header>

      <SiteToolsTray locale="en" paths={localePaths("/portal")} />

      {showProfile ? <ProfilePage onBack={() => setShowProfile(false)} />
        : activeNav === "My Donations" ? <MyDonationsPage />
        : activeNav === "My Volunteer" ? <MyVolunteerPage />
        : activeNav === "Events" ? <EventsPage />
        : activeNav === "Donate" ? <DonatePage />
        : <Dashboard />}

      {activeNav === "My Portal" && !showProfile ? (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 56px" }}>
          <CommunityVoices />
        </main>
      ) : null}
    </div>
  );
}
