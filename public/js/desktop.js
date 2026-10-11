document.addEventListener('DOMContentLoaded', () => {
    const dockButtons = document.querySelectorAll('.dock-btn');
    const closeButtons = document.querySelectorAll('.close-btn');

    // 1. Open / Toggle windows from the top-right dock
    dockButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        btn.addEventListener('click', () => {
            // Toggle visibility
            if (windowEl.style.display === 'none' || windowEl.style.display === '') {
                windowEl.style.display = 'block';
            } else {
                windowEl.style.display = 'none';
            }
        });
    });

    // 2. Close windows when clicking the "X" button
    closeButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        btn.addEventListener('click', () => {
            windowEl.style.display = 'none';
        });
    });
});