document.addEventListener('DOMContentLoaded', () => {
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
            currentIndex = (currentIndex + 1 + treats.length) % treats.length;
            updateCarousel();
        };

        summonBtn.onclick = (e) => {
            e.stopPropagation();
            const imgSrc = summonBtn.getAttribute('data-img');
            if (imgSrc && typeof window.createDraggableImage === 'function') {
                const spawnX = window.innerWidth / 2 + (Math.random() * 100 - 50);
                const spawnY = window.innerHeight / 2 + (Math.random() * 100 - 50);
                window.createDraggableImage(imgSrc, spawnX, spawnY, null, true);
            }
        };
    }

    updateCarousel();
});