import { Router } from 'express';
import {
  createStudyMaterial,
  getStudyMaterials,
  getStudyMaterialById,
  deleteStudyMaterial,
} from '../controllers/studyMaterial.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', createStudyMaterial);
router.get('/', getStudyMaterials);
router.get('/:id', getStudyMaterialById);
router.delete('/:id', deleteStudyMaterial);

export default router;
