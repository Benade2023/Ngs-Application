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