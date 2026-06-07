function initLocationPlaceholder() {

    const texts = [
        'Digite ruas...',
        'Digite bairros...',
        'Digite cidades...',
        'Digite condomínios...'
    ];

    const placeholder = document.querySelector('.location-placeholder');
    const input = document.querySelector('.location-input');

    if (!placeholder || !input) return;

    let textIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {

        if (document.activeElement === input || input.value !== '') {
            placeholder.style.display = 'none';
            requestAnimationFrame(type);
            return;
        }

        placeholder.style.display = 'block';

        const currentText = texts[textIndex];

        if (!deleting) {

            placeholder.textContent =
                currentText.substring(0, charIndex + 1);

            charIndex++;

            if (charIndex === currentText.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }

        } else {

            placeholder.textContent =
                currentText.substring(0, charIndex - 1);

            charIndex--;

            if (charIndex === 0) {
                deleting = false;
                textIndex = (textIndex + 1) % texts.length;
            }
        }

        setTimeout(type, deleting ? 40 : 80);
    }

    type();
}
