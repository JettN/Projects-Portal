"use client";

import { useState } from "react";
import styles from "../styles/home.module.css";

// List of project names; image association needs to be added
const cards = [
  { id: 0, name: "Project A" },
  { id: 1, name: "Project B" },
  { id: 2, name: "Project C" },
  { id: 3, name: "Project D" },
  { id: 4, name: "Project E" },
];

const COUNT = cards.length;

export default function FeaturedCarousel() {
  // Index of the currently centered card
  const [centerIdx, setCenterIdx] = useState(0);

  // Calculate indices of left and right cards based on center index
  const leftIdx  = (centerIdx - 1 + COUNT) % COUNT; // COUNT is added to ensure non-negative result
  const rightIdx = (centerIdx + 1) % COUNT;

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
          {/* Left card */}
          <div
            className={`${styles.carouselCard} ${styles.carouselCardSide}`}
            onClick={() => setCenterIdx(leftIdx)}
          >
            <div className={styles.cardImagePlaceholder} />
            <p className={styles.cardName}>{cards[leftIdx].name}</p>
          </div>

          {/* Center card */}
          <div className={`${styles.carouselCard} ${styles.carouselCardCenter}`}>
            <div className={styles.cardImagePlaceholder} />
            <p className={`${styles.cardName} ${styles.cardNameCenter}`}>
              {cards[centerIdx].name}
            </p>
          </div>

          {/* Right card */}
          <div
            className={`${styles.carouselCard} ${styles.carouselCardSide}`}
            onClick={() => setCenterIdx(rightIdx)}
          >
            <div className={styles.cardImagePlaceholder} />
            <p className={styles.cardName}>{cards[rightIdx].name}</p>
          </div>
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

