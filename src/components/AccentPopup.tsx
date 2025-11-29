import { useEffect, useRef } from "react";

interface AccentPopupProps {
  isOpen: boolean;
  position: { x: number; y: number };
  letter: string;
  variants: string[];
  onSelect: (char: string) => void;
  onClose: () => void;
  isDark: boolean;
}

export default function AccentPopup({
  isOpen,
  position,
  letter,
  variants,
  onSelect,
  onClose,
  isDark,
}: AccentPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Fermer si clic dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const theme = isDark
    ? {
        bg: "rgba(15, 23, 42, 0.98)",
        text: "#f1f5f9",
        border: "rgba(71, 85, 105, 0.6)",
      }
    : {
        bg: "rgba(255, 255, 255, 0.98)",
        text: "#0f172a",
        border: "rgba(203, 213, 225, 0.8)",
      };

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: theme.bg,
        border: `2px solid ${theme.border}`,
        borderRadius: "8px",
        padding: "8px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(40px, 1fr))",
        gap: "6px",
        boxShadow: isDark
          ? "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 1px rgba(239, 68, 68, 0.3)"
          : "0 8px 24px rgba(0, 0, 0, 0.15), 0 0 1px rgba(239, 68, 68, 0.2)",
        zIndex: 10000,
        backdropFilter: "blur(12px)",
        minWidth: "160px",
        animation: "popupAppear 0.15s ease",
      }}
    >
      {/* Label */}
      <div
        style={{
          gridColumn: "1 / -1",
          fontSize: "11px",
          fontWeight: "600",
          color: isDark ? "#94a3b8" : "#64748b",
          textAlign: "center",
          marginBottom: "4px",
          letterSpacing: "0.5px",
        }}
      >
        {letter.toUpperCase()}
      </div>

      {/* Variantes */}
      {variants.map((char, index) => (
        <button
          key={index}
          onClick={() => onSelect(char)}
          style={{
            padding: "8px",
            borderRadius: "6px",
            border: `1px solid ${theme.border}`,
            background: isDark
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.05))"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(249, 115, 22, 0.03))",
            color: theme.text,
            fontSize: char.length > 1 ? "14px" : "18px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "38px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.background = isDark
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(249, 115, 22, 0.15))"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.1))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = theme.border;
            e.currentTarget.style.background = isDark
              ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.05))"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(249, 115, 22, 0.03))";
          }}
          title={`Insérer ${char}`}
        >
          {char}
        </button>
      ))}

      <style>{`
        @keyframes popupAppear {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
