const API_URL = "http://localhost:3000"; // Guarda la dirección del servidor — si cambia, se actualiza en un solo lugar

document.addEventListener("DOMContentLoaded", () => { // Espera a que todo el HTML esté cargado antes de ejecutar el JS

   const btnBack = document.getElementById("btnback");

  btnBack.addEventListener("click", () => {
  window.location.href = "../portada-proyecto/portada.html";
});

  // ── IMAGEN DESTACADA ──────────────────────────────────────

  const btnPortada = document.getElementById('btnPortada');         // Agarra el botón "Subir imagen" del HTML
  const inputPortada = document.getElementById('inputPortada');     // Agarra el input file oculto
  const imgPortada = document.getElementById('imgPortada');         // Agarra la etiqueta img donde se muestra la preview
  const previewPortada = document.getElementById('previewPortada'); // Agarra el contenedor del preview

  btnPortada.addEventListener('click', function() { // Escucha el clic en el botón
    inputPortada.click(); // Simula un clic en el input oculto, abriendo el explorador de archivos
  });

  inputPortada.addEventListener('change', function() { // Se dispara cuando el usuario elige un archivo
    const archivo = inputPortada.files[0]; // Agarra el primer archivo de la lista

    if (archivo) {
      const reader = new FileReader(); // FileReader convierte el archivo a Base64

      reader.onload = function(e) {
        const base64 = e.target.result;          // La imagen convertida a texto Base64
        imgPortada.src = base64;                 // La muestra en el preview
        imgPortada.hidden = false;               // Muestra la imagen que estaba oculta
        imgPortada.dataset.base64 = base64;      // Guarda el Base64 en el elemento para leerlo al publicar
        previewPortada.querySelector('.preview-placeholder').hidden = true; // Oculta el texto "Img Destacada"

        const btnBorrar = document.createElement('button'); // Crea el botón X
        btnBorrar.textContent = '✕';
        btnBorrar.type = 'button';
        btnBorrar.id = 'btnBorrarPortada';
        previewPortada.appendChild(btnBorrar);

        btnBorrar.addEventListener('click', function() {
          imgPortada.src = '';
          imgPortada.hidden = true;
          imgPortada.dataset.base64 = '';        // Limpia el Base64 guardado
          previewPortada.querySelector('.preview-placeholder').hidden = false;
          inputPortada.value = '';
          btnBorrar.remove();
        });
      };

      reader.readAsDataURL(archivo); // Dispara la conversión a Base64
    }
  });

  // ── GALERÍA ───────────────────────────────────────────────

  const btnGaleria = document.getElementById('btnGaleria');     // Agarra el botón "Agrega imgs +"
  const inputGaleria = document.getElementById('inputGaleria'); // Agarra el input file oculto de la galería
  const galleryGrid = document.getElementById('galleryGrid');   // Agarra el contenedor de los thumbs
  const galeriaBase64 = [];                                     // Array para guardar las 4 imágenes en Base64

  btnGaleria.addEventListener('click', function() {
    inputGaleria.click();
  });

  inputGaleria.addEventListener('change', function() {
    const archivos = inputGaleria.files;

    if (archivos.length > 4) {
      alert('Solo se permiten máximo 4 imágenes.');
    }

    const thumbs = galleryGrid.querySelectorAll('.gallery-thumb');

    for (let i = 0; i < 4; i++) {
      const thumb = thumbs[i];
      thumb.innerHTML = '';
      thumb.style.position = 'relative';
      galeriaBase64[i] = ''; // Limpia la posición en el array

      if (archivos[i]) {
        const reader = new FileReader(); // Un FileReader por cada imagen
        const indice = i;               // Guarda el índice para usarlo adentro del onload

        reader.onload = function(e) {
          galeriaBase64[indice] = e.target.result; // Guarda el Base64 en el array en la posición correcta

          const img = document.createElement('img');
          img.src = e.target.result;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';

          const btnBorrarThumb = document.createElement('button');
          btnBorrarThumb.textContent = '✕';
          btnBorrarThumb.type = 'button';
          btnBorrarThumb.id = 'btnBorrarPortada';

          btnBorrarThumb.addEventListener('click', function() {
            galeriaBase64[indice] = '';  // Limpia el Base64 de esa posición
            thumb.innerHTML = '<span>img' + (indice + 1) + '</span>';
          });

          thumb.appendChild(img);
          thumb.appendChild(btnBorrarThumb);
        };

        reader.readAsDataURL(archivos[i]); // Convierte cada imagen a Base64

      } else {
        thumb.innerHTML = '<span>img' + (i + 1) + '</span>';
      }
    }
  });

  // ── PUBLICAR ARTÍCULO ─────────────────────────────────────

  const btnPublicar = document.querySelector('.btn-publish');

  btnPublicar.addEventListener('click', async function() {

    const titulo     = document.getElementById('titulo').value.trim();
    const subtitulo  = document.getElementById('subtitulo').value.trim();
    const autor      = document.getElementById('autor').value.trim();
    const categoria  = document.getElementById('categoria').value.trim();
    const fecha      = document.getElementById('fecha').value;

    const descripcion1 = quill1.root.innerHTML.trim(); // HTML del primer editor
    const descripcion2 = quill2.root.innerHTML.trim(); // HTML del segundo editor
    const textoPlano   = quill1.getText().trim() + quill2.getText().trim(); // Texto puro para validar

    const portada  = imgPortada.dataset.base64 || '';  // Base64 de la imagen destacada
    const galeria  = galeriaBase64.filter(img => img !== ''); // Array con solo las imágenes cargadas

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