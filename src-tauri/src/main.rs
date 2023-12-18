// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

pub mod eth;
pub mod bip;
pub mod error;

use bip::bip39::Mnemonic;
use bip::ecdsa::KeyPair;
use error::NoirError;
use serde::Serialize;

#[derive(Serialize)]
pub struct Response<T> where T: Serialize {
  pub success: bool,
  pub result: Option<T>,
  pub message: String
}

impl<T> Response<T> where T: Serialize {
  pub fn ok(result: T) -> Response<T> {
    Response {
      success: true,
      result: Some(result),
      message: "".to_string(),
    }
  }

  pub fn err(message: String) -> Response<T> {
    Response {
      success: false,
      result: None,
      message,
    }
  }
}

fn inner_derive(mnemonic: &String) -> Result<(KeyPair, String), NoirError> {
  let derivation_path = "m/44'/60'/0'/0/0";
  let master = KeyPair::from_mnemonic(mnemonic)?;
  let derived = master.derive(derivation_path)?;
  let eth = eth::Address::from_public(&derived.public.as_bytes())?.to_string();
  Ok((derived, eth))
}

fn import_key(private_key: &String) -> Result<(KeyPair, String), NoirError> {
  let derivation_path = "m/44'/60'/0'/0/0";
  let master = KeyPair::from_private_key(private_key)?;
  let derived = master.derive(derivation_path)?;
  let eth = eth::Address::from_public(&derived.public.as_bytes())?.to_string();
  Ok((derived, eth))
}

#[tauri::command]
fn generate() -> String {
  Mnemonic::generate().0
}

#[tauri::command]
fn derive(mnemonic: String) -> Response<(KeyPair, String)> {
  match inner_derive(&mnemonic) {
    Ok(result) => Response::ok(result),
    Err(err) => Response::err(err.to_string())
  }
}

#[tauri::command]
fn import(private_key: String) -> Response<(KeyPair, String)> {
  match import_key(&private_key) {
    Ok(result) => Response::ok(result),
    Err(err) => Response::err(err.to_string())
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![generate, derive, import])
    .plugin(tauri_plugin_store::Builder::default().build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
