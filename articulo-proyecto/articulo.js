const API_URL = "http://localhost:3000"; // Dirección del servidor

document.addEventListener("DOMContentLoaded", async () => { // Espera a que el HTML cargue — async para usar await

  const btnVolver = document.getElementById("btnVolver");

btnVolver.addEventListener("click", () => {
  window.location.href = "http://127.0.0.1:5500/portada-proyecto/portada.html";
});


  // 1. Agarra el id de la URL — ejemplo: articulo.html?id=5
  const params = new URLSearchParams(window.location.search); // Lee los parámetros de la URL
  const id = params.get('id');                                 // Agarra el valor del parámetro "id"

  if (!id) {
    console.error('No se encontró el id del artículo en la URL');
    return;
  }

  try {

    // 2. Pide el artículo al servidor usando el id
    const respuesta = await fetch(`${API_URL}/articulos/${id}`);
    const articulo = await respuesta.json();

    if (!respuesta.ok) {
      console.error('Artículo no encontrado');
      return;
    }

    // 3. Muestra los datos de texto en el HTML
    document.getElementById('articulo-titulo').textContent    = articulo.titulo;
    document.getElementById('articulo-subtitulo').textContent = articulo.subtitulo || '';
    document.getElementById('articulo-autor').textContent     = articulo.autor;
    document.getElementById('articulo-categoria').textContent = articulo.categoria;
    document.getElementById('articulo-fecha').textContent     = articulo.fecha || '';

    // Muestra la primera letra del autor en el avatar en vez de la M hardcodeada
    document.querySelector('.avatar-autor').textContent = articulo.autor
      ? articulo.autor.charAt(0).toUpperCase()
      : '?';

    // 4. Muestra el contenido HTML de los dos editores
    document.getElementById('contenido1').innerHTML = articulo.descripcion1 || '';
    document.getElementById('contenido2').innerHTML = articulo.descripcion2 || '';

    // 5. Muestra la imagen destacada si existe
    // Se reemplaza solo el placeholder interno para no perder el <figcaption>
    if (articulo.portada) {
  const placeholder = document.querySelector('.marcador-imagen-principal');
  placeholder.innerHTML = '';
  placeholder.style.padding = '0';
  placeholder.style.background = 'none';

  const img = document.createElement('img');
  img.src = articulo.portada.startsWith('data:')
    ? articulo.portada
    : API_URL + articulo.portada;
  img.alt = 'Imagen destacada';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';
  img.style.display = 'block';
  placeholder.appendChild(img);
}

    // 6. Muestra la galería si hay imágenes
    if (articulo.galeria && articulo.galeria.length > 0) {
  const thumbs = document.querySelectorAll('.seccion-galeria .miniatura-galeria');

  articulo.galeria.forEach((imagen, i) => {
    if (thumbs[i] && imagen) {
      const src = imagen.startsWith('data:') ? imagen : API_URL + imagen;
      thumbs[i].innerHTML = `<img src="${src}" alt="Imagen galería ${i + 1}" style="width:100%; height:100%; object-fit:cover; display:block;">`;
    }
  });
}

  } catch (error) {
    console.error('Error de red:', error);
  }
// ── HEADER QUE SE OCULTA AL HACER SCROLL ──────────────────

const topbar = document.querySelector('.barra-superior');
let scrollAnterior = 0; // guarda la posición del scroll anterior para comparar

window.addEventListener('scroll', function() {
  const scrollActual = window.scrollY; // posición actual del scroll

  if (scrollActual > scrollAnterior && scrollActual > 80) {
    // el usuario bajó más de 80px — oculta el header
    topbar.style.transform = 'translateY(-100%)';
  } else {
    // el usuario subió — muestra el header
    topbar.style.transform = 'translateY(0)';
  }

  scrollAnterior = scrollActual; // actualiza la posición anterior
});
});