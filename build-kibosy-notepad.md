# Kibosy Notepad – build.md  
*(Mémo sale mais précis pour builder sur macOS, Windows et Linux/WSL.)*

---

## 0. Philosophie générale

- **Ne jamais partager `node_modules` entre OS.**
- **Ne jamais installer / builder côté WSL dans `/mnt/c`, `/mnt/h`, etc.**  
  → Sur WSL, tu bosses dans `~/Projets/...` (vrai FS Linux, ext4).  
- Un **clone de repo par OS** :
  - macOS : `~/Dev/kibosy-notepad-tauri` (exemple)
  - Windows : `H:\Projet Marovoanio\kibosy-notepad-tauri`
  - Linux/WSL : `~/Projets/kibosy-notepad-tauri-linux`

Tauri génère :

- macOS : `.app` / `.dmg`
- Windows : `.msi` (WiX) + `.exe` (NSIS)
- Linux : `.deb` + `.rpm` + `.AppImage`

---

## 1. Config Tauri commune (langue, bundle, etc.)

Fichier : `src-tauri/tauri.conf.json` (extrait important) :

```jsonc
{
  "$schema": "https://schema.tauri.app/config/2.0.0",
  "productName": "Kibosy Notepad",
  "version": "1.0.0",
  "identifier": "org.kibosy.kibosy-notepad",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:1420",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "resources": [],
    "copyright": "© 2024 Marovoanio",
    "category": "Productivity",
    "shortDescription": "Bloc-notes officiel pour la langue Kibosy de Mayotte",
    "longDescription": "Application desktop pour écrire en Kibosy avec clavier virtuel intégré incluant l'alphabet officiel PVAP 2024-2025. Sauvegarde automatique, gestion de fichiers récents, export TXT.",
    "windows": {
      "wix": {
        "language": "fr-FR"
      },
      "nsis": {
        "displayLanguageSelector": true
        // Optionnel pour forcer uniquement le français :
        // "languages": ["French"]
      }
    }
  }
}
```

Effet :

- MSI Windows généré en **français** (`fr-FR`).
- Setup NSIS avec sélecteur de langue.

---

## 2. macOS – Build de la version Mac

### 2.1. Prérequis (une fois)

```bash
# Xcode CLT
xcode-select --install

# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# Tauri CLI
cargo install tauri-cli
```

Node : via `nvm`, `fnm`, etc. (classique).

### 2.2. Build macOS

```bash
cd ~/Dev/kibosy-notepad-tauri   # adapter le chemin réel

npm install
npm run build
tauri build
```

Sorties principales :

- Binaire : `src-tauri/target/release/kibosy-notepad`
- Bundle macOS : `src-tauri/target/release/bundle/macos/...`

---

## 3. Windows natif – MSI + setup.exe

**Important :** ici on utilise **PowerShell / CMD**, pas WSL.

### 3.1. Prérequis (une fois)

- Node LTS pour Windows.
- Rust (toolchain MSVC).
- Outils C++ (Visual Studio Build Tools).
- Tauri CLI :

```powershell
cargo install tauri-cli
```

### 3.2. Build Windows

```powershell
cd "H:\Projet Marovoanio\kibosy-notepad-tauri"

npm install
npm run build
tauri build
```

Sorties principales :

- EXE :  
  `src-tauri\target\release\kibosy-notepad.exe`
- MSI (WiX, FR) :  
  `src-tauri\target\release\bundle\msi\Kibosy Notepad_1.0.0_x64_fr-FR.msi`
- Setup NSIS :  
  `src-tauri\target\release\bundle\nsis\Kibosy Notepad_1.0.0_x64-setup.exe`

---

## 4. Linux / WSL – AppImage + .deb + .rpm

### 4.1. Règle d’or WSL

- **Ne jamais installer / builder dans `/mnt/h/...`**.
- On utilise le disque Linux WSL : `~/Projets/kibosy-notepad-tauri-linux`.

### 4.2. Prérequis système (Ubuntu/WSL, une fois)

```bash
sudo apt update
sudo apt install -y \
  libwebkit2gtk-4.1-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev \
  build-essential \
  curl \
  wget \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  pkg-config \
  fonts-noto-color-emoji
```

- `fonts-noto-color-emoji` → emojis colorés corrects dans le WebView (moins de carrés moches).

Rust + Tauri CLI :

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

cargo install tauri-cli
```

### 4.3. Première copie du projet Windows → WSL (sans node_modules)

Tu es sur WSL dans le projet monté Windows :

```bash
cd "/mnt/h/Projet Marovoanio/kibosy-notepad-tauri"

mkdir -p ~/Projets

rsync -a \
  --exclude=node_modules \
  --exclude=src-tauri/target \
  --exclude=dist \
  ./ \
  ~/Projets/kibosy-notepad-tauri-linux
```

Tu obtiens le clone Linux ici :

```bash
~/Projets/kibosy-notepad-tauri-linux
```

### 4.4. Build Linux (AppImage + .deb + .rpm)

```bash
cd ~/Projets/kibosy-notepad-tauri-linux

# Sécurité : nettoyer les traces cross-OS
rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null || true

npm install
npm run build

# Build complet Linux (deb + rpm + AppImage)
tauri build
# ou explicitement :
# tauri build --bundles deb,rpm,appimage
```

Sorties :

- Binaire brut :  
  `src-tauri/target/release/kibosy-notepad`
- .deb :  
  `src-tauri/target/release/bundle/deb/Kibosy Notepad_1.0.0_amd64.deb`
- .rpm :  
  `src-tauri/target/release/bundle/rpm/Kibosy Notepad-1.0.0-1.x86_64.rpm`
- AppImage :  
  `src-tauri/target/release/bundle/appimage/Kibosy Notepad_1.0.0_amd64.AppImage`

**Note :** l’AppImage est déjà exécutable. Si besoin :

```bash
chmod +x "src-tauri/target/release/bundle/appimage/Kibosy Notepad_1.0.0_amd64.AppImage"
```

### 4.5. Mettre à jour le clone WSL après modifs sous Windows

Quand tu modifies du code dans `H:\...` et que tu veux rebuilder Linux :

```bash
cd "/mnt/h/Projet Marovoanio/kibosy-notepad-tauri"

rsync -a \
  --exclude=node_modules \
  --exclude=src-tauri/target \
  --exclude=dist \
  ./ \
  ~/Projets/kibosy-notepad-tauri-linux
```

Puis côté WSL :

```bash
cd ~/Projets/kibosy-notepad-tauri-linux

# Si tu n’as pas touché aux deps : npm install facultatif
npm run build
tauri build --bundles deb,rpm,appimage
```

---

## 5. Emojis cassés sous Linux / WSL

### 5.1. Côté système (WSL / Linux)

Déjà fait plus haut, mais à retenir :

```bash
sudo apt install -y fonts-noto-color-emoji
fc-cache -f -v
```

### 5.2. Côté CSS (fallback propre dans ton app)

Dans ton CSS global (ex. `src/styles.css`) :

```css
:root {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Segoe UI Emoji",
    "Apple Color Emoji",
    "Noto Color Emoji",
    sans-serif;
}
```

Ça donne :

- Windows → `Segoe UI Emoji`
- macOS → `Apple Color Emoji`
- Linux → `Noto Color Emoji` si installée

Plus tard, tu peux encore durcir le truc avec un `@font-face` qui ship une police emoji avec l’app si besoin.

---

## 6. Warnings `__TAURI_BUNDLE_TYPE` sous Linux (optionnel)

Message typique :

> `Warn Failed to add bundler type to the binary: __TAURI_BUNDLE_TYPE variable not found in binary.`  
> `Updater plugin may not be able to update this package.`

- Tes `.deb`, `.rpm` et `.AppImage` sont **fonctionnels**.
- Ce warning concerne surtout le **plugin d’auto-update Tauri**.

Si un jour tu veux le supprimer proprement :

1. Vérifie `src-tauri/Cargo.toml` → éviter un `strip = true` agressif dans `[profile.release]`.  
   Exemple plus safe :

   ```toml
   [profile.release]
   codegen-units = 1
   lto = true
   opt-level = "s"
   panic = "abort"
   # strip = "none"  # ou simplement commenter la ligne
   ```

2. Assure-toi que les versions `tauri` (crate) et `@tauri-apps/cli` sont cohérentes.

Mais pour le moment : **ce n’est pas bloquant** pour livrer l’app.

---

## 7. Copier l’AppImage sur le disque externe (H:) depuis WSL

Ton AppImage :

```bash
/home/maximus/Projets/kibosy-notepad-tauri-linux/src-tauri/target/release/bundle/appimage/Kibosy Notepad_1.0.0_amd64.AppImage
```

Ton disque externe Windows `H:` est vu dans WSL comme `/mnt/h`.

Exemple pour copier l’AppImage à la racine du projet sur H: :

```bash
cp /home/maximus/Projets/kibosy-notepad-tauri-linux/src-tauri/target/release/bundle/appimage/Kibosy\ Notepad_1.0.0_amd64.AppImage \
   /mnt/h/Projet\ Marovoanio/kibosy-notepad-tauri/Kibosy\ Notepad_1.0.0_amd64.AppImage
```

Ou mieux, avec un dossier `releases` dédié :

```bash
mkdir -p /mnt/h/Projet\ Marovoanio/kibosy-notepad-tauri/releases

cp /home/maximus/Projets/kibosy-notepad-tauri-linux/src-tauri/target/release/bundle/appimage/Kibosy\ Notepad_1.0.0_amd64.AppImage \
   /mnt/h/Projet\ Marovoanio/kibosy-notepad-tauri/releases/Kibosy\ Notepad_1.0.0_amd64.AppImage
```

---

## 8. Pense-bête ultra court

### macOS

```bash
cd ~/Dev/kibosy-notepad-tauri
npm install
npm run build
tauri build
```

### Windows (PowerShell / CMD)

```powershell
cd "H:\Projet Marovoanio\kibosy-notepad-tauri"
npm install
npm run build
tauri build
```

### Linux / WSL

```bash
# sync depuis Windows
cd "/mnt/h/Projet Marovoanio/kibosy-notepad-tauri"
rsync -a --exclude=node_modules --exclude=src-tauri/target --exclude=dist ./ ~/Projets/kibosy-notepad-tauri-linux

# build Linux
cd ~/Projets/kibosy-notepad-tauri-linux
rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null || true  # première fois
npm install
npm run build
tauri build --bundles deb,rpm,appimage
```

Garde ce fichier dans le repo **et** sur le disque externe : plus besoin de te retaper toute la science WSL / Tauri la prochaine fois.
