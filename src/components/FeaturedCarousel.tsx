"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../styles/home.module.css";

// List of project names; image association needs to be added
// At least 5 cards are needed for smooth transitions
const cards = [
  { id: 0, name: "Project A" },
  { id: 1, name: "Project B" },
  { id: 2, name: "Project C" },
  { id: 3, name: "Project D" },
  { id: 4, name: "Project E" },
  { id: 5, name: "Project F" },
];

const COUNT = cards.length;
// Horizontal distance (px) between the centre of adjacent cards
const STEP = 275;

// Calculate the offset of a card from the center (keeps cards evenly spaced on
// both sides of the center card)
function getOffset(idx: number, center: number): number {
  let d = idx - center;
  if (d > COUNT / 2) d -= COUNT;
  if (d < -COUNT / 2) d += COUNT;
  return d;
}

export default function FeaturedCarousel() {
  // Index of the currently centered card
  const [centerIdx, setCenterIdx] = useState(0);
  // Track the previous center so we can suppress transitions on
  // cards that stay hidden between renders (avoiding wrap-around)
  const prevCenterIdxRef = useRef(centerIdx);
  const prevCenterIdx = prevCenterIdxRef.current; // (initially 0, but will be the previous center on subsequent renders)
  // Update previous center index after each render
  useEffect(() => {
    prevCenterIdxRef.current = centerIdx;
  });

  return (
    <div className={styles.carouselWrapper}>
      {/* Left button */}
      <button
        className={styles.carouselBtn}
        onClick={() => setCenterIdx((centerIdx - 1 + COUNT) % COUNT)}
        aria-label="Previous"
      >
        <svg className={styles.carouselChevron} viewBox="0 0 32 100">
          <polyline points="24 2 4 50 24 98" />
        </svg>
      </button>

      <div className={styles.carouselClip}>
        <div className={styles.carouselTrack}>
          {cards.map((card) => {
            const offset     = getOffset(card.id, centerIdx);
            const prevOffset = getOffset(card.id, prevCenterIdx);
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
                                    width:       isCenter ? "300px" : "190px",
                                    height:      isCenter ? "370px" : "234px",
                                    opacity:     !isVisible ? 0 : isCenter ? 1 : 0.75,
                                    fontSize:    isCenter ? "26px" : "16px",
                                    borderColor: isCenter ? "#60a5fa" : "transparent",
                                    boxShadow:   isCenter ? "0 0 32px rgba(96,165,250,0.22)" : "none",
                  ...(suppressTransition ? { transition: "none" } : {}),
                }}
                onClick={isVisible && !isCenter ? () => setCenterIdx(card.id) : undefined}
              >
                <div className={styles.cardImagePlaceholder} />
                <p className={`${styles.cardName}${isCenter ? ` ${styles.cardNameCenter}` : ""}`}>
                  {card.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right button */}
      <button
        className={styles.carouselBtn}
        onClick={() => setCenterIdx((centerIdx + 1) % COUNT)}
        aria-label="Next"
      >
        <svg className={styles.carouselChevron} viewBox="0 0 32 100">
          <polyline points="8 2 28 50 8 98" />
        </svg>
      </button>
    </div>
  );
}

