const path = require('path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Configuration CORS améliorée
server.use((req, res, next) => {
  // Autoriser plusieurs origines ou utiliser * pour le développement
  const allowedOrigins = [
    'https://carried-backlight-deftly.ngrok-free.dev',
    'http://localhost:4200',
    'https://broker-passport-screen.ngrok-free.dev'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Pour le développement uniquement
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With');

  // Gérer les requêtes preflight OPTIONS
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.use(jsonServer.bodyParser);

// Logging pour debug
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

server.use(router);

server.listen(3000, '0.0.0.0', () => {
  console.log('JSON Server is running on port 3000');
  console.log('CORS enabled for:', 'https://carried-backlight-deftly.ngrok-free.dev');
});


// const path = require('path');
// const jsonServer = require('json-server');

// const server = jsonServer.create();
// const router = jsonServer.router(path.join(__dirname, 'db.json'));
// const middlewares = jsonServer.defaults();

// server.use(middlewares);

// server.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'https://carried-backlight-deftly.ngrok-free.dev');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

//   if (req.method === 'OPTIONS') {
//     return res.sendStatus(200);
//   }

//   next();
// });

// server.use(jsonServer.bodyParser);
// server.use(router);

// server.listen(3000, '0.0.0.0', () => {
//   console.log('JSON Server is running on port 3000');
// });

