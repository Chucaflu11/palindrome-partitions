// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{Instant, Duration};
use rand::Rng;
use std::io::{Write, BufWriter};
use serde::Serialize;
use tauri::{Manager, AppHandle};
use tokio::fs::File as AsyncFile;
use tokio::io::AsyncReadExt;

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
    mean_times: f64,
    mean_times_dp: f64,
    max_times: f64,
    max_times_dp: f64,
    min_times: f64,
    min_times_dp: f64,
}

impl Default for Data {
    fn default() -> Self {
        Data {
            lengths: Vec::new(),
            times: Vec::new(),
            times_dp: Vec::new(),
            log_lengths: Vec::new(),
            log_times: Vec::new(),
            log_times_dp: Vec::new(),
            slope_times: 0.0,
            slope_times_dp: 0.0,
            mean_times: 0.0,
            mean_times_dp: 0.0,
            max_times: 0.0,
            max_times_dp: 0.0,
            min_times: 0.0,
            min_times_dp: 0.0,
        }
    }
}

async fn handle(app_handle: AppHandle, lower_bound: usize, upper_bound: usize) -> Data {
    let app_handle_clone = app_handle.clone();
    let content = match read_file(app_handle_clone, "../public/random_content.txt", lower_bound, upper_bound).await {
        Ok(content) => content,
        Err(err) => {
            eprintln!("Error reading file: {}", err);
            return Data::default();
        }
    };

    let mut lengths = Vec::new();
    let mut times = Vec::new();
    let mut times_dp = Vec::new();

    for i in 0..content.len() {
        lengths.push(content[i].len() as f64);
        times.push(measure_time(&content[i]));
        times_dp.push(measure_time_dp(&content[i]));

        app_handle.emit_all("progress", i as f64 / (content.len() - 1) as f64).unwrap();
    }

    let log_lengths: Vec<f64> = lengths.iter().map(|&x| x.ln()).collect();
    let log_times: Vec<f64> = times.iter().map(|&y| y.ln()).collect();
    let log_times_dp: Vec<f64> = times_dp.iter().map(|&y| y.ln()).collect();

    let slope_times = calculate_slope(&log_lengths, &log_times);
    let slope_times_dp = calculate_slope(&log_lengths, &log_times_dp);

    let mean_times = calculate_mean(&times);
    let mean_times_dp = calculate_mean(&times_dp);

    let max_times = calculate_max(&times);
    let max_times_dp = calculate_max(&times_dp);

    let min_times = calculate_min(&times);
    let min_times_dp = calculate_min(&times_dp);

    let data = Data {
        lengths,
        times,
        times_dp,
        log_lengths,
        log_times,
        log_times_dp,
        slope_times,
        slope_times_dp,
        mean_times,
        mean_times_dp,
        max_times,
        max_times_dp,
        min_times,
        min_times_dp,
    };

    data
}

fn calculate_mean(data: &[f64]) -> f64 {
    let sum: f64 = data.iter().sum();
    let count = data.len() as f64;
    sum / count
}

fn calculate_max(data: &[f64]) -> f64 {
    *data.iter().max_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
}

fn calculate_min(data: &[f64]) -> f64 {
    *data.iter().min_by(|a, b| a.partial_cmp(b).unwrap()).unwrap()
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
    let start = Instant::now();
    min_palindrome_partitions(s);
    let duration: Duration = start.elapsed();
    duration.as_secs_f64()
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
    let n = s.len();
    let s_bytes = s.as_bytes();
    let mut c = vec![vec![0; n]; n];
    let mut p = vec![vec![false; n]; n];

    for i in 0..n {
        p[i][i] = true;
    }

    for l in 2..=n {
        for i in 0..=n - l {
            let j = i + l - 1;
            p[i][j] = if l == 2 {
                s_bytes[i] == s_bytes[j]
            } else {
                s_bytes[i] == s_bytes[j] && p[i + 1][j - 1]
            };

            c[i][j] = if p[i][j] {
                0
            } else {
                (i..j).fold(usize::MAX, |acc, k| acc.min(c[i][k] + c[k + 1][j] + 1))
            };
        }
    }

    c[0][n - 1]
}

// O(n^2)
fn min_palindrome_partitions_dp(s: &str) -> usize {
    let s_bytes = s.as_bytes();
    let n = s.len();
    let mut min_cut_dp = vec![usize::MAX; n];
    let mut p = vec![vec![false; n]; n];

    for i in 0..n {
        p[i][i] = true;
    }

    for l in 2..=n {
        for i in 0..n - l + 1 {
            let j = i + l - 1;
            p[i][j] = if l == 2 {
                s_bytes[i] == s_bytes[j]
            } else {
                s_bytes[i] == s_bytes[j] && p[i + 1][j - 1]
            };
        }
    }

    for i in 0..n {
        if p[0][i] {
            min_cut_dp[i] = 0;
        } else {
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

    for length in lower_bound..upper_bound {
        let s: String = (0..length).map(|_| rng.gen_range('a'..'z')).collect();
        content.push(s);
    }

    content
}

#[tauri::command]
async fn generate_file(handle: tauri::AppHandle, lower_bound: usize, upper_bound: usize) -> Result<(), String> {
    let content = generate_random_content(lower_bound, upper_bound);

    let resource_path = handle.path_resolver()
      .resolve_resource("../public/random_content.txt")
      .expect("failed to resolve resource");

    let file = std::fs::File::create(&resource_path).map_err(|e| e.to_string())?;
    let mut writer = BufWriter::new(file);

    for line in content {
        writeln!(writer, "{}", line).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
async fn read_file(handle: tauri::AppHandle, file_path: &str, lower_bound: usize, upper_bound: usize) -> Result<Vec<String>, String> {
    let resource_path = handle.path_resolver()
      .resolve_resource(file_path)
      .expect("failed to resolve resource");

    if !std::path::Path::new(&resource_path).exists() {
        generate_file(handle, lower_bound, upper_bound).await.map_err(|e| e.to_string())?;
    }

    let mut file = AsyncFile::open(&resource_path).await.map_err(|e| e.to_string())?;
    let mut content = String::new();
    file.read_to_string(&mut content).await.map_err(|e| e.to_string())?;
    let lines: Vec<String> = content.lines().map(|s| s.to_string()).collect();

    Ok(lines)
}

#[tauri::command]
async fn send_data(app_handle: AppHandle, lower_bound: usize, upper_bound: usize) -> Result<String, String> {

    let data = handle(app_handle, lower_bound, upper_bound).await;

    // struct Data to JSON
    serde_json::to_string(&data).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![generate_file, send_data, read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
