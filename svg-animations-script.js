document.addEventListener('DOMContentLoaded', () => {
    const textElementToAnimate = document.getElementById('text-to-animate-auto');
    if (!textElementToAnimate) {
        // console.warn('Text element with ID "text-to-animate-auto" not found.');
        return;
    }

    const originalText = textElementToAnimate.textContent;
    if (!originalText || originalText.trim() === '') {
        // console.warn('Text element is empty.');
        return;
    }

    textElementToAnimate.textContent = ''; // Clear original text

    // Get base delay (staggerAmount) from the .demo-svg container of the text element
    let staggerAmount = 0.15; // Default fallback stagger amount in seconds
    const demoSvgContainer = textElementToAnimate.closest('.demo-svg');

    if (demoSvgContainer) {
        let baseDelayValueFromCSS = getComputedStyle(demoSvgContainer).getPropertyValue('--char-animation-base-delay');
        if (baseDelayValueFromCSS) {
            baseDelayValueFromCSS = baseDelayValueFromCSS.trim();
            let parsedValue = parseFloat(baseDelayValueFromCSS);

            if (!isNaN(parsedValue)) { // Check if parseFloat itself was successful
                if (baseDelayValueFromCSS.endsWith('ms')) {
                    staggerAmount = parsedValue / 1000;
                } else if (baseDelayValueFromCSS.endsWith('s')) {
                    staggerAmount = parsedValue;
                } else {
                    // If no unit, assume seconds if it's a number, otherwise keep fallback.
                    // This case is covered by !isNaN(parsedValue) already.
                    staggerAmount = parsedValue;
                }
            }
            // If parsedValue was NaN, staggerAmount remains its initialized fallback (0.15)
        }
    }
     // Ensure staggerAmount is a positive number after attempting to parse, otherwise reset to fallback.
    if (isNaN(staggerAmount) || staggerAmount <= 0) {
        staggerAmount = 0.15;
    }

    const chars = originalText.split('');
    let cumulativeTimeoutDelay = 0;

    chars.forEach((char, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.textContent = char;
        tspan.setAttribute('class', 'char-for-drawing');

        tspan.style.setProperty('--char-index', index.toString());

        setTimeout(() => {
            tspan.style.opacity = '1';
        }, cumulativeTimeoutDelay * 1000);

        textElementToAnimate.appendChild(tspan);

        cumulativeTimeoutDelay += staggerAmount;
    });
});
