
/**
 * Theme Configuration for Digital Menu
 * This file defines the visual identity of the menu.
 * AI tools (like Gemini/Antigravity) can read this to understand the design system.
 */

export const THEME_CONFIG = {
  name: "Atyab Modern Oriental",
  version: "1.0.0",
  author: "Atyab Al-Badrashein",
  description: "A high-contrast, interactive digital menu theme with glassmorphism and smooth animations.",
  
  // Color Palette
  colors: {
    primary: "#eab308", // Brand Yellow
    secondary: "#f36f21", // Brand Orange
    background: {
      light: "#ffffff",
      dark: "#050505"
    },
    surface: {
      light: "rgba(255, 255, 255, 0.8)",
      dark: "rgba(15, 15, 15, 0.7)"
    },
    text: {
      light: "#1a1a1a",
      dark: "#ffffff",
      muted: "#71717a"
    },
    accent: "#eab308",
    border: "rgba(234, 179, 8, 0.3)"
  },

  // Typography
  typography: {
    fontFamily: "'Cairo', sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 600,
      bold: 700,
      extraBold: 800,
      black: 900
    }
  },

  // Animation Constants
  animations: {
    reveal: "reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
    slideUp: "slideUp 0.3s ease-out forwards",
    popularPulse: "popular-pulse 2s infinite ease-in-out",
    floatingEmoji: "floating-emoji 3s ease-in-out infinite",
    spicyShake: "spicy-shake 2.5s ease-in-out infinite"
  },

  // Layout & UI Components
  ui: {
    borderRadius: "1rem", // 16px
    glassBlur: "12px",
    headerHeight: "170px",
    cardShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    activeGlow: "0 0 20px rgba(234, 179, 8, 0.3)"
  }
};
