import { TEMPLATE_INFORMATION } from '@information-texts/WebsiteElements';
import { ElementOption, TemplateType } from '@models/WebsiteNode';

export * from './ImageCarousel';
export * from './InformativeModal';
export * from './Title';
export * from './TemplateOptions';

/**
 * This describes the props of the image carousel
 *
 * @typeParam selectTemplate: (option: ElementOption) => void - Function to select a template
 * @typeParam templateType: TemplateType - Template type used to get the images
 */
export interface IImageCarouselProps {
    selectTemplate: (option: ElementOption) => void;
    templateType: TemplateType;
}

/**
 * This describes the props of the informative modal
 *
 * @typeParam selectedTemplate: (option: ElementOption) => void - Selected template
 * @typeParam toggleModal: () => void - This is used to toggle the modal
 */
export interface IInformativeModalProps {
    selectedTemplate: ElementOption;
    toggleModal: () => void;
}

/**
 * This describes the props of the title
 *
 * @typeParam information: string - Template information
 * @typeParam title: string - Template title
 */
export interface ITitleProps {
    information: string;
    title: string;
}

/**
 * This returns the template information based on type
 *
 * @param templateType: TemplateType - TemplateType
 * @returns ITitleProps
 */
export const getTemplateInformation = (templateType: TemplateType): ITitleProps => {
    const data = TEMPLATE_INFORMATION[templateType];
    return {
        title: data.TITLE,
        information: data.INFORMATION,
    };
};

/**
 * This returns the image options with the help of limits
 *
 * @param templateType: TemplateType - TemplateType
 * @returns ElementOption[]
 */
export const getImageOptions = (templateType: TemplateType): ElementOption[] => {
    const { start, final } = TEMPLATE_IMAGES_LIMITS[templateType];
    return Object.values(ElementOption).slice(start, final);
};

/**
 * Carousel settings
 */
export const CAROUSEL_SETTINGS = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
};

/**
 * These are the limits of the images of each type of templates
 */
const TEMPLATE_IMAGES_LIMITS = {
    [TemplateType.Homepage]: { start: 0, final: 2 },
    [TemplateType.CompanyInformation]: { start: 2, final: 5 },
    [TemplateType.OnlineStore]: { start: 5, final: 10 },
};
