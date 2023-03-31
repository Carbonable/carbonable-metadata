import prisma from '../models/database/client';

import { Request, Response } from 'express';
import { Prisma, Token, Image, Attribute } from '@prisma/client';

import imageController from './image.controller';
import attributeController from './attribute.controller';

const controller = {
    format(data: Token & {
        image?: Image;
        attribute?: Attribute[];
        _count?: Prisma.TokenCountOutputType;
    }, image: string) {
        return {
            name: data.name,
            description: data.description,
            image,
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

    async create(data: { name: string, description: string, externalUrl: string, youtubeUrl: string, imageId: number, collectionSlot: number, attributes: { display_type: string, trait_type: string, value: string | number }[] }) {
        const token = await prisma.token.create({
            data: {
                name: data.name,
                description: data.description,
                externalUrl: data.externalUrl,
                youtubeUrl: data.youtubeUrl,
                imageId: data.imageId,
                collectionSlot: data.collectionSlot,
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

    async read(where: { id?: number, name?: string, collectionSlot?: number }, include?: Prisma.TokenInclude) {
        return await prisma.token.findUnique({ where, include });
    },

    async update(where: { id?: number, name?: string, collectionSlot?: number }, data: { name?: string, description?: string, externalUrl?: string, youtubeUrl?: string, imageId?: number, collectionId?: number }) {
        return await prisma.token.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.token.delete({ where });
    },

    async getOne(request: Request, response: Response) {
        const collectionSlot = Number(request.params.id);
        const decimals = Number(request.query.decimals);
        const value = Number(request.query.value);

        const include = { image: true, attribute: true };
        const where = { collectionSlot };
        const metadata = await controller.read(where, include);

        if (!metadata) {
            const message = 'token metadata not found';
            const code = 404;
            return response.status(code).json({ message, code });
        }

        // const image = `https://dev-carbonable-metadata.fly.dev/collection/${collectionSlot}/image?value=${value}&decimals=${decimals}`;
        const image = `http://localhost:8080/collection/${metadata.image.id}/image?value=${value}&decimals=${decimals}`;
        return response.status(200).json(controller.format(metadata, image));
    },

    async getAll(_request: Request, response: Response) {
        const include = { image: true };
        const tokens = await prisma.token.findMany({ include });
        return response.status(200).json(tokens);
    },
}

export default controller;