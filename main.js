if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    
    // 1. Si ya hay una actualización lista de una sesión anterior
    if (registration.waiting) {
      mostrarBannerActualizacion(registration.waiting);
    }

    // 2. Si se detecta una nueva actualización mientras el usuario navega
    registration.addEventListener('updatefound', () => {
      const nuevoWorker = registration.installing;
      
      nuevoWorker.addEventListener('statechange', () => {
        // Cuando termine de instalarse y quede esperando la orden del usuario
        if (nuevoWorker.state === 'installed' && navigator.serviceWorker.controller) {
          mostrarBannerActualizacion(nuevoWorker);
        }
      });
    });
  });

  // 3. Recargar la página automáticamente cuando el nuevo Service Worker tome el control
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!reloading) {
      window.location.reload();
      reloading = true;
    }
  });
}

function mostrarBannerActualizacion(worker) {
  // Aquí tu UI (un toast, banner o modal)
  const boton = document.getElementById('btn-actualizar');
  document.getElementById('banner-actualizacion').style.display = 'block';

  boton.addEventListener('click', () => {
    // Le enviamos un mensaje al Service Worker para que se active inmediatamente
    worker.postMessage({ type: 'SKIP_WAITING' });
  });
}