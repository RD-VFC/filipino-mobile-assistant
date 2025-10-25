const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const whisperService = require('../services/whisper.service');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    const allowedMimes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
      'audio/x-m4a',
      'audio/mp4',
      'audio/webm',
      'audio/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype) || file.originalname.match(/\.(mp3|wav|m4a|webm|ogg|mp4)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// Transcribe audio file
router.post('/transcribe', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { language = 'fil' } = req.body;

    console.log(`[Voice Route] Received audio file: ${req.file.filename}`);
    console.log(`[Voice Route] Language: ${language}`);

    // Check if Whisper is available
    if (!whisperService.isAvailable()) {
      return res.status(500).json({
        error: 'Whisper service is not available',
        message: `Whisper path not found: ${process.env.WHISPER_PATH}`
      });
    }

    // Transcribe using local Whisper
    const transcription = await whisperService.transcribe(req.file.path, language);

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      transcription: transcription,
      language: language,
      confidence: 0.95 // Whisper doesn't provide confidence, use default
    });
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// Health check for Whisper service
router.get('/status', (req, res) => {
  const isAvailable = whisperService.isAvailable();
  const models = whisperService.getAvailableModels();
  
  res.json({
    available: isAvailable,
    whisper_path: process.env.WHISPER_PATH,
    model: process.env.WHISPER_MODEL || 'base',
    available_models: models,
    max_file_size: '25MB'
  });
});

module.exports = router;
