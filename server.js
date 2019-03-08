// this will read .env file
require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// All your files and folders under public folder are deployed as root.
app.use(express.static('public'));

app.use('/scripts', express.static(`${__dirname}/node_modules/`));

app.listen(port, () => {
    console.log('App is listening on port %d', port);
});