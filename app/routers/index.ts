
import { Router } from 'express';
import metadata from './metadata.router';

import { Request, Response } from 'express';

const router = Router();

router.use('/', metadata);

// API 404
router.use((_request: Request, response: Response) => {
    response.status(404).send('404');
});

export default router;