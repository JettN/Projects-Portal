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

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection( {faqs}: {faqs: FAQ[]} ) {
  return (
    <div className={styles.faqsContainer}>
       {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
        />
      ))}
    </div>
  );
}