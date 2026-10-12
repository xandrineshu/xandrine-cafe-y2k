document.addEventListener('DOMContentLoaded', () => {
    const dockButtons = document.querySelectorAll('.dock-btn');
    const closeButtons = document.querySelectorAll('.close-btn');

    // Global focus counter to bring clicked windows to the front
    let highestZIndex = 1000;

    function bringToFront(windowEl) {
        highestZIndex++;
        windowEl.style.zIndex = highestZIndex;
    }

    // 1. Restore and handle window visibility with explicit 'important' priority
    dockButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        const isSavedOpen = localStorage.getItem(targetId) === 'true';
        windowEl.style.setProperty('display', isSavedOpen ? 'block' : 'none', 'important');
        if (isSavedOpen) bringToFront(windowEl);

        btn.onclick = (e) => {
            e.stopPropagation();

            const currentDisplay = window.getComputedStyle(windowEl).display;
            const isVisible = currentDisplay !== 'none';

            if (isVisible) {
                windowEl.style.setProperty('display', 'none', 'important');
                localStorage.setItem(targetId, 'false');
            } else {
                windowEl.style.setProperty('display', 'block', 'important');
                localStorage.setItem(targetId, 'true');
                bringToFront(windowEl);
            }
        };
    });

    // 2. Close window via red X button with 'important' priority
    closeButtons.forEach(btn => {
        const targetId = btn.getAttribute('data-target');
        const windowEl = document.getElementById(targetId);
        if (!windowEl) return;

        btn.onclick = (e) => {
            e.stopPropagation();
            windowEl.style.setProperty('display', 'none', 'important');
            localStorage.setItem(targetId, 'false');
        };
    });

    // 3. Universal Window Dragging Logic (Glitch-free Delta Movement)
    const titleBars = document.querySelectorAll('.title-bar, .player-title-bar, [class*="title-bar"]');
    let activeWindow = null;
    let startX = 0;
    let startY = 0;
    let initialLeft = 0;
    let initialTop = 0;

    titleBars.forEach(titleBar => {
        const windowEl = titleBar.closest('.retro-window, .retro-player, [id$="-window"], [class*="-window"]') || titleBar.parentElement;
        if (!windowEl) return;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-buttons') || e.target.closest('button')) return;

            activeWindow = windowEl;
            bringToFront(activeWindow);

            // Force the element to fixed position and explicit pixel coords BEFORE reading rect
            // This prevents margin/auto-centering layout jumps completely!
            const rect = activeWindow.getBoundingClientRect();

            if (activeWindow.style.position !== 'fixed') {
                activeWindow.style.position = 'fixed';
                activeWindow.style.left = rect.left + 'px';
                activeWindow.style.top = rect.top + 'px';
                activeWindow.style.margin = '0';
            }

            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseFloat(activeWindow.style.left) || rect.left;
            initialTop = parseFloat(activeWindow.style.top) || rect.top;

            e.preventDefault();
        });
    });

    // Global listeners attached only once to track smooth window movement
    document.addEventListener('mousemove', (e) => {
        if (!activeWindow) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        activeWindow.style.left = (initialLeft + dx) + 'px';
        activeWindow.style.top = (initialTop + dy) + 'px';
    });

    document.addEventListener('mouseup', () => {
        activeWindow = null;
    });

    // 4. PERSISTENT SPAWNED CAFE ITEMS LOGIC
    function loadSavedItems() {
        const saved = JSON.parse(localStorage.getItem('spawned_cafe_items') || '[]');
        saved.forEach(itemData => {
            createDraggableImage(itemData.imgSrc, itemData.left, itemData.top, itemData.id, false);
        });
    }

    function saveItemsToStorage() {
        const items = document.querySelectorAll('.spawned-cafe-item');
        const itemsData = [];
        items.forEach(item => {
            itemsData.push({
                id: item.dataset.id,
                imgSrc: item.querySelector('img').getAttribute('src'),
                left: parseFloat(item.style.left),
                top: parseFloat(item.style.top)
            });
        });
        localStorage.setItem('spawned_cafe_items', JSON.stringify(itemsData));
    }

    function createDraggableImage(imageSrc, startXPos, startYPos, itemId = null, saveNew = true) {
        const item = document.createElement('div');
        item.className = 'spawned-cafe-item';

        const id = itemId || 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
        item.dataset.id = id;

        const img = document.createElement('img');
        img.src = imageSrc;
        item.appendChild(img);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'item-delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = 'Remove treat';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            item.remove();
            saveItemsToStorage();
        });
        item.appendChild(deleteBtn);

        item.style.position = 'fixed';
        item.style.left = startXPos + 'px';
        item.style.top = startYPos + 'px';
        item.style.zIndex = 2000;

        document.body.appendChild(item);

        if (saveNew) {
            saveItemsToStorage();
        }

        let isDraggingItem = false;
        let itemStartX, itemStartY, itemInitialLeft, itemInitialTop;

        item.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('item-delete-btn')) return;

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
            const dy = e.clientY - itemStartY; // Fixed: using itemStartY instead of startY

            item.style.left = (itemInitialLeft + dx) + 'px';
            item.style.top = (itemInitialTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingItem) {
                isDraggingItem = false;
                saveItemsToStorage();
            }
        });
    }

    loadSavedItems();

    // 5. Café Menu Carousel Logic
    const treats = [
        { name: "angel cake 🍰", img: "/images/menu/angel_cake.png" },
        { name: "choco boba 🧋", img: "/images/menu/choco_vanilla_boba.png" },
        { name: "cookie cheesecake 🥮", img: "/images/menu/cookie_and_cream_cheesecake.png" },
        { name: "cream soda 🥤", img: "/images/menu/cream_soda.png" },
        { name: "fruit sandwich 🥪", img: "/images/menu/fruit_sandwich.png" },
        { name: "iced ube espresso 🧋", img: "/images/menu/iced_ube_espresso.png" },
        { name: "japanese bento 🍱", img: "/images/menu/japanese_bento.png" },
        { name: "matcha latte 🍵", img: "/images/menu/matcha_latte.png" },
        { name: "mochi donut 🍩", img: "/images/menu/mochi_donut.png" },
        { name: "peach lemonade 🍹", img: "/images/menu/peach_flower_lemonade.png" },
        { name: "strawberry milkshake 🥛", img: "/images/menu/strawberry_milkshake.png" },
        { name: "sweet tanghulu 🍡", img: "/images/menu/sweet_tanghulu.png" }
    ];

    let currentIndex = 0;
    const carouselImg = document.getElementById('carousel-img');
    const summonBtn = document.getElementById('summon-treat-btn');
    const prevBtn = document.getElementById('prev-treat');
    const nextBtn = document.getElementById('next-treat');

    function updateCarousel() {
        if (!carouselImg || !summonBtn) return;
        const currentTreat = treats[currentIndex];
        carouselImg.src = currentTreat.img;
        summonBtn.textContent = currentTreat.name;
        summonBtn.setAttribute('data-img', currentTreat.img);
    }

    if (prevBtn && nextBtn && summonBtn) {
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + treats.length) % treats.length;
            updateCarousel();
        };

        nextBtn.onclick = (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % treats.length;
            updateCarousel();
        };

        summonBtn.onclick = (e) => {
            e.stopPropagation();
            const imgSrc = summonBtn.getAttribute('data-img');
            if (imgSrc) {
                const spawnX = window.innerWidth / 2 + (Math.random() * 100 - 50);
                const spawnY = window.innerHeight / 2 + (Math.random() * 100 - 50);
                createDraggableImage(imgSrc, spawnX, spawnY, null, true);
            }
        };
    }

    // 6. Reset Desktop to Default Button Logic with Custom Modal
    const resetBtn = document.getElementById('reset-desktop-btn');
    const resetModal = document.getElementById('reset-modal');
    const confirmResetBtn = document.getElementById('modal-confirm-btn');
    const cancelResetBtn = document.getElementById('modal-cancel-btn');

    if (resetBtn && resetModal) {
        resetBtn.onclick = (e) => {
            e.stopPropagation();
            resetModal.style.setProperty('display', 'flex', 'important');
        };

        if (cancelResetBtn) {
            cancelResetBtn.onclick = (e) => {
                e.stopPropagation();
                resetModal.style.setProperty('display', 'none', 'important');
            };
        }

        if (confirmResetBtn) {
            confirmResetBtn.onclick = (e) => {
                e.stopPropagation();
                localStorage.clear();
                location.reload();
            };
        }
    }

    // 7. Kuroo the Cat Companion Interactions
    const kurooSprite = document.getElementById('kuroo-sprite');
    const catStatus = document.querySelector('.cat-status');
    const feedBtn = document.getElementById('feed-cat-btn');
    const petBtn = document.getElementById('pet-cat-btn');

    const kurooQuotes = [
        "Kuroo is purring softly... (๑ت๑)♡",
        "Kuroo is judging your code architecture. 🐈‍⬛",
        "Kuroo is dreaming of fish shaped pastries.",
        "Kuroo knocked a pastel pen off the desk. Oops!",
        "Kuroo says: Stay cozy and keep brewing code! ☕"
    ];

    if (kurooSprite && catStatus) {
        kurooSprite.onclick = () => {
            const randomMsg = kurooQuotes[Math.floor(Math.random() * kurooQuotes.length)];
            catStatus.textContent = `"${randomMsg}"`;
        };
    }

    if (feedBtn && catStatus) {
        feedBtn.onclick = () => {
            catStatus.textContent = `"Nom nom nom! Kuroo loves the treat! 🐟✨"`;
        };
    }

    if (petBtn && catStatus) {
        petBtn.onclick = () => {
            catStatus.textContent = `"Purrrrr... Kuroo leans into your hand. 🐾💖"`;
        };
    }
});