
# Comparación de algoritmos para particionamiento de palíndromos

Este proyecto implementa y compara dos algoritmos para resolver el problema de particionamiento de palíndromos:

- Algoritmo cúbico: Basado en programación dinámica (O(n³))
- Algoritmo cuadrático: Optimización del algoritmo cúbico (O(n²))

## Características

- **Interfaz gráfica**: La aplicación cuenta con una interfaz gráfica de usuario (GUI) intuitiva desarrollada con React y Plotly.js para visualizar los resultados de los algoritmos.
- **Rendimiento**: El backend, implementado en Rust, garantiza un procesamiento eficiente de cadenas de texto, incluso de gran tamaño.
- **Análisis comparativo**: El proyecto incluye un análisis detallado del rendimiento de ambos algoritmos, con gráficos, tablas y métricas relevantes.

## Instalación

### Requisitos previos

Para instalar y ejecutar este proyecto, se requieren los siguientes requisitos previos:

- [Node.js](https://nodejs.org/): Para instalar Node.js, puedes visitar el sitio web oficial de Node.js y descargar la última versión de la distribución.
- [Rust](https://www.rust-lang.org/): Para instalar Rust, puedes visitar el sitio web oficial de Rust y descargar la última versión de la distribución.
- [npm](https://www.npmjs.com/): Para instalar npm, puedes visitar el sitio web oficial de npm y descargar la última versión de la distribución.

### Instalación

1. Descargar o clonar el repositorio de GitHub.

```bash
  git clone https://github.com/Chucaflu11/palindrome-partitions
```	

3. Instalar las dependencias del proyecto, desde la carpeta raíz del proyecto:

```bash
  npm install
  cd src-tauri
  cargo build
  cd ..
```

4. Para ejecutar el entorno de desarrollo, desde la carpeta raíz del proyecto:

```bash
  npm run tauri dev
```
En el entorno de desarrollo se ejecutará la aplicación de forma normal, pero el rendimiento puede verse reducido debido a que se está ejecutando en modo desarrollo.

5. Para ejecutar la aplicación, desde la carpeta raíz del proyecto:

```bash
  npm run tauri build
```
Esto creará un archivo `palindromes_1.0.0_x64-setup.exe` en la carpeta `\src-tauri\target\release\bundle\nsis`.
Este archivo corresponde al instalador. Para ejecutar la aplicación, se debe ejecutar este archivo, y seguir las instrucciones que aparecen en la pantalla.
    
## Modo de Uso

![Ejemplo](public\Ejemplo_ejecucion.png)

La foto anterior muestra un ejemplo de uso de la aplicación. En este caso, la aplicación ya se ha ejecutado una vez y se pueden ver los resultados en la parte derecha de la ventana, estos gráficos son interaccionables y permiten navegar por los datos.
En la parte izquierda se pueden ver:
- **Cuadros de entrada**: Los cuadros de entrada de texto con el límite inferior y superior, estos límites se utilizan para generar el archivo de texto que utilizará el programa como entrada. Por defecto estos valores son `500 y 800`, pero se pueden cambiar en la parte superior de la ventana (**_Es preferible mantener los límites entre los valores por defecto para evitar problemas de rendimiento y esperas muy largas, si se ejecuta como entorno de desarrollo, se recomienda mantener los límites en `100 y 300`_**).
- **Botones de carga y generación**: Los botones permiten cargar y generar el archivo de texto utilizado como entrada. El archivo se muestra también en ese cuadro de texto bajo los botones, y es posible copiar el contenido del archivo de texto al portapapeles con el botón respectivo.
El archivo de texto se guarda en el directorio `public` del proyecto, y se puede acceder desde cualquier lugar con el archivo abierto.
Este archivo genera una cantidad de cadenas que va desde el límite inferior hasta el límite superior, sumándole 1 a la cadena anterior, esto quiere decir que si mi límite inferior es 100, mi primera cadena tendrá tamaño de 100, la segunda tendrá tamaño de 101, y así sucesivamente hasta el límite superior.
El botón de `Cargar Datos` es el botón con el que se comenzarán a ejecutar ambos algoritmos.
- **Información de rendimiento**: En esta parte se muestran los resultados de los algoritmos, con todos los tiempos medidos en segundos.

## Información adicional

Desde el entorno de desarrollo el archivo de texto generado se almacena en `src-tauri\target\debug\_up_\public\random_content.txt`.
En el caso de ejecutar la aplicación en modo de producción, el archivo de texto generado se almacena en `_up_\public\random_content.txt`.

## Authors

- [@Chucaflu11](https://github.com/Chucaflu11)

