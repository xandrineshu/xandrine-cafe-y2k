document.addEventListener('DOMContentLoaded', () => {
    // 1. Set custom wand cursor globally
    const wandCursorSvg = "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewport=\"0 0 32 32\" style=\"font-size:24px;\"><text y=\"24\">🪄</text></svg>'), auto";
    document.body.style.cursor = wandCursorSvg;

    // Apply cursor to all clickable elements too
    const applyWandCursor = () => {
        document.querySelectorAll('a, button, input, textarea, .title-bar, .project-card, .entry-card').forEach(el => {
            el.style.cursor = wandCursorSvg;
        });
    };
    applyWandCursor();

    // Re-apply cursor on dynamic page switches (since router swaps inner HTML)
    const observer = new MutationObserver(applyWandCursor);
    observer.observe(document.body, { childList: true, subtree: true });

    // 2. Magical Sparkle Trail Logic
    const sparkleChars = ['⋆', '˙', '⟡', '⋆', '.', '˚', '⊹', '₊', '⟡', '⋆'];
    let lastTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Throttle to create a smooth, performant trail
        if (now - lastTime < 50) return;
        lastTime = now;

        const sparkle = document.createElement('div');
        sparkle.className = 'magic-sparkle';

        // Pick a random symbol from your desired trail pattern
        sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];

        // Random slight offset around the cursor
        const offsetX = (Math.random() - 0.5) * 20;
        const offsetY = (Math.random() - 0.5) * 20;

        sparkle.style.position = 'fixed';
        sparkle.style.left = (e.clientX + offsetX) + 'px';
        sparkle.style.top = (e.clientY + offsetY) + 'px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.fontSize = (Math.random() * 8 + 12) + 'px';
        sparkle.style.color = '#ffb6c1'; // Soft pastel pink sparkle color
        sparkle.style.textShadow = '0 0 4px #ff69b4';
        sparkle.style.zIndex = '999999';
        sparkle.style.transition = 'all 0.6s ease-out';
        sparkle.style.userSelect = 'none';

        document.body.appendChild(sparkle);

        // Animate float up and fade out
        setTimeout(() => {
            sparkle.style.transform = 'translateY(-25px) scale(1.2)';
            sparkle.style.opacity = '0';
        }, 20);

        // Remove element after animation finishes
        setTimeout(() => {
            sparkle.remove();
        }, 600);
    });
});