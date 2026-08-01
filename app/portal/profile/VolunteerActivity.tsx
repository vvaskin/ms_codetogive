"use client";

import Image from "next/image";
import { useState, type CSSProperties, type FormEvent } from "react";
import styles from "./VolunteerActivity.module.css";

type EventNature =
	| "All"
	| "Play Therapy"
	| "Nutrition"
	| "Speech & Comm."
	| "Life Skills"
	| "Caregiver Support";

interface VolunteerEvent {
	id: number;
	title: string;
	date: string;
	dateKey: string;
	time: string;
	location: string;
	nature: EventNature;
	joined: number;
	capacity: number;
	image: string;
	description: string;
	isPast: boolean;
}

const COLORS = {
	accent: "#8B0000",
	accentSoft: "#8B000015",
};

const EVENTS: VolunteerEvent[] = [
	{
		id: 1,
		title: "Saturday Play Group — Sensory & Movement Morning",
		date: "August 9, 2026",
		dateKey: "2026-08-09",
		time: "9:00 AM – 12:00 PM",
		location: "Bloom DS Centre, Activity Hall — Room 2",
		nature: "Play Therapy",
		joined: 14,
		capacity: 20,
		image:
			"https://images.unsplash.com/photo-1533222535026-754c501569dd?w=800&h=400&fit=crop&auto=format",
		description:
			"Facilitate guided sensory play, movement games, and peer-to-peer social activities for children with Down syndrome aged 4–10. Volunteers assist therapists in setting up stations and supporting each child one-on-one.",
		isPast: false,
	},
	{
		id: 2,
		title: "Nutrition & Healthy Eating Workshop for Families",
		date: "August 16, 2026",
		dateKey: "2026-08-16",
		time: "10:00 AM – 1:00 PM",
		location: "Community Wellness Kitchen, Block B",
		nature: "Nutrition",
		joined: 9,
		capacity: 18,
		image:
			"https://images.unsplash.com/photo-1588075592806-bbe6da990469?w=800&h=400&fit=crop&auto=format",
		description:
			"Help families learn about balanced diets and appetite management specific to children with Down syndrome. Volunteers assist dietitians in food prep demos, portion guidance, and distributing take-home meal guides.",
		isPast: false,
	},
	{
		id: 3,
		title: "Speech & Communication Skills Session",
		date: "August 23, 2026",
		dateKey: "2026-08-23",
		time: "3:00 PM – 5:30 PM",
		location: "Bloom DS Centre, Therapy Room 1",
		nature: "Speech & Comm.",
		joined: 7,
		capacity: 12,
		image:
			"https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800&h=400&fit=crop&auto=format",
		description:
			"Support speech-language therapists during group communication exercises. Volunteers work with children on picture-based vocabulary, turn-taking, and expressive language through songs and storytelling.",
		isPast: false,
	},
	{
		id: 4,
		title: "Life Skills Day — Cooking & Self-Care Basics",
		date: "June 7, 2026",
		dateKey: "2026-06-07",
		time: "10:00 AM – 2:00 PM",
		location: "Bloom DS Centre, Training Kitchen",
		nature: "Life Skills",
		joined: 16,
		capacity: 16,
		image:
			"https://images.unsplash.com/photo-1595183241165-f6ba98b7d4eb?w=800&h=400&fit=crop&auto=format",
		description:
			"Volunteers guided teens and young adults with Down syndrome through simple cooking tasks and self-care routines, building confidence and independence skills in a safe, structured setting.",
		isPast: true,
	},
	{
		id: 5,
		title: "Parent & Caregiver Support Circle",
		date: "May 17, 2026",
		dateKey: "2026-05-17",
		time: "4:00 PM – 6:30 PM",
		location: "Westview Community Hall, Meeting Room 3",
		nature: "Caregiver Support",
		joined: 24,
		capacity: 30,
		image:
			"https://images.unsplash.com/photo-1636202339022-7d67f7447e3a?w=800&h=400&fit=crop&auto=format",
		description:
			"Volunteers helped facilitate a peer support circle for parents and caregivers, assisted with childcare during sessions, and coordinated resource sharing about early intervention services.",
		isPast: true,
	},
];

const NATURES: EventNature[] = [
	"All",
	"Play Therapy",
	"Nutrition",
	"Speech & Comm.",
	"Life Skills",
	"Caregiver Support",
];

function ProgressBar({ joined, capacity }: { joined: number; capacity: number }) {
	const pct = Math.min(100, Math.round((joined / capacity) * 100));
	const isAlmostFull = pct >= 80;

	return (
		<div className={styles.progressBlock}>
			<div className={styles.progressHeader}>
				<span className={styles.progressLabel}>Volunteers</span>
				<span
					className={styles.progressCount}
					style={{ color: isAlmostFull ? COLORS.accent : "#374151" }}
				>
					{joined}/{capacity} Joined
				</span>
			</div>
			<div className={styles.progressBar}>
				<div
					className={styles.progressFill}
					style={{
						width: `${pct}%`,
						backgroundColor: isAlmostFull ? COLORS.accent : "#374151",
					}}
				/>
			</div>
		</div>
	);
}

function NatureBadge({ nature }: { nature: EventNature }) {
	const classNameByNature: Record<EventNature, string> = {
		All: styles.badgeNeutral,
		"Play Therapy": styles.badgePlay,
		Nutrition: styles.badgeNutrition,
		"Speech & Comm.": styles.badgeSpeech,
		"Life Skills": styles.badgeLife,
		"Caregiver Support": styles.badgeCaregiver,
	};

	return <span className={`${styles.badge} ${classNameByNature[nature]}`}>{nature}</span>;
}

function ActiveEventCard({
	event,
	onJoin,
}: {
	event: VolunteerEvent;
	onJoin: (e: VolunteerEvent) => void;
}) {
	const [detailsOpen, setDetailsOpen] = useState(false);

	return (
		<article className={styles.card}>
			<div className={styles.cardMedia}>
				<Image src={event.image} alt={event.title} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" className={styles.mediaImage} />
				<div className={styles.mediaOverlay} />
				<div className={styles.mediaBadge}>
					<NatureBadge nature={event.nature} />
				</div>
				<p className={styles.location}>
					<svg className={styles.inlineIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
					{event.location}
				</p>
			</div>

			<div className={styles.cardBody}>
				<div>
					<h3 className={styles.cardTitle}>{event.title}</h3>
					<div className={styles.metaRow}>
						<span className={styles.metaItem}>
							<svg className={styles.inlineIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							{event.date}
						</span>
						<span className={styles.metaDot}>·</span>
						<span className={styles.metaItem}>{event.time}</span>
					</div>
				</div>

				{detailsOpen ? <p className={styles.description}>{event.description}</p> : null}

				<ProgressBar joined={event.joined} capacity={event.capacity} />

				<div className={styles.actions}>
					<button
						type="button"
						onClick={() => onJoin(event)}
						disabled={event.joined >= event.capacity}
						className={styles.primaryButton}
					>
						{event.joined >= event.capacity ? "Full" : "Join"}
					</button>
					<button
						type="button"
						onClick={() => setDetailsOpen((value) => !value)}
						className={styles.secondaryButton}
					>
						{detailsOpen ? "Hide Details" : "Details"}
					</button>
				</div>
			</div>
		</article>
	);
}

function PastEventCard({ event }: { event: VolunteerEvent }) {
	const filled = Math.min(100, Math.round((event.joined / event.capacity) * 100));

	return (
		<article className={`${styles.card} ${styles.cardPast}`}>
			<div className={styles.cardMediaPast}>
				<Image src={event.image} alt={event.title} fill unoptimized sizes="(max-width: 760px) 100vw, 33vw" className={styles.mediaImagePast} />
				<div className={styles.mediaOverlayPast} />
				<div className={styles.completedBadge}>Completed</div>
			</div>
			<div className={styles.cardBody}>
				<div>
					<h3 className={styles.cardTitlePast}>{event.title}</h3>
					<span className={styles.pastMeta}>
						{event.date} · {event.time}
					</span>
				</div>
				<div className={styles.progressBlock}>
					<div className={styles.progressHeader}>
						<span className={styles.progressLabelPast}>Final Count</span>
						<span className={styles.progressCountPast}>
							{event.joined}/{event.capacity} Volunteers
						</span>
					</div>
					<div className={styles.progressBar}>
						<div className={styles.progressPastFill} style={{ width: `${filled}%` }} />
					</div>
				</div>
				<div className={styles.actions}>
					<button type="button" className={styles.secondaryButton}>
						Give Feedback
					</button>
					<button
						type="button"
						className={styles.primaryButton}
						style={{ backgroundColor: COLORS.accent }}
					>
						Donate
					</button>
				</div>
			</div>
		</article>
	);
}

function JoinModal({
	event,
	onClose,
	onSuccess,
}: {
	event: VolunteerEvent;
	onClose: () => void;
	onSuccess: (email: string) => void;
}) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = (eventSubmit: FormEvent<HTMLFormElement>) => {
		eventSubmit.preventDefault();

		if (!name.trim() || !email.trim()) {
			return;
		}

		setSubmitting(true);

		window.setTimeout(() => {
			onSuccess(email);
		}, 700);
	};

	return (
		<div className={styles.modalOverlay} role="presentation">
			<button type="button" aria-label="Close dialog" className={styles.modalBackdrop} onClick={onClose} />
			<div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="join-dialog-title">
				<div className={styles.modalHeader}>
					<div>
						<h2 id="join-dialog-title" className={styles.modalTitle}>
							Quick Join
						</h2>
						<p className={styles.modalSubtitle}>No account needed — just your name and email.</p>
					</div>
					<button type="button" onClick={onClose} className={styles.iconButton} aria-label="Close join dialog">
						×
					</button>
				</div>

				<div className={styles.summaryBox}>
					<p className={styles.summaryTitle}>{event.title}</p>
					<p className={styles.summaryMeta}>
						{event.date} · {event.time}
					</p>
				</div>

				<form onSubmit={handleSubmit} className={styles.form}>
					<label className={styles.field}>
						<span className={styles.label}>Full Name</span>
						<input
							type="text"
							value={name}
							onChange={(changeEvent) => setName(changeEvent.target.value)}
							placeholder="Priya Sharma"
							required
							className={styles.input}
							style={{ ["--focus-color" as string]: COLORS.accent } as CSSProperties}
						/>
					</label>

					<label className={styles.field}>
						<span className={styles.label}>Email Address</span>
						<input
							type="email"
							value={email}
							onChange={(changeEvent) => setEmail(changeEvent.target.value)}
							placeholder="priya@example.com"
							required
							className={styles.input}
						/>
					</label>

					<p className={styles.helperText}>
						A confirmation email with your magic link will be sent. Use it to add to calendar or cancel if plans change.
					</p>

					<button
						type="submit"
						disabled={submitting || !name.trim() || !email.trim()}
						className={styles.submitButton}
						style={{ backgroundColor: COLORS.accent }}
					>
						{submitting ? "Registering..." : "Confirm Registration"}
					</button>
				</form>
			</div>
		</div>
	);
}

function SuccessToast({ email, onClose }: { email: string; onClose: () => void }) {
	return (
		<div className={styles.toast} role="status" aria-live="polite">
			<div className={styles.toastCard}>
				<div className={styles.toastIcon} style={{ backgroundColor: COLORS.accentSoft }}>
					<svg className={styles.toastIconSvg} fill="none" stroke={COLORS.accent} viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<div className={styles.toastText}>
					<p className={styles.toastTitle}>You are registered!</p>
					<p className={styles.toastBody}>
						Confirmation sent to <span className={styles.toastHighlight}>{email}</span>
					</p>
					<p className={styles.toastFinePrint}>Check your inbox for the magic link & calendar invite.</p>
				</div>
				<button type="button" onClick={onClose} className={styles.toastClose} aria-label="Dismiss notification">
					×
				</button>
			</div>
		</div>
	);
}

function EmailConfirmationFrame() {
	return (
		<section className={styles.emailFrameSection}>
			<div className={styles.sectionDivider}>
				<div className={styles.sectionLine} />
				<p className={styles.sectionKicker}>Email Confirmation Layout</p>
				<div className={styles.sectionLine} />
			</div>

			<div className={styles.emailFrame}>
				<div className={styles.emailChrome}>
					<span className={styles.chromeDot} />
					<span className={styles.chromeDotMuted} />
					<span className={styles.chromeDotMuted} />
					<span className={styles.chromeLabel}>Volunteer Confirmation — [Organization Name]</span>
				</div>

				<div className={styles.emailBody}>
					<div className={styles.emailHeader}>
						<div className={styles.emailLogo} style={{ backgroundColor: COLORS.accent }}>
							<svg className={styles.emailLogoSvg} fill="currentColor" viewBox="0 0 20 20">
								<path
									fillRule="evenodd"
									d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div>
							<p className={styles.emailOrg}>Bloom DS Foundation</p>
							<p className={styles.emailAddress}>volunteer@bloomds.org</p>
						</div>
					</div>

					<div>
						<p className={styles.emailGreeting}>
							Hi <strong>Priya</strong>,
						</p>
						<p className={styles.emailIntro}>
							You are confirmed as a volunteer for the upcoming event. We are glad to have you with us!
						</p>
					</div>

					<div className={styles.emailEventCard}>
						<div className={styles.emailEventImageWrap}>
								<Image
								src="https://images.unsplash.com/photo-1533222535026-754c501569dd?w=600&h=200&fit=crop&auto=format"
								alt="Children playing together at a Down syndrome sensory play session"
									fill
									unoptimized
									sizes="100vw"
								className={styles.emailEventImage}
							/>
							<div className={styles.emailEventOverlay} />
						</div>
						<div className={styles.emailEventBody}>
							<p className={styles.emailEventTitle}>Saturday Play Group — Sensory & Movement Morning</p>
							<p className={styles.emailEventMeta}>August 9, 2026 · 9:00 AM – 12:00 PM</p>
							<p className={styles.emailEventLocation}>Bloom DS Centre, Activity Hall — Room 2</p>
						</div>
					</div>

					<div className={styles.emailActions}>
						<button type="button" className={styles.submitButton} style={{ backgroundColor: COLORS.accent }}>
							Add to Google Calendar
						</button>
						<button type="button" className={styles.secondaryButtonWide}>
							Download .ics File
						</button>
					</div>

					<div className={styles.emailHint}>
						<p className={styles.emailHintText}>
							Need to change your plans? <span className={styles.emailHintLink}>View or Cancel My Registration →</span>
						</p>
						<p className={styles.emailHintFinePrint}>This secure link expires 1 hour before the event.</p>
					</div>

					<div className={styles.emailFooter}>
						<p className={styles.emailFooterText}>
							Bloom DS Foundation · 14 Sunrise Avenue, Mumbai · Reg. No. DS-88421
							<br />
							You received this because you registered for a volunteer event.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function VolunteerActivity() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedNature, setSelectedNature] = useState<EventNature>("All");
	const [selectedDate, setSelectedDate] = useState("");
	const [joiningEvent, setJoiningEvent] = useState<VolunteerEvent | null>(null);
	const [successEmail, setSuccessEmail] = useState("");
	const [tab, setTab] = useState<"active" | "past">("active");

	const activeEvents = EVENTS.filter((event) => !event.isPast);
	const pastEvents = EVENTS.filter((event) => event.isPast);

	const filterEvents = (events: VolunteerEvent[]) =>
		events.filter((event) => {
			const matchesNature = selectedNature === "All" || event.nature === selectedNature;
			const matchesSearch =
				!searchQuery ||
				event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				event.location.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesDate = !selectedDate || event.dateKey === selectedDate;

			return matchesNature && matchesSearch && matchesDate;
		});

	const filteredActive = filterEvents(activeEvents);
	const filteredPast = filterEvents(pastEvents);

	return (
		<div className={styles.page}>
			<main>
				<section className={styles.hero}>
					<div className={styles.heroCopy}>
						<p className={styles.eyebrow}>
							{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
						</p>
						<h1 className={styles.heroTitle}>{tab === "active" ? "Upcoming Events" : "Past Events"}</h1>
						<nav className={styles.tabs} aria-label="Volunteer activity tabs">
							<button
								type="button"
								onClick={() => setTab("active")}
								className={styles.tabButton}
								data-active={tab === "active"}
							>
								Active Events
							</button>
							<button
								type="button"
								onClick={() => setTab("past")}
								className={styles.tabButton}
								data-active={tab === "past"}
							>
								Past Events
							</button>
						</nav>
					</div>
					{tab === "active" ? (
						<p className={styles.heroLead}>No account needed. Pick an event, join in seconds.</p>
					) : null}
				</section>

				<section className={styles.filters} aria-label="Event filters">
					<label className={styles.filterField}>
						<span className={styles.filterIcon}>📅</span>
						<input
							type="date"
							value={selectedDate}
							onChange={(event) => setSelectedDate(event.target.value)}
							className={styles.input}
						/>
					</label>

					<label className={styles.filterField}>
						<span className={styles.filterIcon}>🏷️</span>
						<select
							value={selectedNature}
							onChange={(event) => setSelectedNature(event.target.value as EventNature)}
							className={styles.select}
						>
							{NATURES.map((nature) => (
								<option key={nature}>{nature}</option>
							))}
						</select>
					</label>

					<label className={styles.searchField}>
						<span className={styles.filterIcon}>⌕</span>
						<input
							type="search"
							value={searchQuery}
							onChange={(event) => setSearchQuery(event.target.value)}
							placeholder="Search by event name or location…"
							className={styles.input}
						/>
					</label>

					{selectedNature !== "All" || selectedDate || searchQuery ? (
						<button
							type="button"
							onClick={() => {
								setSelectedNature("All");
								setSelectedDate("");
								setSearchQuery("");
							}}
							className={styles.clearButton}
						>
							Clear Filters
						</button>
					) : null}
				</section>

				<section className={styles.grid} aria-live="polite">
					{tab === "active" ? (
						filteredActive.length > 0 ? (
							filteredActive.map((event) => (
								<ActiveEventCard key={event.id} event={event} onJoin={setJoiningEvent} />
							))
						) : (
							<div className={styles.emptyState}>
								<p>No events match your filters.</p>
								<span>Try clearing the search or changing the category.</span>
							</div>
						)
					) : filteredPast.length > 0 ? (
						filteredPast.map((event) => <PastEventCard key={event.id} event={event} />)
					) : (
						<div className={styles.emptyState}>
							<p>No past events match your filters.</p>
						</div>
					)}
				</section>

				<EmailConfirmationFrame />

				<section className={styles.calloutSection}>
					<div className={styles.calloutGrid}>
						{[
							{
								n: "01",
								title: "Passwordless Quick Join",
								desc: "Name + Email only. No account, no password. Maximum sign-up conversion.",
							},
							{
								n: "02",
								title: "Add to Calendar",
								desc: "Confirmation email includes Google Calendar & iCal links so volunteers never miss a date.",
							},
							{
								n: "03",
								title: "Magic Link for Status",
								desc: "One secure link lets volunteers view or cancel their registration — no login page needed.",
							},
						].map((item) => (
							<div key={item.n} className={styles.calloutItem}>
								<span className={styles.calloutNumber}>{item.n}</span>
								<div>
									<p className={styles.calloutTitle}>{item.title}</p>
									<p className={styles.calloutText}>{item.desc}</p>
								</div>
							</div>
						))}
					</div>
				</section>
			</main>

			{joiningEvent ? (
				<JoinModal
					event={joiningEvent}
					onClose={() => setJoiningEvent(null)}
					onSuccess={(email) => {
						setJoiningEvent(null);
						setSuccessEmail(email);
						window.setTimeout(() => setSuccessEmail(""), 5000);
					}}
				/>
			) : null}

			{successEmail ? <SuccessToast email={successEmail} onClose={() => setSuccessEmail("")} /> : null}
		</div>
	);
}
