import prisma from '../models/database/client';

const controller = {

    async create(data: { displayType: string, traitType: string, value: string, metadataId: number }) {
        return await prisma.attribute.create({ data });
    },

    async update(where: { id?: number }, data: { displayType?: string, traitType?: string, value?: string, metadataId?: number }) {
        return await prisma.attribute.update({ where, data });
    },

    async delete(where: { id?: number }) {
        return await prisma.attribute.delete({ where });
    },

}

export default controller;