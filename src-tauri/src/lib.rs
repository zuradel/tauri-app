use std::process::Command;
use tauri::{App};
use sysinfo::{System, SystemExt, CpuExt};
use local_ip_address::local_ip;
use serde::Serialize;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Biendeptrai!", name)
}

#[derive(Serialize)]
struct SystemInfo {
    cpu_usage: f32,
    ram_total: u64,
    ram_used: u64,
    ram_usage_percent: f32,
    ip_address: String,
}

// Get system information
#[tauri::command]
fn get_system_info() -> SystemInfo {
    let mut sys = System::new_all();
    sys.refresh_all();
    
    // Calculate average CPU usage across all cores
    sys.refresh_cpu();
    let cpu_usage = sys.cpus().iter().map(|cpu| cpu.cpu_usage()).sum::<f32>() / sys.cpus().len() as f32;
    
    // Get RAM information
    let ram_total = sys.total_memory();
    let ram_used = sys.used_memory();
    let ram_usage_percent = (ram_used as f32 / ram_total as f32) * 100.0;
    
    // Get IP address
    let ip_address = match local_ip() {
        Ok(ip) => ip.to_string(),
        Err(_) => "Unknown".to_string(),
    };
    
    SystemInfo {
        cpu_usage,
        ram_total,
        ram_used, 
        ram_usage_percent,
        ip_address
    }
}

// Hàm khởi động server FastAPI
fn start_api_server() -> Result<(), String> {
    // Kiểm tra xem server đã chạy chưa bằng cách kiểm tra cổng 8008
    #[cfg(target_os = "windows")]
    let port_check_result = Command::new("cmd")
        .args(["/C", "netstat -ano | findstr :8008"])
        .output();
        
    #[cfg(not(target_os = "windows"))]
    let port_check_result = Command::new("sh")
        .args(["-c", "lsof -i:8008 || echo 'Port available'"])
        .output();
    
    let server_already_running = match port_check_result {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            !stdout.contains("Port available") && !stdout.is_empty()
        }
        Err(_) => false,
    };
    
    if server_already_running {
        println!("API server already running on port 8008");
        return Ok(());
    }
    
    // Đường dẫn tương đối đến server binary
    let server_path = "bin/api/main";
    
    println!("Starting API server...");
    
    // Khởi chạy server trong tiến trình riêng biệt
    match Command::new(server_path)
        .spawn() {
            Ok(_child) => {
                println!("API server started successfully");
                // Lưu ý: Không đợi tiến trình con kết thúc vì nó sẽ chạy liên tục
                Ok(())
            }
            Err(e) => Err(format!("Failed to start API server: {}", e)),
        }
}

pub fn init_api_server(_app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    // Khởi động API server
    if let Err(e) = start_api_server() {
        eprintln!("API server initialization failed: {}", e);
    } else {
        println!("API server initialization successful");
    }
    
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Tạo Tauri builder và thêm các plugin
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_python::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_system_info
        ]);

    // Thiết lập ứng dụng để khởi động server trước khi mở cửa sổ chính
    let app = builder
        .setup(|app| {
            // Khởi động API server ngay khi ứng dụng được thiết lập
            init_api_server(app)?;
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|_app_handle, event| match event {
        tauri::RunEvent::Ready => {
            println!("Tauri application is ready!");
        }
        tauri::RunEvent::WindowEvent { label, event, .. } => {
            match event {
                tauri::WindowEvent::CloseRequested { .. } => {
                    println!("Window '{}' close requested", label);
                }
                _ => {}
            }
        }
        _ => {}
    });
}
