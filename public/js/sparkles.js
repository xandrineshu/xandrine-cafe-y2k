// Y2K Sparkle Trail Effect
document.addEventListener('mousemove', function (e) {
    if (Math.random() > 0.3) return; // Control frequency of sparkles

    const sparkle = document.createElement('div');
    sparkle.innerHTML = '⊹';
    sparkle.style.position = 'fixed';
    sparkle.style.left = e.clientX + 'px';
    sparkle.style.top = e.clientY + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '12px';
    sparkle.style.zIndex = '9999';
    sparkle.style.transition = 'all 0.6s ease-out';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.style.transform = 'translateY(-20px) scale(0.5)';
        sparkle.style.opacity = '0';
    }, 20);

    setTimeout(() => {
        sparkle.remove();
    }, 600);
});