#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;
use tauri_plugin_log::LogTarget;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().targets([
      LogTarget::LogDir,
      LogTarget::Stdout,
      LogTarget::Webview,
    ]).build())
    .setup(|app| {
      #[cfg(debug_assertions)]
      {
        let window = app.get_window("main").unwrap();
        window.open_devtools();
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}