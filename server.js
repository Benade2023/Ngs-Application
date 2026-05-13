// const path = require('path');
// const jsonServer = require('json-server');

// const server = jsonServer.create();
// const router = jsonServer.router(path.join(__dirname, 'db.json'));
// const middlewares = jsonServer.defaults();

// const express = require('express');
// const multer = require('multer');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();

// const dbPath = path.join(__dirname, 'db.json');
// const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(uploadDir));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const safeName = file.originalname.replace(/\s+/g, '-');
//     cb(null, `${Date.now()}-${safeName}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 25 * 1024 * 1024 } // 25 MB
// });

// function readDb() {
//   if (!fs.existsSync(dbPath)) {
//     return { files: [] };
//   }

//   const raw = fs.readFileSync(dbPath, 'utf8');
//   if (!raw.trim()) {
//     return { files: [] };
//   }

//   return JSON.parse(raw);
// }

// function writeDb(db) {
//   fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// }

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Aucun fichier reçu.' });
//   }

//   const record = {
//     id: Date.now(),
//     originalName: req.file.originalname,
//     fileName: req.file.filename,
//     mimeType: req.file.mimetype,
//     size: req.file.size,
//     filePath: `/uploads/${req.file.filename}`,
//     createdAt: new Date().toISOString()
//   };

//   const db = readDb();
//   db.files = db.files || [];
//   db.files.push(record);
//   writeDb(db);

//   res.status(201).json(record);
// });

// const apiRouter = jsonServer.router(dbPath);
// app.use('/api', apiRouter);

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

// server.use(middlewares);

// // Configuration CORS améliorée
// server.use((req, res, next) => {
//   // Autoriser plusieurs origines ou utiliser * pour le développement
//   const allowedOrigins = [
//     'https://carried-backlight-deftly.ngrok-free.dev',
//     'http://localhost:4200',
//     'https://broker-passport-screen.ngrok-free.dev'
//   ];

//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   } else {
//     // Pour le développement uniquement
//     res.header('Access-Control-Allow-Origin', '*');
//   }

//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
//   res.header('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With');

//   // Gérer les requêtes preflight OPTIONS
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

// server.use(jsonServer.bodyParser);

// // Logging pour debug
// server.use((req, res, next) => {
//   console.log(`${req.method} ${req.url} - Origin: ${req.headers.origin}`);
//   next();
// });

// server.use(router);

// server.listen(3000, '0.0.0.0', () => {
//   console.log('JSON Server is running on port 3000');
//   console.log('CORS enabled for:', 'https://carried-backlight-deftly.ngrok-free.dev');
// });

// const express = require('express');
// const jsonServer = require('json-server');
// const multer = require('multer');
// const cors = require('cors');
// const fs = require('fs');
// const path = require('path');

// const app = express();

// const dbPath = path.join(__dirname, 'db.json');
// const uploadDir = path.join(__dirname, 'uploads');

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(uploadDir));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const safeName = file.originalname.replace(/\s+/g, '-');
//     cb(null, `${Date.now()}-${safeName}`);
//   }
// });

// const upload = multer({ storage });

// function readDb() {
//   if (!fs.existsSync(dbPath)) return { files: [] };
//   const raw = fs.readFileSync(dbPath, 'utf8');
//   return raw.trim() ? JSON.parse(raw) : { files: [] };
// }

// function writeDb(db) {
//   fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
// }

// app.post('/api/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: 'Aucun fichier reçu.' });
//   }

//   const record = {
//     id: Date.now(),
//     originalName: req.file.originalname,
//     fileName: req.file.filename,
//     mimeType: req.file.mimetype,
//     size: req.file.size,
//     filePath: `/uploads/${req.file.filename}`,
//     createdAt: new Date().toISOString()
//   };

//   const db = readDb();
//   db.files = db.files || [];
//   db.files.push(record);
//   writeDb(db);

//   res.status(201).json(record);
// });

// const apiRouter = jsonServer.router(dbPath);
// app.use('/api', apiRouter);

// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });

const express = require('express');
const jsonServer = require('json-server');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify({ agents: [], files: [] }, null, 2)
  );
}

app.use(cors());
app.use('/uploads', express.static(UPLOAD_DIR));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

function readDb() {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return raw.trim() ? JSON.parse(raw) : { agents: [], files: [] };
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Upload fichier
app.post('/api/upload', upload.single('file'), (req, res) => {

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

    const db = readDb();
    db.files = db.files || [];

    const record = {
      id: Date.now(),
      matriculeAgent: req.body.matriculeAgent?.trim() || null,
      projectId: req.body.projectId?.trim() || null,
      type: req.body.type?.trim() || null,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };

    db.files.push(record);
    writeDb(db);

    return res.status(201).json(record);
  } catch (error) {
    console.error('Erreur upload:', error);
    return res.status(500).json({
      message: 'Erreur serveur lors de l’upload',
      error: error.message
    });
  }
});

// CRUD json-server
const router = jsonServer.router(DB_PATH);
app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});