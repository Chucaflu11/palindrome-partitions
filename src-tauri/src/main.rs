// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::time::{Instant, Duration};
use rand::Rng;
use std::io::Write;
use std::error::Error;
use serde::{Serialize, Deserialize};
use tauri::async_runtime;


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

async fn handle() -> Data {
    writeln!(std::io::stdout(), "Generating data...").unwrap();
    /*
    WARNING: The bounds of the strings works very different on both algorithms.
    between 100 and 300 works fine for the first algoithm, increasing them could cause long execution times.
    The second algorithm between 100 and 300 works too fast, the data gathered is not enough to see the actual results.
    Between 1000 and 3000 works fine for the second algorithm with not so long execution time, and enough data to see the results.
    */
    let lower_bound: usize = 100;
    let upper_bound: usize = 300;
    let content = generate_random_content(lower_bound, upper_bound);

    let mut lengths = Vec::new();
    let mut times = Vec::new();
    let mut times_dp = Vec::new();

    for i in 0..(content.len()) {
        lengths.push(content[i].len() as f64);
        times.push(measure_time(&content[i]));
        times_dp.push(measure_time_dp(&content[i]));
    }

    let log_lengths: Vec<f64> = lengths.iter().map(|&x| x as f64).map(|x| x.ln()).collect();
    let log_times: Vec<f64> = times.iter().map(|&y| y.ln()).collect();
    let log_times_dp: Vec<f64> = times_dp.iter().map(|&y| y.ln()).collect();

    let slope_times = calculate_slope(&log_lengths, &log_times);
    let slope_times_dp = calculate_slope(&log_lengths, &log_times_dp);

    let data = Data {
        lengths: lengths,
        times: times,
        times_dp: times_dp,
        log_lengths: log_lengths,
        log_times: log_times,
        log_times_dp: log_times_dp,
        slope_times: slope_times,
        slope_times_dp: slope_times_dp,
    };

    println!("Finished");
    data
}

fn calculate_slope(x: &Vec<f64>, y: &Vec<f64>) -> f64 {
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

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn send_data() -> Result<String, String> {
    let data = handle().await; // Obtén los datos de la función handle

    // Serializa la struct Data a JSON
    match serde_json::to_string(&data) {
        Ok(json) => {
            println!("Serialization successful");
            Ok(json) // Retorna el JSON como String si la serialización es exitosa
        },
        Err(err) => {
            println!("Serialization error");
            Err(err.to_string()) // Retorna el error como String en caso de fallo
        }
    }
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
