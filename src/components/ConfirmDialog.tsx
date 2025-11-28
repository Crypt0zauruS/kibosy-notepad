import { useEffect } from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDark: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDark,
}: ConfirmDialogProps) {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const theme = isDark
    ? {
        bg: "rgba(15, 23, 42, 0.98)",
        text: "#f1f5f9",
        textMuted: "#94a3b8",
        border: "rgba(71, 85, 105, 0.4)",
      }
    : {
        bg: "rgba(255, 255, 255, 0.98)",
        text: "#0f172a",
        textMuted: "#475569",
        border: "rgba(203, 213, 225, 0.6)",
      };

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 10000,
          animation: "fadeIn 0.2s ease",
        }}
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: "400px",
          maxWidth: "500px",
          background: theme.bg,
          border: `1px solid ${theme.border}`,
          borderRadius: "12px",
          padding: "0",
          boxShadow: isDark
            ? "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 1px rgba(239, 68, 68, 0.3)"
            : "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 1px rgba(239, 68, 68, 0.2)",
          zIndex: 10001,
          animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "600",
              color: theme.text,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "24px" }}>⚠️</span>
            {title}
          </h3>
        </div>

        {/* Message */}
        <div
          style={{
            padding: "24px",
            fontSize: "15px",
            lineHeight: "1.6",
            color: theme.textMuted,
          }}
        >
          {message}
        </div>

        {/* Actions */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          {/* Bouton Annuler */}
          <button
            onClick={onCancel}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: `1px solid ${theme.border}`,
              background: isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)",
              color: theme.text,
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.08)";
              e.currentTarget.style.borderColor = theme.textMuted;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDark
                ? "rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.04)";
              e.currentTarget.style.borderColor = theme.border;
            }}
          >
            {cancelText}
          </button>

          {/* Bouton Confirmer */}
          <button
            onClick={onConfirm}
            autoFocus
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #ef4444",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#dc2626";
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}
