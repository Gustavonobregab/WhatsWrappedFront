"use client"

import React from "react"
import data from "@emoji-mart/data"
import { init } from "emoji-mart"

// Initialize emoji-mart data once
if (typeof window !== "undefined") {
  init({ data })
}

// Declare custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'em-emoji': {
        native?: string
        size?: string
        set?: string
        fallback?: string
        className?: string
      }
    }
  }
}

interface EmojiDisplayProps {
  emoji: string
  size?: string
  className?: string
  fallback?: string
}

export function EmojiDisplay({ 
  emoji, 
  size = "1em", 
  className = "",
  fallback = "❓"
}: EmojiDisplayProps) {
  // Map specific emojis that might not be recognized
  const emojiMap: { [key: string]: string } = {
    "❤": "❤️", // Red heart without color -> Red heart with color
    "😘": "😘", // Keep as is
    "😊": "😊", // Keep as is
    "🔥": "🔥", // Keep as is
    "📱": "📱", // Keep as is
    "📸": "📸", // Keep as is
    "🙏": "🙏", // Keep as is
  }

  const mappedEmoji = emojiMap[emoji] || emoji

  // If we're on the server side, just return the emoji as is
  if (typeof window === "undefined") {
    return <span className={className} style={{ fontSize: size }}>{mappedEmoji}</span>
  }

  // For client side, use the emoji-mart web component
  return (
    <em-emoji 
      native={mappedEmoji} 
      size={size}
      set="apple"
      fallback={fallback}
      className={className}
    />
  )
}

// Alternative component using the Picker's emoji rendering approach
export function AppleEmoji({ 
  emoji, 
  size = "1em", 
  className = ""
}: EmojiDisplayProps) {
  return (
    <span 
      className={className}
      style={{ 
        fontSize: size,
        fontFamily: "Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
      }}
    >
      {emoji}
    </span>
  )
}
