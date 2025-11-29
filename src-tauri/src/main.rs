// Kibosy Notepad - Main Tauri Entry Point
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, AppHandle, Emitter};

// Command pour gérer la fermeture de l'application
#[tauri::command]
async fn close_app(app: AppHandle) {
    app.exit(0);
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![close_app])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            
            // Clone la fenêtre pour l'utiliser dans le closure
            let window_clone = window.clone();

            // Prévenir la fermeture de la fenêtre
            window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    // Empêcher la fermeture automatique
                    api.prevent_close();

                    // Émettre un événement vers le frontend avec la fenêtre clonée
                    let _ = window_clone.emit("close-requested", ());
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}