require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const port = process.env.PORT || 3000;
const API_URI = process.env.API_URI;
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', async (req, res) => {
  let items = [];
  axios.get(`${API_URI}api/v2/item/`).then((response) => {
    let endpoints = [];
    response.data.results.forEach((element) => {
      endpoints.push(element.url);
    });

    axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((data) => {
      data.forEach((element) => {
        const item = {
          name: element.data.name,
          cost: element.data.cost,
          img: element.data.sprites.default,
        };
        items.push(item);
        console.log(item);
      });
      res.render('pages/index', { items });
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
