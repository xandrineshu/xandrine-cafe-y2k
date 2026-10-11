const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 1. Middleware to read form data must be at the top
app.use(express.urlencoded({ extended: true }));

// 2. In-memory storage for guestbook messages
const guestbookEntries = [];

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});

// 3. Single GET route for guestbook passing the entries array
app.get('/guestbook', (req, res) => {
    res.render('guestbook', { entries: guestbookEntries });
});

// 4. POST route to handle new guestbook signatures with character limits
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

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`✨ Xandrine's Y2K Café is open at http://localhost:${PORT} (˶ᵔ ᵕ ᵔ˶) ‹𝟹`);
});