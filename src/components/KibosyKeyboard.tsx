import { useCallback, useState } from "react";
import Draggable from "react-draggable";

const COLORS = {
  // Palette moderne et élégante
  primary: "#ef4444",
  primaryLight: "#fca5a5",
  dark: {
    bg: "rgba(15, 23, 42, 0.95)",
    bgSecondary: "rgba(30, 41, 59, 0.8)",
    border: "rgba(71, 85, 105, 0.4)",
    text: "#f1f5f9",
    textMuted: "#94a3b8",
  },
  light: {
    bg: "rgba(255, 255, 255, 0.95)",
    bgSecondary: "rgba(248, 250, 252, 0.9)",
    border: "rgba(203, 213, 225, 0.6)",
    text: "#0f172a",
    textMuted: "#64748b",
  },
};

// ✅ ALPHABET OFFICIEL PVAP 2024-2025 - 28 LETTRES
const ACCENTED_GROUPS = {
  B: ["Ɓ", "ɓ"],
  D: ["Ɖ", "ɖ"],
  J: ["Ĵ", "ĵ"],
  N: ["Ñ", "ñ"],
  O: ["Ô", "ô"],
  S: ["Ŝ", "ŝ"],
  Z: ["Ẑ", "ẑ"],
} as const;

// ✅ ANNEXE - 11 DIGRAMMES
const ANNEXE_GROUPS = {
  "Digrammes 1": ["gn", "ng", "ao"],
  "Digrammes 2": ["mp", "mb", "ts"],
  "Digrammes 3": ["tr", "dh", "dy"],
  "Digrammes 4": ["dr", "ndr"],
} as const;


interface KibosyKeyboardProps {
  onInsert: (text: string) => void;
  onClose: () => void;
}

const KibosyKeyboard = ({ onInsert, onClose }: KibosyKeyboardProps) => {
  const [isDark] = useState(() => {
    const root = document.querySelector('.app-container');
    return root?.classList.contains('dark') ?? true;
  });
  
  const [size, setSize] = useState({ width: 480, height: 450 });
  const [isResizing, setIsResizing] = useState(false);

  const theme = isDark ? COLORS.dark : COLORS.light;

  // Position initiale centrée
  const [position] = useState(() => ({
    x: (window.innerWidth - 480) / 2,
    y: Math.max(60, (window.innerHeight - 450) / 2 - 40)
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
      const newWidth = Math.max(400, Math.min(800, startWidth + (moveEvent.clientX - startX)));
      const newHeight = Math.max(350, Math.min(700, startHeight + (moveEvent.clientY - startY)));
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
        style={{
          position: 'absolute',
          width: `${size.width}px`,
          height: `${size.height}px`,
          minWidth: "400px",
          minHeight: "350px",
          userSelect: isResizing ? "none" : "auto",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            background: theme.bg,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            boxShadow: isDark 
              ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(239, 68, 68, 0.2)'
              : '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(239, 68, 68, 0.1)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* HEADER MODERNE */}
          <div
            className="drag-handle"
            style={{
              padding: '12px 16px',
              borderBottom: `1px solid ${theme.border}`,
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: theme.bgSecondary,
              userSelect: 'none',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>🦀</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: theme.text,
                  letterSpacing: '0.3px',
                }}
              >
                Alphabet Kibosy
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: '500',
                  color: theme.textMuted,
                  background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.08)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  letterSpacing: '0.5px',
                }}
              >
                PVAP 2024-2025
              </span>
            </div>
            
            {/* Bouton fermer élégant */}
            <button
              onClick={onClose}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                border: 'none',
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                color: theme.textMuted,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = COLORS.primary;
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.color = theme.textMuted;
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="Fermer"
            >
              ×
            </button>
          </div>

          {/* CONTENU SCROLLABLE */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              overflowX: 'hidden',
            }}
          >
            {/* ALPHABET */}
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme.textMuted,
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}
            >
              ALPHABET
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}>
              {Object.entries(ACCENTED_GROUPS).map(([baseLetter, variants]) => (
                <div
                  key={baseLetter}
                  style={{
                    background: theme.bgSecondary,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    padding: '10px',
                  }}
                >
                  {/* Label de la lettre de base */}
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: theme.textMuted,
                      marginBottom: '8px',
                      textAlign: 'center',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {baseLetter}
                  </div>
                  
                  {/* Boutons des variantes */}
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'center',
                  }}>
                    {variants.map((char) => (
                      <button
                        key={char}
                        onClick={(e) => handleLetterClick(e, char)}
                        style={{
                          minWidth: char.length > 1 ? '44px' : '38px',
                          height: '38px',
                          borderRadius: '6px',
                          border: `1px solid ${theme.border}`,
                          background: isDark 
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.05))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(249, 115, 22, 0.03))',
                          color: theme.text,
                          fontSize: char.length > 1 ? '15px' : '18px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.08) translateY(-1px)';
                          e.currentTarget.style.borderColor = COLORS.primary;
                          e.currentTarget.style.background = isDark
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.1))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(249, 115, 22, 0.08))';
                          e.currentTarget.style.boxShadow = `0 4px 12px ${isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)'}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1) translateY(0)';
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.background = isDark
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(249, 115, 22, 0.05))'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(249, 115, 22, 0.03))';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'scale(0.95)';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'scale(1.08) translateY(-1px)';
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

            {/* ANNEXE */}
            <h4
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme.textMuted,
                marginBottom: '12px',
                letterSpacing: '0.5px',
              }}
            >
              ANNEXE (11 digrammes)
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '12px',
            }}>
              {Object.entries(ANNEXE_GROUPS).map(([groupName, variants]) => (
                <div
                  key={groupName}
                  style={{
                    background: theme.bgSecondary,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                    padding: '10px',
                  }}
                >
                  {/* Boutons des digrammes */}
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap',
                    gap: '6px',
                    justifyContent: 'center',
                  }}>
                    {variants.map((char) => (
                      <button
                        key={char}
                        onClick={(e) => handleLetterClick(e, char)}
                        style={{
                          minWidth: '44px',
                          height: '38px',
                          borderRadius: '6px',
                          border: `1px solid ${theme.border}`,
                          background: isDark 
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))'
                            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.03))',
                          color: theme.text,
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.08) translateY(-1px)';
                          e.currentTarget.style.borderColor = '#10b981';
                          e.currentTarget.style.background = isDark
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.1))'
                            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08))';
                          e.currentTarget.style.boxShadow = `0 4px 12px ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1) translateY(0)';
                          e.currentTarget.style.borderColor = theme.border;
                          e.currentTarget.style.background = isDark
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.05))'
                            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 182, 212, 0.03))';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.style.transform = 'scale(0.95)';
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.style.transform = 'scale(1.08) translateY(-1px)';
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

          {/* RESIZE HANDLE DISCRET */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '32px',
              height: '32px',
              cursor: 'nwse-resize',
              borderBottomRightRadius: '12px',
              background: `linear-gradient(135deg, transparent 45%, ${theme.border} 50%, ${isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'} 55%)`,
              opacity: 0.4,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.7';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.4';
            }}
            title="Redimensionner"
          />

          {/* Scrollbar custom */}
          <style>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: ${isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(100, 116, 139, 0.2)'};
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: ${isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.35)'};
            }
          `}</style>
        </div>
      </div>
    </Draggable>
  );
};

export default KibosyKeyboard;