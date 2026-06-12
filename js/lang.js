/* =============================================
   IDIOMA — LINKSPACE
   lang.js — referenciado antes do </body>
   ============================================= */

function setLanguage(lang) {
    const flagMap = { pt: 'pt', es: 'es', en: 'gb' };
    const activeFlag = document.getElementById('lang-flag-active');
    if (activeFlag) {
        activeFlag.src = `https://flagcdn.com/${flagMap[lang]}.svg`;
        activeFlag.alt = lang.toUpperCase();
    }

    if (lang === 'pt') {
        // Volta ao original removendo o cookie do Google
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
        localStorage.setItem('lang', 'pt');
        location.reload();
        return;
    }

    // Define o cookie que o Google Translate usa nativamente
    document.cookie = `googtrans=/pt/${lang}; path=/`;
    document.cookie = `googtrans=/pt/${lang}; path=/; domain=${location.hostname}`;
    localStorage.setItem('lang', lang);
    location.reload();
}

function initLangSelector() {
    // Atualiza bandeira conforme idioma salvo
    const saved = localStorage.getItem('lang') || 'pt';
    const flagMap = { pt: 'pt', es: 'es', en: 'gb' };
    const activeFlag = document.getElementById('lang-flag-active');
    if (activeFlag && flagMap[saved]) {
        activeFlag.src = `https://flagcdn.com/${flagMap[saved]}.svg`;
    }

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
}

document.addEventListener('DOMContentLoaded', initLangSelector);