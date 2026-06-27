import { body, query, param } from 'express-validator';

export const createPublicationValidator = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ max: 300 }).withMessage('Title max 300 chars'),
  body('abstract').trim().notEmpty().withMessage('Abstract is required')
    .isLength({ max: 5000 }).withMessage('Abstract max 5000 chars'),
  body('authors').isArray({ min: 1 }).withMessage('At least one author is required'),
  body('authors.*.displayName').trim().notEmpty().withMessage('Each author must have a displayName'),
  body('authors.*.institution').optional().trim().isLength({ max: 200 }),
  body('journal').optional().trim().isLength({ max: 300 }),
  body('publicationDate').optional().isISO8601().withMessage('Invalid date format'),
  body('tags').optional().isArray(),
  body('tags.*').optional().trim().isLength({ max: 50 }),
  body('citationCount').optional().isInt({ min: 0 }).withMessage('citationCount must be >= 0'),
  body('fileUrl').optional().trim().isURL().withMessage('fileUrl must be a valid URL'),
];

export const updatePublicationValidator = [
  param('id').isMongoId().withMessage('Invalid publication ID'),
  body('title').optional().trim().isLength({ max: 300 }),
  body('abstract').optional().trim().isLength({ max: 5000 }),
  body('authors').optional().isArray({ min: 1 }),
  body('authors.*.displayName').optional().trim().notEmpty(),
  body('authors.*.institution').optional().trim().isLength({ max: 200 }),
  body('journal').optional().trim().isLength({ max: 300 }),
  body('publicationDate').optional().isISO8601().withMessage('Invalid date format'),
  body('tags').optional().isArray(),
  body('tags.*').optional().trim().isLength({ max: 50 }),
  body('citationCount').optional().isInt({ min: 0 }),
  body('fileUrl').optional().trim().isURL().withMessage('fileUrl must be a valid URL'),
];

export const getPublicationsValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
  query('sortBy').optional()
    .isIn(['publicationDate', 'citationCount', 'title', 'createdAt'])
    .withMessage('Invalid sortBy field'),
  query('order').optional().isIn(['asc', 'desc']).withMessage('order must be asc or desc'),
  query('year').optional()
    .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Invalid year'),
  query('tag').optional().trim().isLength({ max: 50 }),
  query('journal').optional().trim().isLength({ max: 300 }),
];

export const mongoIdValidator = [
  param('id').isMongoId().withMessage('Invalid publication ID'),
];
