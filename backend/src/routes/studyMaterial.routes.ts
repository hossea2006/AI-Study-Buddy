import { Router } from 'express';
import {
  createStudyMaterial,
  uploadStudyMaterial,
  getStudyMaterials,
  getStudyMaterialById,
  deleteStudyMaterial,
} from '../controllers/studyMaterial.controller';
import { authenticate } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validate, createStudyMaterialSchema } from '../middleware/validation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createStudyMaterialSchema), createStudyMaterial);
router.post('/upload', upload.single('file'), uploadStudyMaterial);
router.get('/', getStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.delete('/:id', deleteStudyMaterial);

export default router;
