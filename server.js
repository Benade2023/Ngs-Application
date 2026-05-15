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

const router = jsonServer.router(DB_PATH);

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

// ROUTE UPLOAD AVANT JSON-SERVER
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    console.log('BODY =>', req.body);

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu.' });
    }

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

    router.db.get('files').push(record).write();

    return res.status(201).json(record);
  } catch (error) {
    console.error('UPLOAD ERROR =>', error);
    return res.status(500).json({
      message: 'Erreur serveur upload',
      error: error.message
    });
  }
});

app.patch('/api/files/:id', upload.single('file'), (req, res) => {

  try {

    const fileId = Number(req.params.id);

    const existingFile = router.db
      .get('files')
      .find({ id: fileId })
      .value();

    if (!existingFile) {
      return res.status(404).json({
        message: 'Fichier introuvable'
      });
    }

    const updatedData = {

      ...existingFile,

      matriculeAgent:
        req.body.matriculeAgent ?? existingFile.matriculeAgent,

      type:
        req.body.type ?? existingFile.type,

      projectId:
        req.body.projectId ?? existingFile.projectId
    };

    // Si nouveau fichier uploadé
    if (req.file) {

      updatedData.originalName = req.file.originalname;
      updatedData.fileName = req.file.filename;
      updatedData.mimeType = req.file.mimetype;
      updatedData.size = req.file.size;
      updatedData.filePath = `/uploads/${req.file.filename}`;
    }

    router.db
      .get('files')
      .find({ id: fileId })
      .assign(updatedData)
      .write();

    return res.status(200).json(updatedData);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: 'Erreur update fichier'
    });
  }
});

// ENSUITE SEULEMENT JSON-SERVER
app.use('/api', router);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});