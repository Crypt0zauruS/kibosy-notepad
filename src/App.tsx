// ========================================
// 🦀 KIBOSY NOTEPAD - APPLICATION PRINCIPALE
// Bloc-notes officiel pour la langue Kibosy de Mayotte
// ========================================

import { useState, useEffect, useRef, useCallback } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, readTextFile, BaseDirectory, exists, mkdir } from "@tauri-apps/plugin-fs";
import KibosyKeyboard from "./components/KibosyKeyboard";
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
  // 🔧 STATES
  // ========================================
  const [text, setText] = useState("");
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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
        const dirExists = await exists("Kibosy", { baseDir: BaseDirectory.Document });
        if (!dirExists) {
          await mkdir("Kibosy", { baseDir: BaseDirectory.Document, recursive: true });
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
  // 🗂️ GESTION FICHIERS
  // ========================================

  const handleNew = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "Vous avez des modifications non sauvegardées. Continuer ?"
      );
      if (!confirmed) return;
    }
    
    setText("");
    setCurrentFile(null);
    lastSavedTextRef.current = "";
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  const handleOpen = useCallback(async () => {
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
      alert("Erreur lors de l'ouverture du fichier");
    }
  }, []);

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
      alert("Erreur lors de la sauvegarde");
    }
  }, [currentFile, text]);

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
      alert("Erreur lors de l'enregistrement");
    }
  }, [text]);

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
      alert("Erreur lors de l'export");
    }
  }, [text]);

  // ========================================
  // ⌨️ INSERTION DEPUIS CLAVIER
  // ========================================
  const handleInsertFromKeyboard = useCallback((letter: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;
      
      // Manipuler directement le textarea DOM
      const newText = currentText.slice(0, start) + letter + currentText.slice(end);
      textarea.value = newText;
      
      // Positionner le curseur IMMÉDIATEMENT après avoir changé la valeur
      const newPosition = start + letter.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
      
      // Synchroniser avec React state
      setText(newText);
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
          <span className="app-title">🦀 Kibosy Notepad</span>
          <button 
            onClick={() => setShowKeyboard(!showKeyboard)} 
            className="crab-toggle-btn"
            title="Ouvrir/Fermer le clavier Kibosy"
            style={{
              background: 'none',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer',
              marginLeft: '10px',
              padding: '0',
              lineHeight: '1',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
          <button onClick={handleNew} className="header-btn" title="Nouveau (Ctrl+N)">
            📄 Nouveau
          </button>
          <button onClick={handleOpen} className="header-btn" title="Ouvrir (Ctrl+O)">
            📂 Ouvrir
          </button>
          <button onClick={handleSave} className="header-btn" title="Enregistrer (Ctrl+S)">
            💾 Enregistrer
          </button>
          <button onClick={toggleTheme} className="header-btn" title="Changer le thème">
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ZONE DE TEXTE PRINCIPALE */}
      <main className="app-main" style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="main-textarea"
          placeholder="Écrivez votre texte en Kibosy... Cliquez sur le crabe 🦀 pour utiliser le clavier virtuel !"
          spellCheck={false}
        />
        
        {/* 🦀 CLAVIER KIBOSY EN OVERLAY */}
        {showKeyboard && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}>
            <KibosyKeyboard onInsert={handleInsertFromKeyboard} />
          </div>
        )}
      </main>

      {/* FOOTER STATISTIQUES */}
      <footer className="app-footer">
        <div className="stats">
          <span>📝 {stats.characters} caractères</span>
          <span>•</span>
          <span>🔤 {stats.words} mots</span>
          <span>•</span>
          <span>📄 {stats.lines} lignes</span>
        </div>
        <div className="footer-info">
          {hasUnsavedChanges && <span className="unsaved-indicator">● Modifications non sauvegardées</span>}
          <span className="autosave-info">💾 Sauvegarde automatique activée</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
