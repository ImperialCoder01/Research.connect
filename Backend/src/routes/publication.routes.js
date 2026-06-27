import { Router } from 'express';
import {
  createPublication,
  getAllPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
  incrementCitation,
  searchPublications,
} from '../controllers/publication.controller.js';
import {
  createPublicationValidator,
  updatePublicationValidator,
  getPublicationsValidator,
  mongoIdValidator,
} from '../validations/publication.validation.js';

const router = Router();

// /search must be registered before /:id
router.get('/search', searchPublications);

router.route('/')
  .get(getPublicationsValidator, getAllPublications)
  .post(createPublicationValidator, createPublication);

router.route('/:id')
  .get(mongoIdValidator, getPublicationById)
  .put(updatePublicationValidator, updatePublication)
  .delete(mongoIdValidator, deletePublication);

router.patch('/:id/citation', mongoIdValidator, incrementCitation);

export default router;
