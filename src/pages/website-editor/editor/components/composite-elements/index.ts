import { IEditedData } from '@models/WebsiteNode';

export { Banner } from './banner';
export { Blog } from './blog';
export { Carousel } from './carousel';
export { Catalog } from './catalog';
export { Collage } from './collage';
export { Form } from './form';
export { Footer } from './footer';
export { Header } from './header';
export { Slider } from './slider';

/**
 * Function returns edited data
 *
 * @param data: IEditedData[] - Current data
 * @param type: string - Type component
 * @returns IEditedData
 */
export const getDataEdited = (data: IEditedData[], type: string): IEditedData => {
    return (
        data?.find(item => item.component === type) || {
            component: '',
            titlePages: { typography: 'aller', weight: '400', size: '16', color: '#0B2C4C' },
            backgroundColor: '#F4F4F4',
            description: '',
            isButtonForm: false,
        }
    );
};
