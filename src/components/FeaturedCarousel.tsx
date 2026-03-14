"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/home.module.css";

// Horizontal distance (px) between the center of adjacent cards
const STEP = 275;

// Card data structure used by the carousel
export interface FeaturedCarouselCard {
  id: number;
  name: string;
  slug: string;
  image: string;
}

// Calculate the offset of a card from the center (keeps cards evenly spaced on
// both sides of the center card)
function getOffset(idx: number, center: number, count: number): number {
  let d = idx - center;
  if (d > count / 2) d -= count;
  if (d < -count / 2) d += count;
  return d;
}

// Carousel component props
interface FeaturedCarouselProps {
  cards: FeaturedCarouselCard[];
}

// Carousel component
export default function FeaturedCarousel({ cards }: FeaturedCarouselProps) {
  const count = cards.length; // Number of cards in the carousel
  // Index of the currently centered card
  const [centerIdx, setCenterIdx] = useState(0);
  // Track the previous center so we can suppress transitions on
  // cards that stay hidden between renders (avoiding wrap-around)
  const prevCenterIdxRef = useRef(centerIdx);
  const prevCenterIdx = prevCenterIdxRef.current; // Initially 0, but will be the previous center on subsequent renders
  // Update previous center index after each render
  useEffect(() => {
    prevCenterIdxRef.current = centerIdx;
  });
  // If the center index goes out of bounds (can happen when count changes), wrap it around
  useEffect(() => {
    if (count === 0) {
      return;
    }

    if (centerIdx >= count) {
      setCenterIdx(0);
    }
  }, [centerIdx, count]);

  // Placeholder when no featured projects are available
  if (count === 0) {
    return (
      <div className={styles.carouselEmpty}>
        No featured projects at the moment. Check back later!
      </div>
    );
  }

  return (
    <div className={styles.carouselWrapper}>
      {/* Left button */}
      <button
        className={styles.carouselBtn}
        onClick={() => setCenterIdx((centerIdx - 1 + count) % count)}
        aria-label="Previous"
        disabled={count <= 1}
      >
        <svg className={styles.carouselChevron} viewBox="0 0 32 100">
          <polyline points="24 2 4 50 24 98" />
        </svg>
      </button>

      <div className={styles.carouselClip}>
        <div className={styles.carouselTrack}>
          {/* Cards */}
          {cards.map((card, idx) => {
            const offset = getOffset(idx, centerIdx, count);
            const prevOffset = getOffset(idx, prevCenterIdx, count);
            const isCenter   = offset === 0;
            const isVisible  = Math.abs(offset) <= 1;
            // Whether this card was visible in the previous render (used to
            // suppress transitions for cards that remain hidden
            const wasVisible = Math.abs(prevOffset) <= 1;

            // Cards that were hidden AND stay hidden just need to reposition
            // silently — no animation needed
            const suppressTransition = !isVisible && !wasVisible;

            // Clamp off-screen cards just outside the clip boundary.
            const tx = isVisible ? offset * STEP : Math.sign(offset) * STEP * 1.1;
            // Side cards sit slightly lower, matching the original layout.
            const ty = isCenter ? "-50%" : "calc(-50% + 40px)";

            return (
              <div
                key={card.id}
                className={[
                  styles.carouselCard,
                  isVisible && !isCenter ? styles.carouselCardSide : "",
                  !isVisible ? styles.carouselCardHidden : "",
                ].join(" ")}
                style={{
                  transform: `translateX(calc(-50% + ${tx}px)) translateY(${ty})`,
                  zIndex: isCenter ? 2 : 1,
                  width: isCenter ? "300px" : "190px",
                  height: isCenter ? "370px" : "234px",
                  opacity: !isVisible ? 0 : isCenter ? 1 : 0.75,
                  fontSize: isCenter ? "26px" : "16px",
                  borderColor: isCenter ? "#60a5fa" : "transparent",
                  boxShadow: isCenter ? "0 0 32px rgba(96,165,250,0.22)" : "none",
                  ...(suppressTransition ? { transition: "none" } : {}),
                }}
              >
                {isCenter ? (
                  <Link
                    href={`/projects/${card.slug}`}
                    className={styles.carouselCardLink}
                    aria-label={`View ${card.name}`}
                  >
                    {/* Card image */}
                    <img
                      src={card.image}
                      alt={card.name}
                      className={styles.cardImagePlaceholder}
                    />
                    {/* Project Title */}
                    <p className={`${styles.cardName}${isCenter ? ` ${styles.cardNameCenter}` : ""}`}>
                      {card.name}
                    </p>
                  </Link>
                ) : (
                  <div className={styles.carouselCardLink} onClick={isVisible ? () => setCenterIdx(idx) : undefined}>
                    {/* Card image */}
                    <img
                      src={card.image}
                      alt={card.name}
                      className={styles.cardImagePlaceholder}
                    />
                    {/* Project Title */}
                    <p className={styles.cardName}>
                      {card.name}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right button */}
      <button
        className={styles.carouselBtn}
        onClick={() => setCenterIdx((centerIdx + 1) % count)}
        aria-label="Next"
        disabled={count <= 1}
      >
        <svg className={styles.carouselChevron} viewBox="0 0 32 100">
          <polyline points="8 2 28 50 8 98" />
        </svg>
      </button>
    </div>
  );
}

