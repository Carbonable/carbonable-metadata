import * as fs from 'fs';
import * as path from 'path';

import collection from './collection.controller';
import token from './token.controller';
import image from './image.controller';

const ROOT = 'public/data';

const controller = {

    async init() {
        fs.readdir(ROOT, (err, folders) => {
            folders.forEach((name) => {
                const folder = path.join(ROOT, name);
                const slot = parseInt(name);
                fs.readdir(folder, async (err, files) => {
                    let file: string;
                    let data: { name: string, description: string, external_url: string, youtube_url: string, attributes: { display_type: string, trait_type: string, value: string | number }[] };

                    // Handle collection image
                    file = files.find(file => file === 'collection.png');
                    let collectionImage = await image.read({ path: path.join(folder, file) });
                    if (!collectionImage) {
                        collectionImage = await image.create({ path: path.join(folder, file) });
                    }

                    // Handle collection
                    file = files.find(file => file === 'metadata.json');
                    data = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
                    let collectionData = await collection.read({ name: data.name });
                    if (!collectionData) {
                        collectionData = await collection.create({
                            slot,
                            name: data.name,
                            description: data.description,
                            externalUrl: data.external_url,
                            youtubeUrl: data.youtube_url,
                            imageId: collectionImage.id
                        });
                    };

                    // Handle token image
                    file = files.find(file => file === 'token.png');
                    let tokenImage = await image.read({ path: path.join(folder, file) });
                    if (!tokenImage) {
                        tokenImage = await image.create({ path: path.join(folder, file) });
                    };

                    // Handle token
                    file = files.find(file => file === 'token.json');
                    data = JSON.parse(fs.readFileSync(path.join(folder, file), 'utf8'));
                    const tokenData = await token.read({ name: data.name });
                    if (!tokenData) {
                        await token.create({
                            name: data.name,
                            description: data.description,
                            externalUrl: data.external_url,
                            youtubeUrl: data.youtube_url,
                            imageId: tokenImage.id,
                            collectionSlot: collectionData.slot,
                            attributes: data.attributes,
                        });
                    };
                });
            });
        });
    },
}

export default controller;