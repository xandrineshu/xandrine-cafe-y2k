document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('swup-container');

    // Helper to preload stylesheet before swapping content
    function loadStyle(href) {
        return new Promise((resolve) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                resolve();
                return;
            }
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = () => resolve();
            link.onerror = () => resolve();
            document.head.appendChild(link);
        });
    }

    async function switchPage(url, pushHistory = true) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page load failed');
            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.getElementById('swup-container');

            if (newContent && container) {
                // 1. Pre-fetch and wait for new stylesheets to load invisibly in the background
                const newStyles = doc.querySelectorAll('link[rel="stylesheet"]');
                const stylePromises = [];

                newStyles.forEach(style => {
                    const href = style.getAttribute('href');
                    if (href && !href.includes('music-player.css')) {
                        stylePromises.push(loadStyle(href));
                    }
                });

                await Promise.all(stylePromises);

                // 2. Remove old page-specific stylesheets
                document.querySelectorAll('link[rel="stylesheet"]').forEach(linkTag => {
                    const href = linkTag.getAttribute('href');
                    if (href && !href.includes('music-player.css')) {
                        const existsInNew = Array.from(newStyles).some(s => s.getAttribute('href') === href);
                        if (!existsInNew) {
                            linkTag.remove();
                        }
                    }
                });

                // 3. Update title and swap HTML content instantly (zero transition)
                const newTitle = doc.querySelector('title');
                if (newTitle) document.title = newTitle.textContent;

                container.innerHTML = newContent.innerHTML;

                if (pushHistory) {
                    window.history.pushState({}, '', url);
                }
                window.scrollTo(0, 0);
            } else {
                window.location.href = url;
            }
        } catch (err) {
            console.error("Navigation error:", err);
            window.location.href = url;
        }
    }

    // Intercept clicks on site links
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.origin === window.location.origin) {
            if (link.hash || link.target === '_blank') return;
            e.preventDefault();
            switchPage(link.href);
        }
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
        switchPage(window.location.href, false);
    });
});