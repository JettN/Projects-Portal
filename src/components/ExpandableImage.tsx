"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "../styles/showcase.module.css";

interface ExpandableImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export default function ExpandableImage({
  src = "/PC_MasterFloorPlanLevel2.jpg",
  alt = "Price Center Master Floor Plan Level 2",
  width = 400,
  height = 300,
}: ExpandableImage) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Thumbnail */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={styles.thumbnail}
        onClick={() => setExpanded(true)}
      />

      {/* Modal */}
      {expanded && (
        <div
          className={styles.overlay}
          onClick={() => setExpanded(false)}
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setExpanded(false)}
            >
              ×
            </button>

            <Image
              src={src}
              alt={alt}
              width={1400}
              height={900}
              className={styles.expandedImage}
            />
          </div>
        </div>
      )}
    </>
  );
}