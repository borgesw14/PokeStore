require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const port = process.env.PORT || 3000;
const API_URI = process.env.API_URI;
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));
app.use('/public', express.static(__dirname + '/public'));

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
          description: element.data.flavor_text_entries[0].text,
        };

        for (const desc of element.data.flavor_text_entries) {
          if (desc.language.name == 'en') {
            item.description = desc.text;
            break;
          }
        }

        let styledName = item.name.split('-');
        item.name = styledName
          .map((word) => {
            return word[0].toUpperCase() + word.substring(1);
          })
          .join(' ');

        //console.log(styledName);

        items.push(item);
        //console.log(item);
      });
      res.render('pages/index', { items });
    });
  });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}/`);
});
