import { useState, useRef, useEffect } from "react";
import { Language } from "../lib/i18n";

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isDark: boolean;
}

const LANGUAGES = [
  { code: "fr" as Language, label: "Français", flag: "🇫🇷" },
  { code: "en" as Language, label: "English", flag: "🇬🇧" },
  { code: "ki" as Language, label: "Kibosy", flag: "🇾🇹" },
];

export default function LanguageSelector({
  currentLanguage,
  onLanguageChange,
  isDark,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fermer le menu si on clique dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        const overlay = document.getElementById("lang-overlay");
        if (overlay && !overlay.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const currentLang = LANGUAGES.find((lang) => lang.code === currentLanguage);

  const handleLanguageChange = (lang: Language) => {
    onLanguageChange(lang);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="header-btn"
        title="Changer de langue"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "1.2rem" }}>{currentLang?.flag}</span>
        <span>{currentLang?.code.toUpperCase()}</span>
        <span style={{ fontSize: "0.7rem", opacity: 0.7 }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* OVERLAY FLOTTANT */}
      {isOpen && (
        <>
          {/* Backdrop semi-transparent */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(2px)",
              zIndex: 9998,
              animation: "fadeIn 0.2s ease",
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Menu flottant */}
          <div
            id="lang-overlay"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: "280px",
              background: isDark
                ? "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))"
                : "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
              border: isDark
                ? "2px solid rgba(239, 68, 68, 0.3)"
                : "2px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "16px",
              padding: "1.5rem",
              boxShadow: isDark
                ? "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(239, 68, 68, 0.2)"
                : "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(239, 68, 68, 0.15)",
              zIndex: 9999,
              animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header du overlay */}
            <div
              style={{
                marginBottom: "1.25rem",
                paddingBottom: "1rem",
                borderBottom: isDark
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: isDark ? "#ffffff" : "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                🌍 Choisir la langue
              </h3>
            </div>

            {/* Options de langues */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {LANGUAGES.map(({ code, label, flag }) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 1.25rem",
                    border:
                      currentLanguage === code
                        ? "2px solid #ef4444"
                        : isDark
                        ? "2px solid rgba(255, 255, 255, 0.1)"
                        : "2px solid rgba(0, 0, 0, 0.1)",
                    borderRadius: "12px",
                    background:
                      currentLanguage === code
                        ? isDark
                          ? "rgba(239, 68, 68, 0.15)"
                          : "rgba(239, 68, 68, 0.08)"
                        : isDark
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(0, 0, 0, 0.02)",
                    color:
                      currentLanguage === code
                        ? "#ef4444"
                        : isDark
                        ? "#cbd5e1"
                        : "#475569",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: currentLanguage === code ? "600" : "500",
                    transition: "all 0.2s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (currentLanguage !== code) {
                      e.currentTarget.style.transform = "translateX(4px)";
                      e.currentTarget.style.borderColor = "#ef4444";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentLanguage !== code) {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.borderColor = isDark
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.75rem" }}>{flag}</span>
                  <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                  {currentLanguage === code && (
                    <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Animations CSS injectées */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}</style>
        </>
      )}
    </>
  );
}
