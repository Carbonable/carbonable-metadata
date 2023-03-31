import * as fs from 'fs';

import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

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

        const img = Buffer.from(image.data, 'base64');
        return response.status(200).contentType('image/png').send(img);
    },

    async getAll(_request: Request, response: Response) {
        const images = await prisma.image.findMany();
        return response.status(200).json(images);
    },

    async generate(request: Request, response: Response) {
        const numerator = Number(request.query.value);
        const denominator = Number(request.query.decimals);

        // 0.1234 format, 6 chars whatever the number
        const value = parseFloat(`${denominator ? numerator / denominator : numerator}`).toFixed(4).slice(0, 6);
        const template = controller.base64_encode('public/assets/template.svg');
        const image = `<svg width="984" height="966" viewBox="0 0 984 966" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><use href="#project__image" /><text y="561" font-size="33" font-family="sans" fill="#EFECEA"><tspan font-weight="bold" style="text-transform: uppercase;" x="50" dy="0">Madagascar</tspan><tspan x="50" dy="1.8em">Project by <tspan font-weight="bold">ForestCalling Action</tspan></tspan><tspan x="50" dy="1.6em">Certified by <tspan font-weight="bold">Wildsense</tspan></tspan></text><text y="561" font-size="33" font-family="sans" fill="#0AF2AD" text-anchor="end"><tspan x="930" dy="1.8em">100m²</tspan><tspan x="920" dy="1.6em">Ends 2052</tspan></text><text y="825" font-family="sans" fill="#EFECEA"><tspan x="355" dy="0" font-size="68" textLength="35%" >Manjarisoa</tspan><tspan x="355" dy="76" font-size="65" textLength="24%" font-weight="bold">${value}</tspan></text><use y="855" x="610" href="#T" /><text y="905" font-family="sans" fill="#EFECEA"><tspan x="675" font-size="45" textLength="12%" >/ year</tspan></text><defs><symbol id="T"><path d="M 48.123 8.937 L 47.443 8.937 C 46.763 7.527 44.976 5.991 42.081 4.33 C 39.186 2.669 36.153 1.838 32.981 1.838 C 31.345 1.838 29.998 2.001 28.941 2.329 C 27.909 2.656 27.393 3.348 27.393 4.405 L 27.393 38.389 C 27.393 39.572 27.518 40.529 27.77 41.259 C 28.047 41.989 28.45 42.656 28.979 43.26 C 29.507 43.839 30.023 44.292 30.527 44.619 C 31.03 44.921 31.685 45.198 32.49 45.45 L 32.49 45.941 C 31.634 45.941 30.376 45.903 28.714 45.828 C 27.053 45.752 25.706 45.714 24.674 45.714 C 23.315 45.714 21.704 45.752 19.841 45.828 C 17.978 45.903 16.895 45.941 16.593 45.941 L 16.593 45.45 C 17.374 45.249 18.016 44.972 18.519 44.619 C 19.048 44.267 19.564 43.789 20.067 43.185 C 20.596 42.58 20.961 41.863 21.162 41.032 C 21.389 40.176 21.502 39.27 21.502 38.314 L 21.502 4.254 C 21.502 3.424 20.961 2.82 19.878 2.442 C 18.796 2.039 17.55 1.838 16.14 1.838 C 12.465 1.838 9.192 2.669 6.323 4.33 C 3.478 5.966 1.678 7.502 0.923 8.937 L -0.059 8.937 L 2.698 0.063 L 45.706 0.063 L 48.123 8.937 Z" fill="#EFECEA"></path></symbol><image id="project__image" xlink:href="data:image/svg+xml;base64,${template}"/></defs></svg>`;
        return response.status(200).contentType('image/svg+xml').send(image);
    }
}

export default controller;