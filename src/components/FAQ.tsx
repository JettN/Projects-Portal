"use client";
import { useState } from "react";
import styles from "../styles/showcase.module.css";

// Sub-component for a single FAQ item
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.faq}>
      <button 
        className={styles.faqHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.faqQues}>{question}</span>
        
        {/* The Arrow Container */}
        <span className={`${styles.arrow} ${isOpen ? styles.arrowRotated : ""}`}>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </button>
      
      <div className={`${styles.faqContent} ${isOpen ? styles.show : ""}`}>
        <p className={styles.faqAns}>{answer}</p>
      </div>
    </div>
  );
};

export default function FAQSection() {
  return (
    <div className={styles.faqsContainer}>
        <FAQItem 
          question="Question...?" 
          answer="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." 
        />
        <FAQItem 
          question="Question...?" 
          answer="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." 
        />
        <FAQItem 
          question="Question...?" 
          answer="Answer the frequently asked question in a simple sentence, a longish paragraph, or even in a list." 
        />
      </div>
  );
}