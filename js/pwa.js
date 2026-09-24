let deferredPrompt;

// --- 1. LÓGICA DE INSTALACIÓN PWA ---
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar banner de instalación si el usuario no lo descartó previamente
    if (!localStorage.getItem('pwa_install_dismissed')) {
        const installBanner = document.getElementById('pwa-install-banner');
        if (installBanner) installBanner.classList.remove('hidden');
    }
});

function installPWA() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('El usuario aceptó la instalación');
        }
        deferredPrompt = null;
        dismissPWAInstall();
    });
}

function dismissPWAInstall() {
    const installBanner = document.getElementById('pwa-install-banner');
    if (installBanner) installBanner.classList.add('hidden');
    localStorage.setItem('pwa_install_dismissed', 'true');
}

// --- 2. LÓGICA DE ACTUALIZACIÓN Y SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
            
            // Caso A: Si ya hay un worker esperando ser activado
            if (registration.waiting) {
                mostrarAvisoActualizacion(registration.waiting);
            }

            // Caso B: Si se encuentra un nuevo worker durante el uso
            registration.addEventListener('updatefound', () => {
                const nuevoWorker = registration.installing;
                
                nuevoWorker.addEventListener('statechange', () => {
                    if (nuevoWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        mostrarAvisoActualizacion(nuevoWorker);
                    }
                });
            });
        }).catch((error) => {
            console.error('Error al registrar el Service Worker:', error);
        });

        // Recargar automáticamente cuando el nuevo Service Worker asuma el control
        let reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!reloading) {
                window.location.reload();
                reloading = true;
            }
        });
    });
}

function mostrarAvisoActualizacion(worker) {
    const updateBanner = document.getElementById('pwa-update-banner');
    const updateBtn = document.getElementById('pwa-update-btn');

    if (updateBanner && updateBtn) {
        updateBanner.classList.remove('hidden');
        
        // Reinstanciar evento para evitar duplicados
        updateBtn.onclick = () => {
            worker.postMessage({ type: 'SKIP_WAITING' });
        };
    }
}