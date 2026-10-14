const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 1. Middleware to read form data
app.use(express.urlencoded({ extended: true }));

// 2. In-memory storage for guestbook messages
const guestbookEntries = [];

// Base suffix for browser titles
const TITLE_SUFFIX = " // Xandrine's Y2K Café";

// 3. Route Handlers with Dynamic Titles
app.get('/', (req, res) => {
    res.render('home', {
        title: `Journal${TITLE_SUFFIX}`
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: `About${TITLE_SUFFIX}`
    });
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio', {
        title: `Portfolio${TITLE_SUFFIX}`
    });
});

app.get('/guestbook', (req, res) => {
    res.render('guestbook', {
        title: `Guestbook${TITLE_SUFFIX}`,
        entries: guestbookEntries
    });
});

// 4. POST route for guestbook signatures
app.post('/guestbook', (req, res) => {
    let { name, message } = req.body;

    if (name && message) {
        const cleanMessage = message.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);

        // Automatically add @ if it's missing
        let handle = name.trim();
        if (!handle.startsWith('@')) {
            handle = '@' + handle;
        }

        const newEntry = {
            name: handle.slice(0, 15), // Limit handle to 15 chars max
            message: cleanMessage,
            date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        guestbookEntries.unshift(newEntry);
    }

    res.redirect('/guestbook');
});

// 5. Catch-all 404 Route Handler
app.use((req, res, next) => {
    res.status(404).render('errors/404', {
        title: `404 Not Found${TITLE_SUFFIX}`
    });
});

// 6. General Server Error Handler (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('errors/404', { // You can create a 500.ejs or reuse 404 styled for server errors
        title: `System Error${TITLE_SUFFIX}`
    });
});

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`✨ Xandrine's Y2K Café is open at http://localhost:${PORT} (˶ᵔ ᵕ ᵔ˶) ‹𝟹`);
});