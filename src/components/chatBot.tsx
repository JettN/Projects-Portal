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