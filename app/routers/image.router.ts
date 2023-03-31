import { Router } from 'express';
import collection from '../controllers/collection.controller';
import token from '../controllers/token.controller';
import image from '../controllers/image.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /image/{id}?value={value}&decimals={decimals}:
 *   get:
 *     summary: Return a single image
 *     description: Return a single image.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: image database identifier
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
 *       - image
 *     responses:
 *       '200':
 *         description: image found
 *       '404':
 *         description: image not found
*/
router.route('/:id').get(handler(image.getOne));

export default router;