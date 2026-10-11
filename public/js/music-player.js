document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-audio');
    const playBtn = document.getElementById('play-btn');
    const switchBtn = document.getElementById('switch-btn');
    const trackInfo = document.getElementById('track-info');

    const tracks = [
        { name: "♪ 1. BTS – Life Goes On", src: "/audio/lifegoeson.mp3" },
        { name: "♪ 2. ENHYPEN – Polaroid Love", src: "/audio/polaroidlove.mp3" },
        { name: "♪ 3. BAND-MAID – Daydreaming", src: "/audio/daydreaming.mp3" },
        { name: "♪ 4. Red Velvet – Automatic", src: "/audio/automatic.mp3" },
        { name: "♪ 5. MAMAMOO – Wind Flower", src: "/audio/windflower.mp3" },
        { name: "♪ 6. TWICE – Doughnut", src: "/audio/doughnut.mp3" },
        { name: "♪ 7. TXT – Our Summer", src: "/audio/oursummer.mp3" },
        { name: "♪ 8. ILLIT – Midnight Fiction", src: "/audio/midnightfiction.mp3" },
        { name: "♪ 9. LE SSERAFIM – Impurities", src: "/audio/impurities.mp3" },
        { name: "♪ 10. Joe Hisaishi – One Summer’s Day", src: "/audio/onesummersday.mp3" }
    ];

    // Load saved states
    let currentTrackIndex = parseInt(localStorage.getItem('trackIndex')) || 0;
    let savedTime = parseFloat(localStorage.getItem('audioTime')) || 0;
    let isPlaying = localStorage.getItem('isPlaying') === 'true';

    // Configure smooth audio loading
    audio.preload = "auto";
    audio.src = tracks[currentTrackIndex].src;
    trackInfo.textContent = tracks[currentTrackIndex].name;
    audio.currentTime = savedTime;

    // Smoothly resume playback after a tiny delay so the page renders cleanly first
    if (isPlaying) {
        playBtn.textContent = '⏸ Pause';
        setTimeout(() => {
            audio.play().catch(e => {
                console.log("Auto-play restricted by browser:", e);
                isPlaying = false;
                localStorage.setItem('isPlaying', 'false');
                playBtn.textContent = '▶ Play';
            });
        }, 100);
    }

    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playBtn.textContent = '▶ Play';
            isPlaying = false;
            localStorage.setItem('isPlaying', 'false');
        } else {
            audio.play().then(() => {
                playBtn.textContent = '⏸ Pause';
                isPlaying = true;
                localStorage.setItem('isPlaying', 'true');
            }).catch(e => console.log("Audio play blocked:", e));
        }
    });

    switchBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        audio.src = tracks[currentTrackIndex].src;
        trackInfo.textContent = tracks[currentTrackIndex].name;
        localStorage.setItem('trackIndex', currentTrackIndex);
        localStorage.setItem('audioTime', 0);
        audio.currentTime = 0;

        if (isPlaying) {
            audio.play().catch(e => console.log("Playback error:", e));
        }
    });

    // Continuously save progress
    setInterval(() => {
        if (isPlaying) {
            localStorage.setItem('audioTime', audio.currentTime);
            localStorage.setItem('trackIndex', currentTrackIndex);
            localStorage.setItem('isPlaying', 'true');
        }
    }, 300);

    // Save state right before clicking a link to change pages
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('audioTime', audio.currentTime);
        localStorage.setItem('trackIndex', currentTrackIndex);
        localStorage.setItem('isPlaying', isPlaying);
    });

    // Draggable & Persistent Window Position Logic
    const player = document.querySelector('.retro-player');
    const titleBar = document.querySelector('.player-title-bar');

    const savedLeft = localStorage.getItem('playerLeft');
    const savedTop = localStorage.getItem('playerTop');

    if (savedLeft && savedTop && player) {
        player.style.position = 'absolute';
        player.style.left = savedLeft;
        player.style.top = savedTop;
        player.style.bottom = 'auto';
        player.style.right = 'auto';
    }

    let isDragging = false;
    let startX, startY;

    if (titleBar && player) {
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = player.getBoundingClientRect();
            player.style.position = 'absolute';
            player.style.left = rect.left + 'px';
            player.style.top = rect.top + 'px';
            player.style.bottom = 'auto';
            player.style.right = 'auto';

            startX = e.clientX - rect.left;
            startY = e.clientY - rect.top;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    function onMouseMove(e) {
        if (!isDragging) return;
        player.style.left = (e.clientX - startX) + 'px';
        player.style.top = (e.clientY - startY) + 'px';
    }

    function onMouseUp() {
        if (isDragging) {
            isDragging = false;
            localStorage.setItem('playerLeft', player.style.left);
            localStorage.setItem('playerTop', player.style.top);
        }
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
});