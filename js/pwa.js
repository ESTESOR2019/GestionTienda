let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Mostrar banner minimalista de instalación
    const banner = document.getElementById('pwa-install-banner');
    if (banner && !localStorage.getItem('pwa_dismissed')) {
        banner.classList.remove('hidden');
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
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.classList.add('hidden');
    localStorage.setItem('pwa_dismissed', 'true');
}

// Registro del Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registrado exitosamente:', reg.scope))
            .catch(err => console.error('Fallo en registro de SW:', err));
    });
}