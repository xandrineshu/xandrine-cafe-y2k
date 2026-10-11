document.addEventListener('DOMContentLoaded', () => {
    const dockButtons = document.querySelectorAll('.dock-btn');
    const closeButtons = document.querySelectorAll('.close-btn');

    // 1. Restore and handle window visibility with localStorage
    dockButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        // Check if it was open before refresh
        const isSavedOpen = localStorage.getItem(targetId) === 'true';
        if (isSavedOpen) {
            windowEl.style.display = 'block';
        } else {
            windowEl.style.display = 'none';
        }

        // Toggle on click
        btn.addEventListener('click', () => {
            const isVisible = windowEl.style.display === 'block';
            if (isVisible) {
                windowEl.style.display = 'none';
                localStorage.setItem(targetId, 'false');
            } else {
                windowEl.style.display = 'block';
                localStorage.setItem(targetId, 'true');
            }
        });
    });

    // 2. Close window via red X button
    closeButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        btn.addEventListener('click', () => {
            windowEl.style.display = 'none';
            localStorage.setItem(targetId, 'false');
        });
    });

    // 3. Make windows draggable by their title bars (.title-bar & .player-title-bar)
    const titleBars = document.querySelectorAll('.title-bar, .player-title-bar');

    titleBars.forEach(titleBar => {
        // Find the outer container (e.g., #cafe-menu-window or #music-player-window) first!
        const windowEl = titleBar.closest('[id$="-window"]') || titleBar.closest('.retro-window, .retro-player') || titleBar.parentElement;
        if (!windowEl) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        titleBar.addEventListener('mousedown', (e) => {
            // Prevent dragging if clicking the close buttons / window dots
            if (e.target.closest('.window-buttons')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            const rect = windowEl.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // Use fixed positioning so it moves smoothly without collapsing
            windowEl.style.position = 'fixed';
            windowEl.style.left = initialLeft + 'px';
            windowEl.style.top = initialTop + 'px';
            windowEl.style.margin = '0';
            windowEl.style.zIndex = 1000;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            windowEl.style.left = (initialLeft + dx) + 'px';
            windowEl.style.top = (initialTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    });

    // 4. Spawn Cafe Treats / Drinks as Draggable PNG Images
    const spawnButtons = document.querySelectorAll('.drink-spawn');

    spawnButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const imgSrc = button.getAttribute('data-img');
            if (!imgSrc) return;
            createDraggableImage(imgSrc, e.clientX, e.clientY);
        });
    });

    function createDraggableImage(imageSrc, startX, startY) {
        const item = document.createElement('div');
        item.className = 'spawned-cafe-item';

        const img = document.createElement('img');
        img.src = imageSrc;
        item.appendChild(img);

        // Initial positioning near click or center of screen
        item.style.position = 'fixed';
        item.style.left = (startX - 30 || window.innerWidth / 2) + 'px';
        item.style.top = (startY - 30 || window.innerHeight / 2) + 'px';
        item.style.zIndex = 2000;

        document.body.appendChild(item);

        let isDraggingItem = false;
        let itemStartX, itemStartY, itemInitialLeft, itemInitialTop;

        item.addEventListener('mousedown', (e) => {
            isDraggingItem = true;
            itemStartX = e.clientX;
            itemStartY = e.clientY;

            const rect = item.getBoundingClientRect();
            itemInitialLeft = rect.left;
            itemInitialTop = rect.top;

            item.style.left = itemInitialLeft + 'px';
            item.style.top = itemInitialTop + 'px';
            item.style.zIndex = 3000;
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingItem) return;
            const dx = e.clientX - itemStartX;
            const dy = e.clientY - itemStartY;

            item.style.left = (itemInitialLeft + dx) + 'px';
            item.style.top = (itemInitialTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDraggingItem = false;
        });
    }
});