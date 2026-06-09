(function () {
    const cards=document.querySelectorAll('[data-reveal')
    const observer=new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting){
                const index = [...cards].indexOf(entry.target)
                setTimeout(() => {
                    entry.target.classList.add('revealed')
                }, index*120);
                observer.unobserve(entry.target)
            }
        });
    }, {threshold: 0.15});
    cards.forEach(card => observer.observe(card));
})();