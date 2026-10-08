const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/portfolio', (req, res) => {
    res.render('portfolio');
});

app.get('/guestbook', (req, res) => {
    res.render('guestbook');
});

const PORT = 3007;
app.listen(PORT, () => {
    console.log(`✨ Xandrine's Y2k Cafe is open at http://localhost:${PORT} ☕💖`);
});