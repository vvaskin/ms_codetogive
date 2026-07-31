"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mediaArticles } from "../content/site-data";
import { NewsletterForm } from "./DemoForms";

const programmes = [
  {
    key: "nutrition",
    en: "NUTRITION",
    zh: "飲食與營養",
    image: "/assets/images/home-nutrition.jpg",
  },
  {
    key: "sports",
    en: "SPORTS",
    zh: "體育",
    image: "/assets/images/home-sports.jpg",
  },
  {
    key: "family",
    en: "FAMILY",
    zh: "家庭",
    image: "/assets/images/home-family.jpeg",
  },
  {
    key: "csr",
    en: "CSR",
    zh: "企業社會責任",
    image: "/assets/images/home-csr.jpg",
  },
];

export function HomeExperience({ locale = "en" }: { locale?: "en" | "zh" }) {
  const zh = locale === "zh";
  const [articleIndex, setArticleIndex] = useState(0);
  const visibleArticles = mediaArticles.slice(0, 6);
  const article = visibleArticles[articleIndex];

  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>#Somuchability</h1>
          <Link className="outline-button light" href={zh ? "/zh/our-story-hk/" : "/our-story/"}>
            {zh ? "了解更多" : "DISCOVER MORE"} <span aria-hidden="true">➜</span>
          </Link>
        </div>
      </section>

      <section className="story-intro">
        <h2>{zh ? "關於我們" : "OUR STORY"}</h2>
        <p>
          {zh
            ? "Love 21旨在通過運動、營養及其他全面活動，令唐氏綜合症和自閉症人士得到充分發揮潛力的機會。我們是在香港的一間慈善機構，希望能夠透過活動改善會員及其家庭的生活。"
            : "Love 21 is a charity empowering the Down syndrome and autistic community in Hong Kong through sport, nutrition, and holistic support programmes. Since the launch of our comprehensive nutrition programme in 2021, we’ve provided one-on-one nutritional support on top of the sports classes that we’ve offered. We’ve also recently expanded into providing counselling support for the parents of our community."}
        </p>
        <Link className="outline-button dark" href={zh ? "/zh/our-story-hk/" : "/our-story/"}>
          {zh ? "了解更多" : "READ MORE"} <span aria-hidden="true">➜</span>
        </Link>
      </section>

      <section className="stats-section">
        <div className="section-rule" />
        <div className="stats-grid">
          <div>
            <strong>500+</strong>
            <span>{zh ? "個家庭受惠" : "FAMILIES SERVED"}</span>
          </div>
          <div>
            <strong>800+</strong>
            <span>
              {zh
                ? "每月課堂及活動節數"
                : "SESSIONS OF CLASSES AND ACTIVITIES EACH MONTH"}
            </span>
          </div>
          <div>
            <strong>90+</strong>
            <span>{zh ? "種不同活動" : "TYPES OF ACTIVITIES"}</span>
          </div>
          <div>
            <strong>1000+</strong>
            <span>{zh ? "每月義工時數" : "VOLUNTEER HOURS PER MONTH"}</span>
          </div>
        </div>
      </section>

      <section className="programme-showcase">
        <div className="section-rule" />
        <div className="programme-collage">
          {programmes.map((programme) => (
            <Link
              key={programme.key}
              className={`programme-tile tile-${programme.key}`}
              href={zh ? "/zh/our-programmes-hk/" : "/our-programmes/"}
            >
              <Image
                src={programme.image}
                alt={zh ? programme.zh : programme.en}
                fill
                unoptimized
                sizes="(max-width: 700px) 100vw, 50vw"
              />
              <span>{zh ? programme.zh : programme.en}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="media-carousel" aria-label={zh ? "最新消息" : "Latest media"}>
        <div className="section-rule" />
        <div className="carousel-card">
          <div className="carousel-image">
            {article.image && (
              <Image
                src={article.image}
                alt=""
                fill
                unoptimized
                sizes="(max-width: 800px) 100vw, 45vw"
              />
            )}
          </div>
          <div className="carousel-copy">
            <span className="article-date">{article.date}</span>
            <h2>{article.title}</h2>
            {article.excerpt && <p>{article.excerpt}</p>}
            <Link href={`/${article.slug}/`}>{zh ? "閱讀更多" : "Read More"} ➜</Link>
          </div>
        </div>
        <div className="carousel-controls">
          <button
            type="button"
            aria-label="Previous article"
            onClick={() =>
              setArticleIndex(
                (articleIndex - 1 + visibleArticles.length) % visibleArticles.length,
              )
            }
          >
            ←
          </button>
          <div className="carousel-dots">
            {visibleArticles.map((item, index) => (
              <button
                type="button"
                key={item.slug}
                aria-label={`Show article ${index + 1}`}
                aria-current={articleIndex === index}
                onClick={() => setArticleIndex(index)}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next article"
            onClick={() => setArticleIndex((articleIndex + 1) % visibleArticles.length)}
          >
            →
          </button>
        </div>
      </section>

      <NewsletterForm zh={zh} />

      <section className="partner-logos" aria-label="Partner organisations">
        <Image
          src="/assets/images/partner-ccma.png"
          width={230}
          height={99}
          unoptimized
          alt="Caring Company"
        />
        <Image
          src="/assets/images/partner-hkcss.jpeg"
          width={220}
          height={189}
          unoptimized
          alt="Hong Kong Council of Social Service agency member"
        />
      </section>
    </>
  );
}
