document.addEventListener('DOMContentLoaded', () => {
    const kurooMascot = document.getElementById('kuroo-mascot');
    const catInteractionModal = document.getElementById('cat-companion-window');
    const catStatus = document.getElementById('cat-status');
    const feedBtn = document.getElementById('feed-cat-btn');
    const petBtn = document.getElementById('pet-cat-btn');

    let kurooState = 'idle';
    let kurooWanderInterval;

    // Helper check: Is Kuroo actually visible on screen right now?
    function isKurooVisible() {
        if (!kurooMascot) return false;
        const style = window.getComputedStyle(kurooMascot);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    // Restore saved visibility state on load
    const isKurooActive = localStorage.getItem('kuroo-active') === 'true';
    if (kurooMascot) {
        kurooMascot.style.setProperty('display', isKurooActive ? 'block' : 'none', 'important');
    }

    function setKurooAnimation(className) {
        if (!kurooMascot) return;
        kurooMascot.classList.remove(
            'kuroo-idle', 'kuroo-sit', 'kuroo-walking-left',
            'kuroo-walking-right', 'kuroo-sleeping', 'kuroo-eating', 'kuroo-meowing'
        );
        kurooMascot.classList.add(className);
    }

    function showKurooReaction(emojiSymbol) {
        // Prevent reaction from popping up if Kuroo is currently hidden/inactive
        if (!kurooMascot || !isKurooVisible()) return;

        const reaction = document.createElement('div');
        reaction.className = 'kuroo-reaction';
        reaction.textContent = emojiSymbol;

        const currentLeft = parseFloat(kurooMascot.style.left) || window.innerWidth / 2;
        const currentTop = parseFloat(kurooMascot.style.top) || window.innerHeight / 2;

        reaction.style.left = (currentLeft + 32) + 'px';
        reaction.style.top = (currentTop - 20) + 'px';

        document.body.appendChild(reaction);

        setTimeout(() => {
            reaction.remove();
        }, 1200);
    }

    if (kurooMascot && catInteractionModal) {
        if (!kurooMascot.style.left) {
            kurooMascot.style.position = 'fixed';
            kurooMascot.style.left = (window.innerWidth / 2 - 48) + 'px';
            kurooMascot.style.top = (window.innerHeight / 2 - 48) + 'px';
        }

        // --- Click on Kuroo ---
        kurooMascot.addEventListener('click', (e) => {
            if (kurooState === 'beingDrag' || !isKurooVisible()) return;
            e.stopPropagation();
            catInteractionModal.style.setProperty('display', 'flex', 'important');
            localStorage.setItem('cat-companion-window', 'true');
            if (window.bringToFront) window.bringToFront(catInteractionModal);

            setKurooAnimation('kuroo-meowing');
            showKurooReaction('🐾');

            if (kurooState === 'sleeping') {
                catStatus.textContent = '"Kuroo was sleeping, but you woke him up! ꜀( ꜆-ࡇ-)꜆ ᶻ 𝗓 𐰁"';
            } else {
                catStatus.textContent = '"Kuroo meows back at you! (˵◝⩊◜˵マ"';
            }
        });

        // --- Companion Window Buttons ---
        const kurooQuotes = [
            "Shhh, Kuroo is purring softly...  (⸝⸝╸-╺⸝⸝)♡",
            "Kuroo knocked a pastel pen off the desk. Oops! (ᵕ—ᴗ—)",
            "Kuroo says: Stay cozy and keep exploring! ฅ^>⩊<^ ฅ"
        ];

        if (feedBtn) {
            feedBtn.onclick = () => {
                if (!isKurooVisible()) return;
                kurooState = 'eating';
                setKurooAnimation('kuroo-eating');
                showKurooReaction('🐟');
                catStatus.textContent = `"Nom nom nom! Kuroo loves the treat! ᓚ₍^..^₎♡"`;

                setTimeout(() => {
                    if (kurooState === 'eating') {
                        kurooState = 'idle';
                        setKurooAnimation('kuroo-idle');
                    }
                }, 3000);
            };
        }

        if (petBtn) {
            petBtn.onclick = () => {
                if (!isKurooVisible()) return;
                const randomMsg = kurooQuotes[Math.floor(Math.random() * kurooQuotes.length)];
                setKurooAnimation('kuroo-sit');
                showKurooReaction('💕');
                catStatus.textContent = `"${randomMsg}"`;
            };
        }

        // --- Dragging Logic ---
        let isDraggingCat = false;
        let catStartX, catStartY, catInitialLeft, catInitialTop;

        kurooMascot.addEventListener('mousedown', (e) => {
            if (!isKurooVisible()) return;
            isDraggingCat = true;
            kurooState = 'beingDrag';
            setKurooAnimation('kuroo-idle');
            showKurooReaction('✨');
            clearInterval(kurooWanderInterval);

            kurooMascot.style.transition = 'none';

            catStartX = e.clientX;
            catStartY = e.clientY;

            catInitialLeft = parseFloat(kurooMascot.style.left) || 100;
            catInitialTop = parseFloat(kurooMascot.style.top) || 100;

            kurooMascot.style.position = 'fixed';
            kurooMascot.style.margin = '0';
            kurooMascot.style.left = catInitialLeft + 'px';
            kurooMascot.style.top = catInitialTop + 'px';

            if (window.bringToFront) window.bringToFront(kurooMascot);
            e.stopPropagation();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDraggingCat) return;
            const dx = e.clientX - catStartX;
            const dy = e.clientY - catStartY;

            kurooMascot.style.left = (catInitialLeft + dx) + 'px';
            kurooMascot.style.top = (catInitialTop + dy) + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isDraggingCat) {
                isDraggingCat = false;
                kurooState = 'idle';
                setKurooAnimation('kuroo-idle');
                startKurooRoaming();
            }
        });

        // --- Autonomous Roaming Logic ---
        function startKurooRoaming() {
            if (kurooWanderInterval) clearInterval(kurooWanderInterval);

            kurooWanderInterval = setInterval(() => {
                // Pause roaming/reactions entirely if being dragged or if Kuroo is hidden
                if (kurooState === 'beingDrag' || !isKurooVisible()) return;

                const actionRoll = Math.random();

                if (actionRoll < 0.3) {
                    kurooState = 'sleeping';
                    setKurooAnimation('kuroo-sleeping');
                    showKurooReaction('💤');
                } else if (actionRoll < 0.6) {
                    kurooState = 'idle';
                    setKurooAnimation('kuroo-sit');
                } else {
                    roamToRandomLocation();
                }

            }, 10000);
        }

        function roamToRandomLocation() {
            if (!isKurooVisible()) return;
            kurooState = 'walking';

            const padding = 50;
            const maxX = window.innerWidth - padding;
            const maxY = window.innerHeight - padding;
            const randomX = Math.random() * (maxX - padding) + padding;
            const randomY = Math.random() * (maxY - padding) + padding;

            const currentX = parseFloat(kurooMascot.style.left) || window.innerWidth / 2;

            if (randomX < currentX) {
                setKurooAnimation('kuroo-walking-left');
            } else {
                setKurooAnimation('kuroo-walking-right');
            }

            kurooMascot.style.left = randomX + 'px';
            kurooMascot.style.top = randomY + 'px';

            const dx = randomX - currentX;
            const dy = randomY - (parseFloat(kurooMascot.style.top) || window.innerHeight / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const walkDuration = Math.max(distance * 5, 2000);

            kurooMascot.style.transition = `left ${walkDuration}ms linear, top ${walkDuration}ms linear`;

            setTimeout(() => {
                if (kurooState === 'walking') {
                    kurooState = 'idle';
                    setKurooAnimation('kuroo-idle');
                }
            }, walkDuration);
        }

        startKurooRoaming();
    }
});