import { ElementOption } from '@models/WebsiteNode';

export * from './Collage';

/**
 * Number of images in every collage
 */
export const COLLAGE_OPTION: { [key: string]: number } = {
    [ElementOption.One]: 9,
    [ElementOption.Two]: 5,
    [ElementOption.Three]: 2,
    [ElementOption.Four]: 9,
    [ElementOption.Five]: 7,
    [ElementOption.Six]: 9,
    [ElementOption.Seven]: 6,
};
