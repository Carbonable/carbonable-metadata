import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma, Token, Image, Attribute } from '@prisma/client';

import attributeController from './attribute.controller';

const controller = {
    format(data: Token & {
        image?: Image;
        attribute?: Attribute[];
        _count?: Prisma.TokenCountOutputType;
    }) {
        return {
            name: data.name,
            description: data.description,
            image: `data:image/png;base64,${data.image.data}`,
            external_url: data.externalUrl,
            youtube_url: data.youtubeUrl,
            attributes: data.attribute.map((attribute) => {
                return {
                    display_type: attribute.displayType,
                    trait_type: attribute.traitType,
                    value: attribute.traitType === 'number' ? Number(attribute.value) : attribute.value,
                }
            })
        }
    },

    async create(data: { name: string, description: string, externalUrl: string, youtubeUrl: string, imageId: number, collectionId: number, attributes: { display_type: string, trait_type: string, value: string | number }[] }) {
        const token = await prisma.token.create({
            data: {
                name: data.name,
                description: data.description,
                externalUrl: data.externalUrl,
                youtubeUrl: data.youtubeUrl,
                imageId: data.imageId,
                collectionId: data.collectionId,
            }
        });
        for (const attribute of data.attributes) {
            await attributeController.create({
                displayType: attribute.display_type,
                traitType: attribute.trait_type,
                value: `${attribute.value}`,
                metadataId: token.id,
            });
        }
        return token;
    },

    async read(where: { id?: number, name?: string, collectionId?: number }, include?: Prisma.TokenInclude) {
        return await prisma.token.findUnique({ where, include });
    },

    async update(where: { id?: number, name?: string, collectionId?: number }, data: { name?: string, description?: string, externalUrl?: string, youtubeUrl?: string, imageId?: number, collectionId?: number }) {
        return await prisma.token.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.token.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const collectionId = Number(request.params.id);
        const decimals = Number(request.params.decimals);
        const value = Number(request.params.value);

        const include = { image: true, attribute: true };
        const where = { collectionId };
        const metadata = await controller.read(where, include);

        if (!metadata) {
            const message = 'token metadata not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        return response.status(200).json(controller.format(metadata));
    },

    async getAll(_request: Request, response: Response) {
        const include = { image: true };
        const tokens = await prisma.token.findMany({ include });
        return response.status(200).json(tokens);
    },
}

export default controller;