document.addEventListener('DOMContentLoaded', () => {
    const textElementToAnimate = document.getElementById('text-to-animate-auto');
    if (!textElementToAnimate) { return; }
    const originalText = textElementToAnimate.textContent;
    if (!originalText || originalText.trim() === '') { return; }
    textElementToAnimate.textContent = '';
    const chars = originalText.split('');
    let staggerAmount = 0.3;
    const demoSvgContainer = textElementToAnimate.closest('.demo-svg');
    if (demoSvgContainer) {
        let baseDelayValueFromCSS = getComputedStyle(demoSvgContainer).getPropertyValue('--char-animation-base-delay').trim();
        if (baseDelayValueFromCSS) {
            if (baseDelayValueFromCSS.endsWith('ms')) {
                staggerAmount = parseFloat(baseDelayValueFromCSS) / 1000;
            } else if (baseDelayValueFromCSS.endsWith('s')) {
                staggerAmount = parseFloat(baseDelayValueFromCSS);
            }
            if (isNaN(staggerAmount) || staggerAmount <= 0 ) { staggerAmount = 0.3; }
        }
    }
    let cumulativeTimeoutDelay = 0;
    chars.forEach((char, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = char;
        tspan.setAttribute('class', 'char-for-drawing');
        tspan.style.setProperty('--char-index', index.toString());
        setTimeout(() => { tspan.style.opacity = '1'; }, cumulativeTimeoutDelay * 1000);
        textElementToAnimate.appendChild(tspan);
        cumulativeTimeoutDelay += staggerAmount;
    });
});
