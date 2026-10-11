document.addEventListener('DOMContentLoaded', () => {
    const spawnButtons = document.querySelectorAll('.drink-spawn');

    spawnButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const icon = e.target.getAttribute('data-icon');
            createDraggableItem(icon, e.clientX, e.clientY);
        });
    });

    function createDraggableItem(iconText, startX, startY) {
        const item = document.createElement('div');
        item.className = 'spawned-cafe-item';
        item.innerText = iconText;

        // Position it near the click or center of screen
        item.style.left = (startX - 20 || window.innerWidth / 2) + 'px';
        item.style.top = (startY - 20 || window.innerHeight / 2) + 'px';

        document.body.appendChild(item);

        // Make item draggable
        let isDragging = false;
        let offsetX, offsetY;

        item.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - item.getBoundingClientRect().left;
            offsetY = e.clientY - item.getBoundingClientRect().top;
            item.style.zIndex = 1000;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            item.style.left = (e.clientX - offsetX) + 'px';
            item.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
});