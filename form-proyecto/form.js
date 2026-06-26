const API_URL = "http://localhost:3000"; // Guarda la dirección del servidor — si cambia, se actualiza en un solo lugar

document.addEventListener("DOMContentLoaded", () => { // Espera a que todo el HTML esté cargado antes de ejecutar el JS

   const btnBack = document.getElementById("btnVolver");

  btnBack.addEventListener("click", () => {
  window.location.href = "../portada-proyecto/portada.html";
});

  // ── IMAGEN DESTACADA ──────────────────────────────────────

  const inputPortada = document.getElementById('inputPortada');     // Input de texto/url para la imagen destacada
  const imgPortada = document.getElementById('imgPortada');         // Etiqueta img donde se muestra la preview
  const previewPortada = document.getElementById('previewPortada'); // Contenedor del preview

  inputPortada.addEventListener('input', function() { // Se dispara cada vez que el usuario tipea o pega algo
    const url = inputPortada.value.trim();

    if (url) {
      imgPortada.src = url;                 // Intenta mostrar la imagen desde la URL
      imgPortada.hidden = false;
      previewPortada.querySelector('.marcador-vista-previa').hidden = true;
    } else {
      imgPortada.src = '';
      imgPortada.hidden = true;
      previewPortada.querySelector('.marcador-vista-previa').hidden = false;
    }
  });

  imgPortada.addEventListener('error', function() { // Si la URL no carga una imagen válida
    imgPortada.hidden = true;
    previewPortada.querySelector('.marcador-vista-previa').hidden = false;
  });

  // ── GALERÍA ───────────────────────────────────────────────

  const inputsGaleria = document.querySelectorAll('.input-galeria-url'); // Los 4 inputs de URL de la galería

  inputsGaleria.forEach(function(input) {
    input.addEventListener('input', function() {
      const url = input.value.trim();
      const columna = input.closest('.columna-galeria');       // La columna donde vive este input
      const thumb = columna.querySelector('.miniatura-galeria'); // Su miniatura correspondiente

      thumb.innerHTML = ''; // Limpia el contenido anterior del thumb

      if (url) {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';

        img.addEventListener('error', function() { // Si la URL no es una imagen válida
          const indice = Array.from(inputsGaleria).indexOf(input) + 1;
          thumb.innerHTML = '<span>img' + indice + '</span>';
        });

        thumb.appendChild(img);
        thumb.classList.add('relleno');
      } else {
        const indice = Array.from(inputsGaleria).indexOf(input) + 1;
        thumb.innerHTML = '<span>img' + indice + '</span>';
        thumb.classList.remove('relleno');
      }
    });
  });

  // ── PUBLICAR ARTÍCULO ─────────────────────────────────────

  const btnPublicar = document.querySelector('.boton-publicar');

  btnPublicar.addEventListener('click', async function() {

    const titulo     = document.getElementById('titulo').value.trim();
    const subtitulo  = document.getElementById('subtitulo').value.trim();
    const autor      = document.getElementById('autor').value.trim();
    const categoria  = document.getElementById('categoria').value.trim();
    const fecha      = document.getElementById('fecha').value;

    const descripcion1 = quill1.root.innerHTML.trim(); // HTML del primer editor
    const descripcion2 = quill2.root.innerHTML.trim(); // HTML del segundo editor
    const textoPlano   = quill1.getText().trim() + quill2.getText().trim(); // Texto puro para validar

    const portada = inputPortada.value.trim(); // URL de la imagen destacada
    const galeria = Array.from(inputsGaleria)
      .map(input => input.value.trim())
      .filter(url => url !== ''); // Array con solo las URLs completadas

    if (!titulo || !autor || !textoPlano) {
      alert('Completá los campos obligatorios: título, autor y contenido.');
      return;
    }

    const datos = { titulo, subtitulo, autor, categoria, fecha, descripcion1, descripcion2, portada, galeria };

    try {
      const respuesta = await fetch(`${API_URL}/articulos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });

      const articulo = await respuesta.json(); 

      if (respuesta.ok) {
        window.location.href = '../articulo-proyecto/articulo.html?id=' + articulo.id;
      } else {
        alert(articulo.error || 'Error al publicar el artículo.');
      }

    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor.');
    }

  });

}); // Cierra el DOMContentLoaded