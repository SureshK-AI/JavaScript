import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { resumesRepo } from '../db/repository.js';
import { storeUpload } from '../core/storage.js';
import { extractTextFromBuffer, parseResumeText } from '../services/resumeParser.js';
import { parseOrThrow } from '../core/validation.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const tailorSchema = z.object({
  jobId: z.string().min(1),
});

/** POST /resumes — upload + parse (PDF/DOCX/TXT). */
router.post(
  '/',
  upload.single('file'),
  asyncHandler(async (req: AuthedRequest, res) => {
    const userId = req.user!.id;
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded (field "file")' });
      return;
    }
    const mimeType = file.mimetype || 'application/octet-stream';
    if (!/(pdf|word|officedocument|text|docx)/i.test(mimeType) && !/\.(pdf|docx|txt)$/i.test(file.originalname)) {
      res.status(415).json({ error: 'Unsupported file type. Use PDF, DOCX, or TXT.' });
      return;
    }
    const startedAt = Date.now();
    const rawText = await extractTextFromBuffer(file.buffer, mimeType);
    const parsed = parseResumeText(rawText);
    const storagePath = storeUpload(file.buffer, file.originalname);
    const resume = resumesRepo.create({
      userId,
      filename: file.originalname,
      mimeType,
      rawText,
      parsedData: parsed,
      storagePath,
    });
    res.status(201).json({
      resume,
      parsed: parsed,
      parseTimeMs: Date.now() - startedAt,
    });
  }),
);

/** GET /resumes — list candidate resumes. */
router.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json({ resumes: resumesRepo.listByUser(req.user!.id) });
  }),
);

/** GET /resumes/:id — get one resume. */
router.get(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    const resume = resumesRepo.findById(String(req.params.id));
    if (!resume || resume.userId !== req.user!.id) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    res.json({ resume });
  }),
);

/** POST /resumes/:id/tailor — tailor for a job (Resume Builder). */
router.post(
  '/:id/tailor',
  asyncHandler(async (req: AuthedRequest, res) => {
    const resume = resumesRepo.findById(String(req.params.id));
    if (!resume || resume.userId !== req.user!.id) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }
    const { jobId } = parseOrThrow(tailorSchema, req.body);
    const { createResumeVersion } = await import('../services/multiResume.js');
    const { jobsRepo } = await import('../db/repository.js');
    const job = jobsRepo.findById(jobId);
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    if (!resume.parsedData) {
      res.status(422).json({ error: 'Resume has no parsed data' });
      return;
    }
    const version = createResumeVersion(resume.parsedData, job, resume.id);
    res.json({ version });
  }),
);

export default router;
