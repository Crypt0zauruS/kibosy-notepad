# 🦀 Kibosy Notepad

> **Éditeur de texte officiel pour la langue Kibosy de Mayotte**  
> Bloc-notes spécialisé avec support complet de l'alphabet PVAP 2024-2025

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Version](https://img.shields.io/badge/version-0.1.0--alpha-orange.svg)](https://github.com/Crypt0zauruS/kibosy-notepad/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue.svg)](https://github.com/Crypt0zauruS/kibosy-notepad)

---

## 📖 À propos

**Kibosy Notepad** est le premier éditeur de texte dédié à la langue **Kibosy**, parlée à Mayotte. Il offre un support complet de l'alphabet officiel PVAP 2024-2025 avec ses lettres accentuées et digrammes.

### ✨ Caractéristiques principales

- 🔤 **Alphabet complet Kibosy** : Lettres accentuées Ɓ, Ɖ, Ĵ, Ñ, Ô, Ŝ, Ẑ
- 📝 **11 digrammes de l'annexe** : gn, ng, ao, mp, mb, ts, tr, dh, dy, dr, ndr
- ⌨️ **Clavier virtuel** : Accès rapide à tous les caractères spéciaux
- 🎯 **Auto-complétion intelligente** : Popup automatique pour suggérer les variantes (activable/désactivable)
- 🌍 **Trilingue** : Interface en Français, English et Kibosy
- 🌓 **Thèmes clair/sombre** : Interface adaptative
- 💾 **Sauvegarde automatique** : Toutes les 5 secondes
- 🛡️ **Protection des données** : Alerte avant fermeture si modifications non sauvegardées
- 🎨 **Design moderne** : Interface élégante avec animations fluides

---

## 📥 Installation

### Windows
1. Téléchargez `Kibosy-Notepad_0.1.0-alpha_x64_fr-FR.msi`
2. Double-cliquez pour installer
3. Lancez "Kibosy Notepad" depuis le menu Démarrer

### macOS
1. Téléchargez `Kibosy-Notepad_0.1.0-alpha_universal.dmg`
2. Ouvrez le fichier DMG
3. Glissez "Kibosy Notepad" dans Applications
4. *Note : Si macOS bloque l'app, allez dans Préférences Système > Sécurité pour autoriser*

### Linux
1. Téléchargez le fichier `.AppImage`
2. Donnez les droits d'exécution et lancez :
   ```bash
   chmod +x Kibosy-Notepad_0.1.0-alpha_amd64.AppImage
   ./Kibosy-Notepad_0.1.0-alpha_amd64.AppImage
   ```
---

## 🚀 Utilisation

### Interface principale

```
┌────────────────────────────────────────┐
│ 🦀 Kibosy  [New][Open][Save] 🇫🇷 ☀️  │
├────────────────────────────────────────┤
│                                        │
│  Écrivez votre texte en Kibosy...     │
│                                        │
│  Cliquez sur 🦀 pour le clavier       │
│  virtuel avec tous les caractères !   │
│                                        │
├────────────────────────────────────────┤
│ 📝 0 caractères • 🔤 0 mots • 📄 1 ligne│
│         💾 Autosave  ☑️ Auto Kibosy   │
└────────────────────────────────────────┘
```

### Clavier virtuel

Cliquez sur l'icône 🦀 pour ouvrir le clavier virtuel qui affiche :
- **Alphabet** : Toutes les lettres accentuées
- **Annexe** : Les 11 digrammes officiels

### Auto-complétion

Activez "Auto Kibosy" dans le footer pour obtenir des suggestions automatiques :

```
Tapez "b" → Popup apparaît
┌──────────────┐
│      B       │
├──────────────┤
│  B  │  b     │  ← Normales
│  Ɓ  │  ɓ     │  ← Kibosy
└──────────────┘
Cliquez sur Ɓ → Insère "Ɓ"
```

### Raccourcis clavier

- `Ctrl+N` : Nouveau document
- `Ctrl+O` : Ouvrir un fichier
- `Ctrl+S` : Enregistrer
- `F12` : Activer/désactiver le thème sombre

---

## 🔤 Alphabet Kibosy PVAP 2024-2025

### Les 28 lettres

| Standard | Kibosy | Nom |
|----------|--------|-----|
| A a | - | A |
| B b | **Ɓ ɓ** | B bilabial |
| D d | **Ɖ ɖ** | D rétroflexe |
| E e | - | E |
| F f | - | F |
| G g | - | G |
| H h | - | H |
| I i | - | I |
| J j | **Ĵ ĵ** | J circonflexe |
| K k | - | K |
| L l | - | L |
| M m | - | M |
| N n | **Ñ ñ** | N tilde |
| O o | **Ô ô** | O circonflexe |
| P p | - | P |
| R r | - | R |
| S s | **Ŝ ŝ** | S circonflexe |
| T t | - | T |
| V v | - | V |
| Y y | - | Y |
| Z z | **Ẑ ẑ** | Z circonflexe |

### Les 11 digrammes (Annexe)

| Digramme | Utilisation |
|----------|-------------|
| **gn** | Comme "agneau" |
| **ng** | Comme "parking" |
| **ao** | Diphtongue |
| **mp** | Consonne nasale |
| **mb** | Consonne nasale |
| **ts** | Affriquée |
| **tr** | Consonne complexe |
| **dh** | Fricative |
| **dy** | Palatalisée |
| **dr** | Consonne complexe |
| **ndr** | Consonne complexe |

---

## 🛠️ Technologies

- **Frontend** : React + TypeScript
- **Backend** : Tauri 2.0 (Rust)
- **Build** : Vite
- **UI** : CSS custom avec thème adaptatif
- **i18n** : Système de traduction trilingue personnalisé

---

## 📋 Roadmap

### Version 0.1.0-alpha (Actuelle)
- ✅ Support alphabet complet PVAP 2024-2025
- ✅ Clavier virtuel
- ✅ Auto-complétion
- ✅ Interface trilingue
- ✅ Thèmes clair/sombre
- ✅ Sauvegarde automatique

### Version 0.2.0-beta (Prochaine)
- [ ] Correcteur orthographique Kibosy
- [ ] Suggestions de traduction
- [ ] Templates de documents
- [ ] Export PDF/DOCX

### Version 1.0.0 (Stable)
- [ ] Formatage de texte (gras, italique)
- [ ] Dictionnaire intégré
- [ ] Conjugaison automatique
- [ ] Cloud sync (optionnel)

---

## 🐛 Bugs connus (Alpha)

Cette version alpha peut contenir des bugs. Si vous en rencontrez :

1. Vérifiez les [Issues existantes](https://github.com/Crypt0zauruS/kibosy-notepad/issues)
2. Créez une nouvelle issue avec :
   - Description du bug
   - Étapes pour reproduire
   - Votre OS et version
   - Captures d'écran si possible

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Guidelines

- Code en anglais (commentaires acceptés en français)
- Suivre les conventions TypeScript/Rust existantes
- Tester sur au moins 2 OS avant PR
- Respecter l'alphabet officiel PVAP 2024-2025

---

## 📄 Licence

Ce projet est sous licence **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

**Vous êtes libre de :**
- ✅ **Partager** — copier, distribuer et communiquer le matériel
- ✅ **Adapter** — remixer, transformer et créer à partir du matériel
- ✅ **Usage commercial** autorisé

**Selon les conditions suivantes :**
- 📝 **Attribution** — Vous devez créditer l'œuvre, fournir un lien vers la licence et indiquer si des modifications ont été apportées.

**Citation suggérée :**
```
Kibosy Notepad par Crypt0zauruS, sous
Licence CC BY 4.0 : https://creativecommons.org/licenses/by/4.0/
```

Pour plus de détails, voir le fichier [LICENSE](LICENSE).

---

## 👨‍💻 Auteur

**Crypt0zauruS**
- GitHub : [@Crypt0zauruS](https://github.com/Crypt0zauruS)

---

## 🙏 Remerciements

- **PVAP (Programme de Valorisation des Apprentissages Plurilingues)** pour les spécifications de l'alphabet Kibosy 2024-2025
- **Association Marovoanio** pour le soutien linguistique
- **Tauri Team** pour le framework de développement

---

## 📊 Statut du projet

⚠️ **Version Alpha** : Cette version est en développement actif. Des bugs peuvent survenir et des fonctionnalités peuvent changer.

**Version actuelle** : 0.1.0-alpha  
**Dernière mise à jour** : Novembre 2025  
**Statut** : 🚧 En développement actif

---

## 📞 Support

Pour toute question ou problème :
- 💬 [Discussions GitHub](https://github.com/Crypt0zauruS/kibosy-notepad/discussions)
- 🐛 [Issues](https://github.com/Crypt0zauruS/kibosy-notepad/issues)

---

<p align="center">
  Fait avec ❤️ pour la langue Kibosy de Mayotte 🇾🇹
</p>
