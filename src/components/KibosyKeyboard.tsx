import React, { useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";

const CRAB_COLORS = {
  primary: "#ef4444",
  secondary: "#f97316",
  accent: "#fbbf24",
  glow: "#fca5a5",
};

const ACCENTED_GROUPS = {
  B: ["Ɓ", "ɓ"],
  D: ["Ɖ", "ɗ"],
  J: ["Ĵ", "ĵ"],
  N: ["Ń", "ń"],
  O: ["Ô", "ô"],
  S: ["Ŝ", "ŝ"],
  Z: ["Ẑ", "ẑ"],
} as const;

interface KibosyKeyboardProps {
  onInsert: (text: string) => void;
}

export const KibosyKeyboard: React.FC<KibosyKeyboardProps> = ({ onInsert }) => {
  const { isDark } = useTheme();

  const handleLetterClick = useCallback(
    (letter: string) => {
      onInsert(letter);
    },
    [onInsert]
  );

  return (
    <motion.div
      className="relative pointer-events-auto"
      style={{ width: 'auto', maxWidth: '90vw' }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div
        className="rounded-2xl border-2 shadow-2xl p-6"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))',
          borderColor: CRAB_COLORS.glow,
          backdropFilter: "blur(25px)",
          boxShadow: `0 0 50px ${CRAB_COLORS.primary}30`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-center mb-4 pb-3 border-b"
          style={{ borderColor: CRAB_COLORS.glow }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '24px' }}>🦀</span>
            <h3 className="font-bold text-lg" style={{ color: isDark ? "#ffffff" : "#000000" }}>
              Caractères Kibosy
            </h3>
          </div>
        </div>

        {/* Groupes de lettres accentuées */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(ACCENTED_GROUPS).map(([baseLetter, variants]) => (
            <div
              key={baseLetter}
              className="p-3 rounded-lg"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              }}
            >
              <div className="text-center mb-2 font-bold text-sm opacity-60"
                style={{ color: isDark ? "#ffffff" : "#000000" }}>
                {baseLetter}
              </div>
              <div className="flex flex-wrap justify-center">
                {variants.map((char) => (
                  <button
                    key={char}
                    onClick={() => handleLetterClick(char)}
                    className="w-16 h-16 rounded-lg font-bold transition-all hover:scale-110 active:scale-95"
                    style={{
                      background: isDark
                        ? `linear-gradient(135deg, ${CRAB_COLORS.primary}30, ${CRAB_COLORS.secondary}20)`
                        : `linear-gradient(135deg, ${CRAB_COLORS.primary}20, ${CRAB_COLORS.secondary}15)`,
                      color: isDark ? "#ffffff" : "#000000",
                      border: `1px solid ${CRAB_COLORS.glow}`,
                      boxShadow: `0 2px 8px ${CRAB_COLORS.primary}20`,
                      fontSize: '28px',
                      margin: '4px',
                    }}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default KibosyKeyboard;
