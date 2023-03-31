import { Router } from 'express';
import collection from '../controllers/collection.controller';
import token from '../controllers/token.controller';
import image from '../controllers/image.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /collection:
 *   get:
 *     summary: Return all the collection metadata
 *     description: Return the metadata of all the collections available.
 *     tags:
 *       - metadata
 *     responses:
 *       '200':
 *         description: collections found
*/
router.route('/').get(handler(collection.getAll));

/**
 * @swagger
 * /collection/{id}:
 *   get:
 *     summary: Return a single collection metadata
 *     description: Return a single collection metadata.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: collection database identifier
 *     tags:
 *       - metadata
 *     responses:
 *       '200':
 *         description: collection found
 *       '404':
 *         description: collection not found
*/
router.route('/:id').get(handler(collection.getOne));

/**
 * @swagger
 * /collection/{id}/token?value={value}&decimals={decimals}:
 *   get:
 *     summary: Return a single collection metadata
 *     description: Return a single collection metadata.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: collection database identifier
 *       - in: path
 *         name: value
 *         schema:
 *           type: integer
 *         required: true
 *         description: token value
 *       - in: path
 *         name: decimals
 *         schema:
 *           type: integer
 *         required: true
 *         description: token decimals
 *     tags:
 *       - metadata
 *     responses:
 *       '200':
 *         description: collection found
 *       '404':
 *         description: collection not found
*/
router.route('/:id/token').get(handler(token.getOne));

/**
 * @swagger
 * /collection/{id}/image?value={value}&decimals={decimals}:
 *   get:
 *     summary: Return a single collection metadata
 *     description: Return a single collection metadata.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: collection database identifier
 *       - in: path
 *         name: value
 *         schema:
 *           type: integer
 *         required: true
 *         description: token value
 *       - in: path
 *         name: decimals
 *         schema:
 *           type: integer
 *         required: true
 *         description: token decimals
 *     tags:
 *       - metadata
 *     responses:
 *       '200':
 *         description: collection found
 *       '404':
 *         description: collection not found
*/
router.route('/:id/image').get(handler(image.getOne));

export default router;