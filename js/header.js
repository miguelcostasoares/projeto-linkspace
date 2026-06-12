function initHeaderScroll() {
 
    const header = document.querySelector('.header');
    if (!header) return;
 
    const SCROLL_THRESHOLD = 40;
 
    function updateHeader() {
        if (window.scrollY > SCROLL_THRESHOLD) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
 
    /* Checa estado inicial (caso a página carregue já scrollada) */
    updateHeader();
 
    window.addEventListener('scroll', updateHeader, { passive: true });
 
}
 
/* Inicializa quando o DOM estiver pronto */
document.addEventListener('DOMContentLoaded', initHeaderScroll);