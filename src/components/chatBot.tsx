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
}