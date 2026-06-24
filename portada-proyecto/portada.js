// Coordenadas de Montevideo
const LAT = -34.9;
const LON = -56.2;
const CIUDAD = "Montevideo";

// URL de la API — gratuita, sin API key
const API_CLIMA = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`;

// Traduce el código numérico del clima a texto legible
function descripcionClima(code) {
  if (code === 0) return "☀️ Cielo despejado";
  if (code <= 2)  return "⛅ Parcialmente nublado";
  if (code === 3) return "☁️ Nublado";
  if (code >= 51 && code <= 67) return "Lluvia";
  if (code >= 71 && code <= 77) return "❄️ Nieve";
  if (code >= 80 && code <= 82) return "Lluvias intermitentes";
  if (code >= 95) return "⚡ Tormenta";
  return "Condición desconocida";
}

document.addEventListener("DOMContentLoaded", async () => {
  const elCiudad   = document.getElementById("clima-ciudad");
  const elTemp     = document.getElementById("clima-temp");
  const elCondicion = document.getElementById("clima-condicion");

  try {
    const respuesta = await fetch(API_CLIMA);  // hace el GET a la API
    const datos = await respuesta.json();       // convierte la respuesta a objeto JS

    const { temperature, windspeed, weathercode } = datos.current_weather; // desestructura los datos

    // Escribe los datos en el HTML
    elCiudad.textContent    = CIUDAD;
    elTemp.textContent      = `${temperature} °C`;
    elCondicion.textContent = descripcionClima(weathercode);

  } catch (error) {
    console.error("Error al obtener el clima:", error);
    elCiudad.textContent = "No se pudo cargar el clima."; // mensaje si no hay conexión
  }

  // Carga de artículos
  cargarArticulos();

  // Actualiza automáticamente cada 3 segundos
  setInterval(cargarArticulos, 3000);
});

const API_URL = "http://localhost:3000";

async function cargarArticulos() {
  try {

    const respuesta = await fetch(`${API_URL}/articulos`);
    const articulos = await respuesta.json();

    // Los más nuevos primero
    articulos.reverse();

    const contenedor = document.getElementById("lista-articulos");

    // Limpia el contenedor antes de volver a dibujar
    contenedor.innerHTML = "";

    articulos.forEach((articulo, index) => {

      const tarjeta = document.createElement("div");

      tarjeta.classList.add("tarjeta-articulo");

      // Saca etiquetas HTML del contenido y lo acorta
      const descripcionLimpia =
        articulo.descripcion1
          ? articulo.descripcion1
              .replace(/<[^>]*>/g, "")
              .substring(0, 150)
          : "";

      tarjeta.innerHTML = `
        <a class="enlace-articulo"
           href="../articulo-proyecto/articulo.html?id=${articulo.id}">

          <span class="numero-articulo">
            ${String(index + 1).padStart(2, "0")}
          </span>

          <div class="categoria-articulo">
            ${articulo.categoria || ""}
          </div>

          <h3 class="titulo-articulo">
            ${articulo.titulo || ""}
            <br>
            <em>${articulo.subtitulo || ""}</em>
          </h3>

          <div class="regla-articulo"></div>

          <p class="descripcion-articulo">
            ${descripcionLimpia}...
          </p>

        </a>
      `;

      contenedor.appendChild(tarjeta);

    });

  } catch (error) {
    console.error("Error al cargar artículos:", error);
  }
}