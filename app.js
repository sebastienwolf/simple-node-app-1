const http = require('http');
const { Client } = require('pg');

const client = new Client();
client.connect();

const hostname = '0.0.0.0';
const port = 3000;

process.on('SIGINT', (code) => {
  console.log('Process exit event with code: ', code);
  client.end();
  process.exit();
});

// https://node-postgres.com/features/connecting
const getMessageFromDB = function (cb) {
  client.query('SELECT * FROM messages', (err, res) => {
    if (err) {
      console.log(err.stack);
      cb([]);
    } else {
      cb(res.rows);
    }
  });
};

const server = http.createServer((req, res) => {
  console.log('request received');

  getMessageFromDB((messages) => {
    // eslint-disable-next-line camelcase
    let html_text = '<ul>';
    // eslint-disable-next-line no-restricted-syntax
    for (const message of messages) {
      // eslint-disable-next-line camelcase
      html_text += `<li>${message.text}</li>`;
    }
    // eslint-disable-next-line camelcase
    html_text += '</ul>';

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html_text);
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
