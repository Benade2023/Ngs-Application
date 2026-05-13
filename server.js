const express = require('express');
const jsonServer = require('json-server');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = 3000;

// Chemins absolus
const DB_PATH = path.join(__dirname, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Vérifications console
console.log('CWD =>', process.cwd());
console.log('DB_PATH =>', DB_PATH);
console.log('UPLOAD_DIR =>', UPLOAD_DIR);

// Création dossier uploads
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Création db.json si absent
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(
    DB_PATH,
    JSON.stringify(
      {
        agents: [],
        files: []
      },
      null,
      2
    )
  );
}

app.use(cors());

// Exposition des fichiers statiques
app.use('/uploads', express.static(UPLOAD_DIR));

// =========================
// JSON SERVER
// =========================

const router = jsonServer.router(DB_PATH);

app.use('/api', router);

// =========================
// MULTER
// =========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');

    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024
  }
});

// =========================
// UPLOAD ROUTE
// =========================

app.post('/api/upload', upload.single('file'), (req, res) => {

  try {

    console.log('BODY =>', req.body);

    if (!req.file) {
      return res.status(400).json({
        message: 'Aucun fichier reçu.'
      });
    }

    const record = {
      id: Date.now(),

      // Relations facultatives
      matriculeAgent: req.body.matriculeAgent?.trim() || null,
      projectId: req.body.projectId?.trim() || null,
      type: req.body.type?.trim() || null,

      // Infos fichier
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: `/uploads/${req.file.filename}`,

      createdAt: new Date().toISOString()
    };

    console.log('RECORD =>', record);

    // IMPORTANT :
    // écriture DIRECTE dans la DB json-server
    router.db
      .get('files')
      .push(record)
      .write();

    return res.status(201).json(record);

  } catch (error) {

    console.error('UPLOAD ERROR =>', error);

    return res.status(500).json({
      message: 'Erreur serveur upload',
      error: error.message
    });
  }
});

// =========================
// SERVER
// =========================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});