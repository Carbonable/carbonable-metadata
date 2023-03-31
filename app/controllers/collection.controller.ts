import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma, Collection, Image, Token } from '@prisma/client';

const controller = {
    format(data: Collection & {
        image?: Image;
        Token?: Token[];
        _count?: Prisma.CollectionCountOutputType;
    }) {
        return {
            name: data.name,
            description: data.description,
            image: `data:image/png;base64,${data.image.data}`,
            banner_image_url: data.bannerImageUrl,
            external_url: data.externalUrl,
            youtube_url: data.youtubeUrl,
        }
    },

    async create(data: { slot: number, name: string, description: string, externalUrl: string, youtubeUrl: string, imageId: number }) {
        const bannerImageUrl = "ipfs://Qmdjj76nkc1HQn8Tr3ertWs9eWkFMBxXQkGwjHEp6mWbig/banner.png";
        return await prisma.collection.create({ data: { ...data, bannerImageUrl } });
    },

    async read(where: { id?: number, slot?: number, name?: string }, include?: Prisma.CollectionInclude) {
        return await prisma.collection.findUnique({ where, include });
    },

    async update(where: { id?: number, name?: string }, data: { name?: string, description?: string, externalUrl?: string, youtubeUrl?: string, bannerImageUrl?: string, imageId?: number }) {
        return await prisma.collection.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.collection.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const slot = Number(request.params.id);
        const include = { image: true };
        const where = { slot };
        const metadata = await controller.read(where, include);

        if (!metadata) {
            const message = 'collection metadata not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(controller.format(metadata));
    },

    async getAll(_request: Request, response: Response) {
        const include = { image: true };
        const collections = await prisma.collection.findMany({ include });
        return response.status(200).json(collections.map(collection => controller.format(collection)));
    },
}

export default controller;