// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{Instant, Duration};
use rand::Rng;
use std::io::{Write, BufWriter};
use std::fs::File;
use serde::Serialize;
use tauri::{Manager, AppHandle, Runtime};
use tokio::fs::File as AsyncFile;
use tokio::io::{AsyncWriteExt, AsyncReadExt};

#[derive(Serialize)]
struct Data {
    lengths: Vec<f64>,
    times: Vec<f64>,
    times_dp: Vec<f64>,
    log_lengths: Vec<f64>,
    log_times: Vec<f64>,
    log_times_dp: Vec<f64>,
    slope_times: f64,
    slope_times_dp: f64,
}

async fn handle<R: Runtime>(app_handle: AppHandle<R>, lower_bound: usize, upper_bound: usize) -> Data {
    println!("Generating data...");
    let content = read_or_generate_random_content(lower_bound, upper_bound).await;

    let mut lengths = Vec::new();
    let mut times = Vec::new();
    let mut times_dp = Vec::new();

    for i in 0..(content.len()) {
        lengths.push(content[i].len() as f64);
        times.push(measure_time(&content[i]));
        times_dp.push(measure_time_dp(&content[i]));

        app_handle.emit_all("progress", i as f64 / content.len() as f64).unwrap();
    }

    let log_lengths: Vec<f64> = lengths.iter().map(|&x| x.ln()).collect();
    let log_times: Vec<f64> = times.iter().map(|&y| y.ln()).collect();
    let log_times_dp: Vec<f64> = times_dp.iter().map(|&y| y.ln()).collect();

    let slope_times = calculate_slope(&log_lengths, &log_times);
    let slope_times_dp = calculate_slope(&log_lengths, &log_times_dp);

    let data = Data {
        lengths,
        times,
        times_dp,
        log_lengths,
        log_times,
        log_times_dp,
        slope_times,
        slope_times_dp,
    };

    println!("Finished");
    data
}

fn calculate_slope(x: &[f64], y: &[f64]) -> f64 {
    let n = x.len() as f64;

    let sum_x: f64 = x.iter().sum();
    let sum_y: f64 = y.iter().sum();
    let sum_x2: f64 = x.iter().map(|&xi| xi * xi).sum();
    let sum_xy: f64 = x.iter().zip(y.iter()).map(|(&xi, &yi)| xi * yi).sum();

    (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x.powi(2))
}

fn measure_time(s: &str) -> f64 {
    let start = Instant::now(); // Record the starting time
    min_palindrome_partitions(s); // Call the function to measure
    let duration: Duration = start.elapsed(); // Calculate elapsed time
    duration.as_secs_f64() // Return time in seconds as f64
}

fn measure_time_dp(s: &str) -> f64 {
    let start = Instant::now();
    min_palindrome_partitions_dp(s);
    let duration: Duration = start.elapsed();
    duration.as_secs_f64()
}

// Algoritmos

// O(n^3)
fn min_palindrome_partitions(s: &str) -> usize {
    let s: Vec<char> = s.chars().collect();
    let n = s.len();
    let mut c = vec![vec![0; n]; n];
    let mut p = vec![vec![false; n]; n];

    for i in 0..n {
        p[i][i] = true;
    }

    for l in 2..=n {
        for i in 0..n - l + 1 {
            let j = i + l - 1;
            if l == 2 {
                p[i][j] = s[i] == s[j];
            } else {
                p[i][j] = s[i] == s[j] && p[i + 1][j - 1];
            }

            if p[i][j] {
                c[i][j] = 0;
            } else {
                c[i][j] = usize::MAX;
                for k in i..j {
                    if c[i][j] > c[i][k] + c[k + 1][j] + 1 {
                        c[i][j] = c[i][k] + c[k + 1][j] + 1;
                    }
                }
            }
        }
    }

    c[0][n - 1]
}

// O(n^2)
fn min_palindrome_partitions_dp(s: &str) -> usize {
    let s: Vec<char> = s.chars().collect();
    let n = s.len();
    let mut min_cut_dp = vec![0; n];
    let mut p = vec![vec![false; n]; n];

    for i in 0..n {
        p[i][i] = true;
    }

    for l in 2..=n {
        for i in 0..n - l + 1 {
            let j = i + l - 1;
            if l == 2 {
                p[i][j] = s[i] == s[j];
            } else {
                p[i][j] = s[i] == s[j] && p[i + 1][j - 1];
            }
        }
    }

    for i in 0..n {
        if p[0][i] {
            min_cut_dp[i] = 0;
        } else {
            min_cut_dp[i] = usize::MAX;
            for j in 0..i {
                if p[j + 1][i] && 1 + min_cut_dp[j] < min_cut_dp[i] {
                    min_cut_dp[i] = 1 + min_cut_dp[j];
                }
            }
        }
    }

    min_cut_dp[n - 1]
}

fn generate_random_content(lower_bound: usize, upper_bound: usize) -> Vec<String> {
    let mut rng = rand::thread_rng();
    let mut content = Vec::new();

    // Generar y escribir cadenas aleatorias en el contenido
    for length in lower_bound..upper_bound {
        let s: String = (0..length).map(|_| rng.gen_range('a'..'z')).collect();
        content.push(s);
    }

    // Retornar el contenido como una cadena de texto
    content
}

async fn read_or_generate_random_content(lower_bound: usize, upper_bound: usize) -> Vec<String> {
    let file_path = "random_content.txt";

    // Intentar leer el archivo existente
    match read_file(file_path).await {
        Ok(content) => content,
        Err(_) => {
            // Si el archivo no existe, generar nuevo contenido aleatorio y guardarlo
            let content = generate_random_content(lower_bound, upper_bound);
            if let Err(e) = write_file(file_path, &content.join("\n")).await {
                eprintln!("Error writing file: {}", e);
            }
            content
        }
    }
}

async fn write_file(file_path: &str, content: &str) -> Result<(), String> {
    let mut file = AsyncFile::create(file_path).await.map_err(|e| e.to_string())?;
    file.write_all(content.as_bytes()).await.map_err(|e| e.to_string())?;
    Ok(())
}

async fn read_file(file_path: &str) -> Result<Vec<String>, String> {
    let mut file = AsyncFile::open(file_path).await.map_err(|e| e.to_string())?;
    let mut content = String::new();
    file.read_to_string(&mut content).await.map_err(|e| e.to_string())?;
    let lines: Vec<String> = content.lines().map(|s| s.to_string()).collect();
    Ok(lines)
}

#[tauri::command]
fn generate_file(lower_bound: usize, upper_bound: usize) -> Result<(), String> {
    let content = generate_random_content(lower_bound, upper_bound);

    let file_path = "random_content.txt";
    let file = std::fs::File::create(file_path).map_err(|e| e.to_string())?;
    let mut writer = BufWriter::new(file);

    for line in content {
        writeln!(writer, "{}", line).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
async fn send_data<R: Runtime>(app_handle: AppHandle<R>, lower_bound: String, upper_bound: String) -> Result<String, String> {
    // Convertir los parámetros a usize
    let lower_bound = lower_bound.parse::<usize>().map_err(|e| e.to_string())?;
    let upper_bound = upper_bound.parse::<usize>().map_err(|e| e.to_string())?;

    let data = handle(app_handle, lower_bound, upper_bound).await; // Obtén los datos de la función handle

    // Serializa la struct Data a JSON
    serde_json::to_string(&data).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
