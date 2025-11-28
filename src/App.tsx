// ========================================
// 🦀 KIBOSY NOTEPAD - APPLICATION PRINCIPALE
// Bloc-notes officiel pour la langue Kibosy de Mayotte
// ========================================

import { useState, useEffect, useRef, useCallback } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import {
  writeTextFile,
  readTextFile,
  BaseDirectory,
  exists,
  mkdir,
} from "@tauri-apps/plugin-fs";
import KibosyKeyboard from "./components/KibosyKeyboard";
import LanguageSelector from "./components/LanguageSelector";
import ConfirmDialog from "./components/ConfirmDialog";
import { useI18n } from "./lib/i18n";
import "./App.css";

// ========================================
// 🎨 TYPES
// ========================================
/*interface RecentFile {
  path: string;
  name: string;
  timestamp: number;
}*/

// ========================================
// 📦 APP PRINCIPALE
// ========================================

function App() {
  // ========================================
  // 🌍 I18N
  // ========================================
  const { t, language, setLanguage } = useI18n();

  // ========================================
  // 🔧 STATES
  // ========================================
  const [text, setText] = useState("");
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dialog de confirmation
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"new" | "open" | null>(
    null
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autosaveTimerRef = useRef<number>();
  const lastSavedTextRef = useRef("");

  // ========================================
  // 📊 STATISTIQUES
  // ========================================
  const stats = {
    characters: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split("\n").length,
  };

  // ========================================
  // 💾 SAUVEGARDE AUTOMATIQUE
  // ========================================
  useEffect(() => {
    const autosave = async () => {
      if (text === lastSavedTextRef.current) return;

      try {
        // Créer le dossier Kibosy s'il n'existe pas
        const dirExists = await exists("Kibosy", {
          baseDir: BaseDirectory.Document,
        });
        if (!dirExists) {
          await mkdir("Kibosy", {
            baseDir: BaseDirectory.Document,
            recursive: true,
          });
        }

        // Sauvegarder
        await writeTextFile("Kibosy/autosave.kibosy", text, {
          baseDir: BaseDirectory.Document,
        });

        lastSavedTextRef.current = text;
        console.log("✅ Autosave réussi");
      } catch (error) {
        console.error("❌ Erreur autosave:", error);
      }
    };

    // Autosave toutes les 5 secondes
    if (autosaveTimerRef.current) {
      clearInterval(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setInterval(autosave, 5000);

    return () => {
      if (autosaveTimerRef.current) {
        clearInterval(autosaveTimerRef.current);
      }
    };
  }, [text]);

  // ========================================
  // 📂 RÉCUPÉRATION AUTOSAVE AU DÉMARRAGE
  // ========================================
  useEffect(() => {
    const loadAutosave = async () => {
      try {
        const content = await readTextFile("Kibosy/autosave.kibosy", {
          baseDir: BaseDirectory.Document,
        });
        if (content) {
          setText(content);
          lastSavedTextRef.current = content;
          console.log("✅ Autosave récupéré");
        }
      } catch (error) {
        console.log("ℹ️ Pas d'autosave trouvé");
      }
    };

    loadAutosave();
  }, []);

  // ========================================
  // 📝 DÉTECTION CHANGEMENTS NON SAUVEGARDÉS
  // ========================================
  useEffect(() => {
    setHasUnsavedChanges(text !== lastSavedTextRef.current);
  }, [text]);

  // ========================================
  // 🚪 PRÉVENTION FERMETURE FENÊTRE
  // ========================================
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Requis pour Chrome
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // ========================================
  // 🗂️ GESTION FICHIERS
  // ========================================

  const handleNew = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingAction("new");
      setShowConfirmDialog(true);
      return;
    }

    // Si pas de changements, exécuter directement
    setText("");
    setCurrentFile(null);
    lastSavedTextRef.current = "";
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  const handleOpen = useCallback(async () => {
    // Vérifier s'il y a des modifications non sauvegardées
    if (hasUnsavedChanges) {
      setPendingAction("open");
      setShowConfirmDialog(true);
      return;
    }

    // Si pas de changements, exécuter directement
    await executeOpen();
  }, [hasUnsavedChanges]);

  // Fonction pour exécuter l'ouverture
  const executeOpen = useCallback(async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Kibosy",
            extensions: ["kibosy", "txt"],
          },
        ],
      });

      if (selected) {
        const content = await readTextFile(selected as string);
        setText(content);
        setCurrentFile(selected as string);
        lastSavedTextRef.current = content;
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error("Erreur ouverture:", error);
      alert(t("dialogs.error.open"));
    }
  }, [t]);

  // Callback pour confirmer l'action
  const handleConfirmDialog = useCallback(() => {
    setShowConfirmDialog(false);

    if (pendingAction === "new") {
      setText("");
      setCurrentFile(null);
      lastSavedTextRef.current = "";
      setHasUnsavedChanges(false);
    } else if (pendingAction === "open") {
      executeOpen();
    }

    setPendingAction(null);
  }, [pendingAction, executeOpen]);

  // Callback pour annuler l'action
  const handleCancelDialog = useCallback(() => {
    setShowConfirmDialog(false);
    setPendingAction(null);
  }, []);

  const handleSaveAs = useCallback(async () => {
    try {
      const filePath = await save({
        filters: [
          {
            name: "Kibosy",
            extensions: ["kibosy"],
          },
        ],
        defaultPath: "document.kibosy",
      });

      if (filePath) {
        await writeTextFile(filePath, text);
        setCurrentFile(filePath);
        lastSavedTextRef.current = text;
        setHasUnsavedChanges(false);

        console.log("✅ Fichier enregistré sous:", filePath);
      }
    } catch (error) {
      console.error("Erreur enregistrer sous:", error);
      alert(t("dialogs.error.save"));
    }
  }, [text, t]);

  const handleSave = useCallback(async () => {
    try {
      if (currentFile) {
        // Sauvegarder dans le fichier existant
        await writeTextFile(currentFile, text);
        lastSavedTextRef.current = text;
        setHasUnsavedChanges(false);
        console.log("✅ Fichier sauvegardé");
      } else {
        // Pas de fichier courant → Enregistrer sous
        handleSaveAs();
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      alert(t("dialogs.error.save"));
    }
  }, [currentFile, text, t, handleSaveAs]);

  const handleExportTxt = useCallback(async () => {
    try {
      const filePath = await save({
        filters: [
          {
            name: "Text",
            extensions: ["txt"],
          },
        ],
        defaultPath: "document.txt",
      });

      if (filePath) {
        await writeTextFile(filePath, text);
        console.log("✅ Export TXT réussi");
      }
    } catch (error) {
      console.error("Erreur export TXT:", error);
      alert(t("dialogs.error.export"));
    }
  }, [text, t]);

  // ========================================
  // ⌨️ INSERTION DEPUIS CLAVIER
  // ========================================
  const handleInsertFromKeyboard = useCallback((letter: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Créer le nouveau texte
      const before = textarea.value.substring(0, start);
      const after = textarea.value.substring(end);
      const newText = before + letter + after;

      // Nouvelle position du curseur
      const newCursorPos = start + letter.length;

      // Mettre à jour le texte et positionner le curseur
      setText(newText);

      // Positionner le curseur après le render
      requestAnimationFrame(() => {
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      });
    } else {
      setText((prev) => prev + letter);
    }
  }, []);

  // ========================================
  // 🎨 THÈME
  // ========================================
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  // ========================================
  // ⌨️ RACCOURCIS CLAVIER
  // ========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N : Nouveau
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        handleNew();
      }
      // Ctrl/Cmd + O : Ouvrir
      else if ((e.ctrlKey || e.metaKey) && e.key === "o") {
        e.preventDefault();
        handleOpen();
      }
      // Ctrl/Cmd + S : Enregistrer
      else if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (e.shiftKey) {
          handleSaveAs();
        } else {
          handleSave();
        }
      }
      // Ctrl/Cmd + E : Export TXT
      else if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        handleExportTxt();
      }
      // Ctrl/Cmd + K : Toggle clavier
      else if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowKeyboard((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNew, handleOpen, handleSave, handleSaveAs, handleExportTxt]);

  // ========================================
  // 🎨 RENDER
  // ========================================
  return (
    <div className={`app-container ${isDark ? "dark" : "light"}`}>
      {/* HEADER */}
      <header className="app-header">
        <div className="header-left">
          <span className="app-title">🦀 {t("app.title")}</span>
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="crab-toggle-btn"
            title={t("keyboard.toggle")}
            style={{
              background: "none",
              border: "none",
              fontSize: "32px",
              cursor: "pointer",
              marginLeft: "10px",
              padding: "0",
              lineHeight: "1",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🦀
          </button>
          {currentFile && (
            <span className="current-file">
              {currentFile.split(/[\\/]/).pop()}
              {hasUnsavedChanges && " *"}
            </span>
          )}
        </div>

        <div className="header-controls">
          <button
            onClick={handleNew}
            className="header-btn"
            title={t("shortcuts.new")}
          >
            📄 {t("menu.new")}
          </button>
          <button
            onClick={handleOpen}
            className="header-btn"
            title={t("shortcuts.open")}
          >
            📂 {t("menu.open")}
          </button>
          <button
            onClick={handleSave}
            className="header-btn"
            title={t("shortcuts.save")}
          >
            💾 {t("menu.save")}
          </button>

          {/* SÉLECTEUR DE LANGUE */}
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={setLanguage}
            isDark={isDark}
          />

          <button
            onClick={toggleTheme}
            className="header-btn"
            title={t("theme.toggle")}
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ZONE DE TEXTE PRINCIPALE */}
      <main className="app-main">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="main-textarea"
          placeholder={t("editor.placeholder")}
          spellCheck={false}
        />
      </main>

      {/* 🦀 CLAVIER KIBOSY DRAGGABLE - hors du main pour éviter overflow:hidden */}
      {showKeyboard && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <div style={{ pointerEvents: "auto" }}>
            <KibosyKeyboard
              onInsert={handleInsertFromKeyboard}
              onClose={() => setShowKeyboard(false)}
            />
          </div>
        </div>
      )}

      {/* FOOTER STATISTIQUES */}
      <footer className="app-footer">
        <div className="stats">
          <span>
            📝 {stats.characters} {t("stats.characters")}
          </span>
          <span>•</span>
          <span>
            🔤 {stats.words} {t("stats.words")}
          </span>
          <span>•</span>
          <span>
            📄 {stats.lines} {t("stats.lines")}
          </span>
        </div>
        <div className="footer-info">
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">● {t("status.unsaved")}</span>
          )}
          <span className="autosave-info">💾 {t("status.autosave")}</span>
        </div>
      </footer>

      {/* DIALOG DE CONFIRMATION */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        title={t("dialogs.unsavedTitle")}
        message={t("dialogs.unsavedChanges")}
        confirmText={t("dialogs.confirm")}
        cancelText={t("dialogs.cancel")}
        onConfirm={handleConfirmDialog}
        onCancel={handleCancelDialog}
        isDark={isDark}
      />
    </div>
  );
}

export default App;
