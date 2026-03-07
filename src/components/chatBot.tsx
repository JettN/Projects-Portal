"use client";

import { useState, useRef, useEffect } from "react";
import styles from "../styles/chatbot.module.css";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const BOT_RESPONSE =
  "Thanks for reaching out! I'm the HKN Online Assistant. I can help you learn about our projects, resources, events, and more. Currently, HKN at UCSD is working on several exciting engineering projects. Feel free to ask about our tutoring resources, upcoming events, or how to get involved with the chapter!";

const INITIAL_MESSAGE: Message = {
  id: 0,
  sender: "bot",
  text: "Hello! I'm the HKN Chatbot. How can I help you learn about our projects today?",
  timestamp: new Date(),
};

export default function HKNChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: BOT_RESPONSE,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const BotIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M12 2C6.477 2 2 6.268 2 11.5c0 2.1.72 4.04 1.93 5.6L2.5 21l4.26-1.36A10.3 10.3 0 0012 21c5.523 0 10-4.268 10-9.5S17.523 2 12 2z" />
    </svg>
  );

  return (
    <>
      {/* Floating trigger button */}
      {!isOpen && (
        <button
          className={styles.floatBtn}
          onClick={() => setIsOpen(true)}
          aria-label="Open HKN Chatbot"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C6.477 2 2 6.268 2 11.5c0 2.1.72 4.04 1.93 5.6L2.5 21l4.26-1.36A10.3 10.3 0 0012 21c5.523 0 10-4.268 10-9.5S17.523 2 12 2z"
              fill="white"
            />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`${styles.window} ${isExpanded ? styles.expanded : ""}`}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.avatar}>
                <BotIcon size={18} />
              </div>
              <div>
                <div className={styles.headerTitle}>HKN Online Assistant</div>
                <div className={styles.statusRow}>
                  <div className={styles.statusDot} />
                  <span className={styles.statusText}>Online</span>
                </div>
              </div>
            </div>

            <div className={styles.headerActions}>
              {/* Expand / shrink toggle */}
              <button
                className={styles.iconBtn}
                onClick={() => setIsExpanded((v) => !v)}
                aria-label={isExpanded ? "Shrink chat" : "Expand chat"}
                title={isExpanded ? "Restore" : "Expand to full screen"}
              >
                {isExpanded ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 14 10 14 10 20" />
                    <polyline points="20 10 14 10 14 4" />
                    <line x1="10" y1="14" x2="3" y2="21" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9" />
                    <polyline points="9 21 3 21 3 15" />
                    <line x1="21" y1="3" x2="14" y2="10" />
                    <line x1="3" y1="21" x2="10" y2="14" />
                  </svg>
                )}
              </button>

              {/* Close button */}
              <button
                className={styles.iconBtn}
                onClick={() => { setIsOpen(false); setIsExpanded(false); }}
                aria-label="Close chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg) => (
              <div key={msg.id} className={`${styles.msgRow} ${styles[msg.sender]}`}>
                {msg.sender === "bot" && (
                  <div className={styles.botAvatar}>
                    <BotIcon size={14} />
                  </div>
                )}
                <div className={`${styles.msgGroup} ${styles[msg.sender]} ${isExpanded ? styles.expanded : ""}`}>
                  <div className={`${styles.bubble} ${styles[msg.sender]}`}>
                    {msg.text}
                  </div>
                  <span className={styles.timestamp}>{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className={styles.typingRow}>
                <div className={styles.botAvatar}>
                  <BotIcon size={14} />
                </div>
                <div className={styles.typingBubble}>
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                  <div className={styles.dot} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          
        </div>
      )}
    </>
  );
}