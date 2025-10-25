const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const WHISPER_PATH = process.env.WHISPER_PATH || 'D:\\UserProfile\\Documents\\@ VFC\\whisper';
const WHISPER_MODEL = process.env.WHISPER_MODEL || 'base';

class WhisperService {
  /**
   * Transcribe audio file using local Whisper
   * @param {string} audioFilePath - Path to the audio file
   * @param {string} language - Language code (default: 'fil' for Filipino)
   * @returns {Promise<string>} Transcribed text
   */
  async transcribe(audioFilePath, language = 'fil') {
    return new Promise((resolve, reject) => {
      // Validate audio file exists
      if (!fs.existsSync(audioFilePath)) {
        return reject(new Error(`Audio file not found: ${audioFilePath}`));
      }

      // Validate Whisper directory exists
      if (!fs.existsSync(WHISPER_PATH)) {
        return reject(new Error(`Whisper path not found: ${WHISPER_PATH}`));
      }

      console.log(`[Whisper] Transcribing file: ${audioFilePath}`);
      console.log(`[Whisper] Using model: ${WHISPER_MODEL}`);
      console.log(`[Whisper] Language: ${language}`);

      // Prepare output directory
      const outputDir = path.join(WHISPER_PATH, 'output');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Construct Whisper command
      // Assuming you have whisper.exe or main.exe in the Whisper folder
      const whisperExe = path.join(WHISPER_PATH, 'main.exe');
      
      // Check for different possible executables
      let executablePath;
      if (fs.existsSync(whisperExe)) {
        executablePath = whisperExe;
      } else if (fs.existsSync(path.join(WHISPER_PATH, 'whisper.exe'))) {
        executablePath = path.join(WHISPER_PATH, 'whisper.exe');
      } else {
        // Try Python-based Whisper
        executablePath = 'whisper';
      }

      // Build command arguments
      const args = [
        audioFilePath,
        '--model', WHISPER_MODEL,
        '--language', language,
        '--output_dir', outputDir,
        '--output_format', 'txt',
        '--fp16', 'False' // Disable FP16 for CPU compatibility
      ];

      console.log(`[Whisper] Running: ${executablePath} ${args.join(' ')}`);

      // Spawn Whisper process
      const whisperProcess = spawn(executablePath, args, {
        cwd: WHISPER_PATH,
        shell: true
      });

      let stdout = '';
      let stderr = '';

      whisperProcess.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log(`[Whisper] ${data.toString().trim()}`);
      });

      whisperProcess.stderr.on('data', (data) => {
        stderr += data.toString();
        console.error(`[Whisper] ${data.toString().trim()}`);
      });

      whisperProcess.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`Whisper process exited with code ${code}: ${stderr}`));
        }

        try {
          // Read the transcribed text file
          const audioFileName = path.basename(audioFilePath, path.extname(audioFilePath));
          const txtFilePath = path.join(outputDir, `${audioFileName}.txt`);

          if (!fs.existsSync(txtFilePath)) {
            return reject(new Error(`Transcription file not found: ${txtFilePath}`));
          }

          const transcription = fs.readFileSync(txtFilePath, 'utf-8').trim();
          console.log(`[Whisper] Transcription: ${transcription}`);

          // Clean up temporary files (optional)
          // fs.unlinkSync(txtFilePath);

          resolve(transcription);
        } catch (error) {
          reject(new Error(`Failed to read transcription: ${error.message}`));
        }
      });

      whisperProcess.on('error', (error) => {
        reject(new Error(`Failed to start Whisper: ${error.message}`));
      });
    });
  }

  /**
   * Transcribe audio buffer (save temporarily then transcribe)
   * @param {Buffer} audioBuffer - Audio file buffer
   * @param {string} filename - Original filename
   * @param {string} language - Language code
   * @returns {Promise<string>} Transcribed text
   */
  async transcribeBuffer(audioBuffer, filename = 'audio.m4a', language = 'fil') {
    const tempDir = path.join(WHISPER_PATH, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `${Date.now()}_${filename}`);

    try {
      // Write buffer to temporary file
      fs.writeFileSync(tempFilePath, audioBuffer);

      // Transcribe
      const transcription = await this.transcribe(tempFilePath, language);

      // Clean up temp file
      fs.unlinkSync(tempFilePath);

      return transcription;
    } catch (error) {
      // Clean up on error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      throw error;
    }
  }

  /**
   * Check if Whisper is available
   * @returns {boolean}
   */
  isAvailable() {
    return fs.existsSync(WHISPER_PATH);
  }

  /**
   * Get available models
   * @returns {string[]}
   */
  getAvailableModels() {
    return ['tiny', 'base', 'small', 'medium', 'large'];
  }
}

module.exports = new WhisperService();
