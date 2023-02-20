import * as fs from 'fs';

import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma, Image } from '@prisma/client';

const controller = {
    /**
     * Encode file data to base64 encoded string
     * @param file
     * @returns base64 string
     */
    base64_encode(file: string): string {
        const bitmap = fs.readFileSync(file);
        return bitmap.toString('base64');
    },

    async create(data: { path: string }) {
        const b64 = controller.base64_encode(data.path);
        return await prisma.image.create({ data: { ...data, data: b64 } });
    },

    async read(where: { id?: number, path?: string }, include?: Prisma.ImageInclude) {
        return await prisma.image.findUnique({ where, include });
    },

    async update(where: { id?: number }, data: { path?: string, data?: string }) {
        return await prisma.image.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.image.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const where = { id: Number(request.params.id) };
        const image = await controller.read(where);

        if (!image) {
            const message = 'image not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(image);
    },

    async getAll(_request: Request, response: Response) {
        const images = await prisma.image.findMany();
        return response.status(200).json(images);
    },
}

export default controller;