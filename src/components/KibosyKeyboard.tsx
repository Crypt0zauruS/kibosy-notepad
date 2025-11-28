import React, { useCallback, useState } from "react";
import Draggable from "react-draggable";
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
  onClose: () => void;
}

export const KibosyKeyboard: React.FC<KibosyKeyboardProps> = ({ onInsert, onClose }) => {
  const { isDark } = useTheme();
  const [size, setSize] = useState({ width: 480, height: 400 });
  const [isResizing, setIsResizing] = useState(false);

  // Position initiale centrée
  const [position] = useState(() => ({
    x: (window.innerWidth - 480) / 2,
    y: Math.max(50, (window.innerHeight - 400) / 2 - 50)
  }));

  const handleLetterClick = useCallback(
    (e: React.MouseEvent, letter: string) => {
      e.preventDefault();
      e.stopPropagation();
      onInsert(letter);
    },
    [onInsert]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = Math.max(300, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(250, startHeight + (moveEvent.clientY - startY));
      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [size]);

  return (
    <Draggable handle=".drag-handle" defaultPosition={position} bounds="body">
      <div
        className="kibosy-keyboard"
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          minWidth: "300px",
          minHeight: "250px",
          userSelect: isResizing ? "none" : "auto",
        }}
      >
        <div
          className="rounded-2xl border-2 shadow-2xl h-full flex flex-col"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))"
              : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
            borderColor: CRAB_COLORS.glow,
            backdropFilter: "blur(25px)",
            boxShadow: `0 0 50px ${CRAB_COLORS.primary}30`,
          }}
        >
          {/* Header draggable */}
          <div
            className="drag-handle flex items-center justify-between px-5 py-4 border-b"
            style={{
              borderColor: CRAB_COLORS.glow,
              cursor: 'grab',
              background: isDark
                ? 'rgba(255,255,255,0.02)'
                : 'rgba(0,0,0,0.02)'
            }}
            onMouseDown={(e) => {
              if (e.currentTarget === e.target || e.currentTarget.contains(e.target as Node)) {
                (e.currentTarget as HTMLElement).style.cursor = 'grabbing';
              }
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.cursor = 'grab';
            }}
          >
            <div className="flex items-center gap-3">
              <span style={{ fontSize: "24px" }}>🦀</span>
              <h3
                className="font-bold text-lg select-none"
                style={{
                  color: isDark ? "#ffffff" : "#000000",
                  letterSpacing: '0.02em'
                }}
              >
                Caractères Kibosy
              </h3>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-red-500/20 rounded-lg transition-all hover:scale-110 active:scale-95"
              style={{
                color: CRAB_COLORS.primary,
                fontSize: '24px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              title="Fermer le clavier"
            >
              ✕
            </button>
          </div>

          {/* Contenu scrollable */}
          <div
            className="flex-1 overflow-y-auto p-5"
            style={{ cursor: 'default' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(ACCENTED_GROUPS).map(([baseLetter, variants]) => (
                <div
                  key={baseLetter}
                  className="p-3 rounded-lg"
                  style={{
                    background: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                    border: `1px solid ${
                      isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }`,
                  }}
                >
                  <div
                    className="text-center mb-2 font-bold text-sm opacity-60 select-none"
                    style={{
                      color: isDark ? "#ffffff" : "#000000",
                    }}
                  >
                    {baseLetter}
                  </div>
                  <div className="flex flex-wrap justify-center">
                    {variants.map((char) => (
                      <button
                        key={char}
                        onClick={(e) => handleLetterClick(e, char)}
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
                          cursor: 'pointer',
                          fontFamily: 'Menlo, Consolas, monospace'
                        }}
                        title={`Insérer ${char}`}
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize transition-opacity hover:opacity-100"
            onMouseDown={handleMouseDown}
            style={{
              background: `linear-gradient(135deg, transparent 45%, ${CRAB_COLORS.primary}60 50%, ${CRAB_COLORS.glow}90 55%)`,
              borderBottomRightRadius: "1rem",
              opacity: 0.6
            }}
            title="Redimensionner"
          />
        </div>
      </div>
    </Draggable>
  );
};

export default KibosyKeyboard;
