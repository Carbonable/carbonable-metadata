import { Router } from 'express';
import collection from '../controllers/collection.controller';
import token from '../controllers/token.controller';
import handler from '../handlers/controller.handler';

const router = Router();

/**
 * @swagger
 * /metadata/?address=:address&token=:token&value:value:
 *   get:
 *     summary: Return the image yielders
 *     description: Return the image yielders corresponding to the specified image id.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: image database identifier
 *     tags:
 *       - images
 *     responses:
 *       '200':
 *         description: image yielders found
 *       '404':
 *         description: image not found
*/
router.route('/').get(handler(collection.getAll));
router.route('/:id').get(handler(collection.getOne));
router.route('/:id/value=:value&decimals=:decimals').get(handler(token.getOne));

export default router;