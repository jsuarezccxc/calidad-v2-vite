import { IOptionSelect } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';

export * from './ButtonModal';
export * from './CarouselEditor';
export * from './ContentItem';
export * from './ImageModal';

/**
 * This interface describes the props of the content items
 *
 * @typeParam content: IGenericRecord - Content data
 * @typeParam productOptions: IOptionSelect[] - Product options
 * @typeParam updateContent: (content: IGenericRecord) => void - Function to update content
 * @typeParam validate: boolean - This indicates when to validate the fields
 * @typeParam index: number - Content index
 */
export interface IContentItemProps {
    content: IGenericRecord;
    productOptions: IOptionSelect[];
    updateContent: (content: IGenericRecord) => void;
    validate: boolean;
    index: number;
}

/**
 * This interface describes the props of the button modal
 *
 * @typeParam button: IButton - Button data
 * @typeParam toggleModal: () => void - Used to toggle the modal
 * @typeParam updateButton: (button: IButton, content?: IGenericRecord) => void - Function to update the button
 * @typeParam saveButton: () => void - Used to save the button
 */
export interface IButtonModalProps {
    button: IButton;
    toggleModal: () => void;
    updateButton: (button: IButton, content?: IGenericRecord) => void;
    saveButton: () => void;
}

/**
 * This interface describes the props of the image
 *
 * @typeParam description: string - Optional description
 * @typeParam edited: boolean - Optional boolean indicating whether an image is edited
 * @typeParam id: string - Image id
 * @typeParam isProduct: boolean - This indicates whether the image belongs to a product
 * @typeParam number: number - Image number used to keep track of them
 * @typeParam productName: string - Optional product name
 * @typeParam productValue: string - Optional product value
 * @typeParam showProductData: boolean - This is optional and indicates when to show the product data
 * @typeParam src: string - Image src
 * @typeParam title: string - Optional title
 * @typeParam category: IGenericRecord - Image category
 * @typeParam categories: string[] - Image categories
 * @typeParam nameImage: string - Optional name image
 * @typeParam productId: string - Optional product id
 * @typeParam page: { value: string; id: string } - Optional page slide fifteen
 * @typeParam categoryCatalog: string - Optional product id
 * @typeParam optionCategories: IOptionSelect[] - Optional option categories
 */
export interface IImage {
    description?: string;
    edited?: boolean;
    id: string;
    isProduct: boolean;
    number: number;
    productName?: string;
    productValue?: string;
    showProductData?: boolean;
    src: string;
    title?: string;
    category: IGenericRecord;
    categories: string[];
    nameImage?: string;
    productId?: string;
    page?: { value: string; id: string };
    categoryCatalog?: string;
    optionCategories?: IOptionSelect[];
}

/**
 * This interface describes the props of the image modal
 *
 * @typeParam elementOption: ElementOption - Element option
 * @typeParam image: IImage - Image data
 * @typeParam saveImage: () => void - This is used to save an image
 * @typeParam toggleModal: () => void - This is used to toggle the modal
 * @typeParam updateImage: (image: IImage) => void - Function used to update an image
 * @typeParam handleImageFifteen: (item: IOptionSelect) => void - Function used toggleModal
 * @typeParam dataCarouselFifteen:{ fifteenCarouselImages: IImage[] checkedCategory: string[] } - Data carousel fifteen
 * @typeParam handleCarouselFifteen: (option: string; id:string) => void - Function used carousel fifteen
 *
 */
export interface IImageModalProps {
    elementOption: ElementOption;
    image: IImage;
    saveImage: () => void;
    toggleModal: () => void;
    updateImage: (image: IImage) => void;
    handleImageFifteen: (item: IOptionSelect, id: string) => void;
    dataCarouselFifteen: {
        fifteenCarouselImages: IImage[];
        checkedCategory: string[];
    };
    handleCarouselFifteen: (option: string, id?: string) => void;
}

/**
 * This interface describes the props of the button
 *
 * @typeParam name: string - Button name
 * @typeParam number: number - Button number
 * @typeParam contents: IGenericRecord[] - Button contents
 * @typeParam id: string - Button id
 * @typeParam edited: boolean - This indicates if the button is edited
 */
export interface IButton {
    name: string;
    number: number;
    contents: IGenericRecord[];
    id: string;
    edited: boolean;
}

/**
 * Used to set the initial state
 */
export enum ActiveModal {
    Button = 'BUTTON',
    Image = 'IMAGE',
    Cropper = 'CROPPER',
}

/**
 * Used to set the initial state
 */
export const DEFAULT_IMAGE: IImage = {
    id: '',
    description: '',
    number: 1,
    isProduct: false,
    src: '',
    title: '',
    productName: '',
    showProductData: false,
    productValue: '',
    edited: false,
    category: {},
    categories: [],
    productId: '',
    page: { value: '', id: '' },
    categoryCatalog: '',
    optionCategories: [],
};

/**
 * Key to save images in the configuration object
 */
export const IMAGES = 'images';

/**
 * Carousels with background
 */
export const CAROUSELS_WITH_BACKGROUND = [ElementOption.Two, ElementOption.Four, ElementOption.Thirteen];

/**
 * Used to set the initial state
 */
export const DEFAULT_CONTENT = {
    id: '',
    checked: false,
    description: '',
    number: 1,
    isProduct: false,
    src: '',
    title: '',
    productName: '',
    showProductData: false,
    productValue: '',
    edited: false,
};

/**
 * Used to set the initial state of the button
 */
export const DEFAULT_BUTTON = {
    name: '',
    number: 1,
    contents: [],
    id: '',
    edited: false,
};

/**
 * Editor modals
 */
export const MODALS: { [key in ActiveModal]: boolean } = {
    [ActiveModal.Button]: false,
    [ActiveModal.Image]: false,
    [ActiveModal.Cropper]: false,
};

/**
 * This returns the input texts
 *
 * @param option: ElementOption - Carousel option
 * @param hasBackground: boolean - This indicates if the element has a background
 * @returns { title: string, description: string }
 */
export const getInputTexts = (option: ElementOption, hasBackground: boolean): { title: string; description: string } => {
    if (option === ElementOption.Fourteen)
        return {
            title: 'Título contenido',
            description: 'Descripción contenido',
        };

    return {
        title: hasBackground
            ? 'Título de la imagen/Nombre producto o servicio y Descripción de la imagen/Valor unitario '
            : 'Título de la imagen/Nombre producto o servicio',
        description: 'Descripción de la imagen/Valor unitario productos/servicios',
    };
};

/**
 * This constant min select
 */
export const MaxMinSelect = { MinSelect: 0, MaxSelect: 40 };

/**
 * This default category
 */
export const OPTION_DEFAULT_CATEGORY = {
    key: '0',
    id: '',
    value: '',
    multiSelectCheck: {
        value: false,
    },
};

/**
 * Used to set the function images
 */
export const FunctionImages = {
    AddImage: 'addImage',
    DeleteItem: 'deleteItem',
    DeleteImage: 'deleteImage',
};

/**
 * Used to set the type input
 */
export const TypeInput = {
    Category: 'category',
    Page: 'page',
};

/**
 * Max images carousel five
 */
export const MAX_IMAGE_CAROUSEL = 10;
