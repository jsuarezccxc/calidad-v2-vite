/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconsNames } from '@components/icon';
import { ChangeEvent } from '@components/input';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption, ElementType } from '@models/WebsiteNode';

export * from './AddSocialNetwork';
export * from './EditInput';
export * from './Field';
export * from './FormFields';
export * from './ItemField';
export * from './ModalForm';
export * from './TextFields';

/**
 * This interface describes the props for EditInput
 *
 * @typeParam placeholder: string - Optional Prop for Placeholder in input
 * @typeParam value: string - Value of input
 * @typeParam handleChange: (e: ChangeEvent) => void - Function to handle value change
 * @typeParam wrapperClassName: string - Optional prop for handle className wrapper
 * @typeParam handleClickIcon: ({ ...arg }?: React.MouseEvent<HTMLImageElement> | IGenericRecord, ...args: IGenericRecord[]) => void - Optional prop with a function executed when icon is clicked
 * @typeParam handleClickIconTrash: ({ ...arg }?: React.MouseEvent<HTMLImageElement> | IGenericRecord, ...args: IGenericRecord[]) => void - Optional prop with a function executed when icon is clicked
 * @typeParam iconName: IconsNames - Optional label text
 * @typeParam name: string - Optional prop for name input
 * @typeParam iconTrash: boolean - Optional prop for trash icon
 * @typeParam handleChange: (e: ChangeEvent) => void - Optional function to handle blur change
 */
export interface IEditInputProps {
    placeholder?: string;
    value: string;
    handleChange: (e: ChangeEvent) => void;
    wrapperClassName?: string;
    handleClickIcon?: ({ ...arg }?: React.MouseEvent<HTMLImageElement> | IGenericRecord, ...args: IGenericRecord[]) => void;
    handleClickIconTrash?: ({ ...arg }?: React.MouseEvent<HTMLImageElement> | IGenericRecord, ...args: IGenericRecord[]) => void;
    iconName?: IconsNames;
    name?: string;
    iconTrash?: boolean;
    handleBlurChange?: (e: ChangeEvent) => void;
}

/**
 * This interface describes the props for ModalFom component
 *
 * @typeParam handleClose: string - Function to handle close modal
 * @typeParam open: boolean - Prop for know if modal is open or no
 */
export interface IModalFormProps {
    handleClose: () => void;
    open: boolean;
}

/**
 * This describes the props of the text field
 *
 * @typeParam labelText: string - Optional label text
 * @typeParam wrapperClassName: string - Optional className to customize the wrapper
 * @typeParam item: string - Item name
 */
export interface ITextFieldsProps {
    labelText?: string;
    wrapperClassName?: string;
    item: string;
}

/**
 * This describes the props of the form field
 *
 * @typeParam withPlaceholder: boolean - Optional placeholder of title fields
 * @typeParam wrapperClassName: string - Optional className to customize the wrapper
 * @typeParam title: string - Optional title of form field
 * @typeParam itemName: string - Optional name of item for text field
 * @typeParam showModal: () => void - Optional function active modal
 * @typeParam isModal: boolean - Optional if it is modal
 */
export interface IFormFieldsProps {
    withPlaceholder?: boolean;
    wrapperClassName?: string;
    title?: string;
    itemName?: string;
    showModal?: () => void;
    isModal?: boolean;
}

/**
 * This describes the props of the social media
 *
 * @typeParam name: string - Name of social network
 * @typeParam url: string - Url of social network
 * @typeParam icon: IconsNames - Name of social network
 * @typeParam error: boolean - Optional prop for validate input
 * @typeParam messageError: string - Optional prop for show message error
 */
export interface ISocialNetwork {
    name: string;
    url: string;
    icon: IconsNames;
    error?: boolean;
    errorMessage?: string;
}

/**
 * This interface describes the props for EditInput
 *
 * @typeParam deleteField: () => void - Function de delete a field
 * @typeParam enableDeletion: boolean - This indicates whether deletion is enabled
 * @typeParam field: IGenericRecord - Field data
 * @typeParam handleFieldChange: (data: IGenericRecord) => void - This is used to handle changing field values
 */
export interface IFieldProps {
    deleteField: () => void;
    enableDeletion: boolean;
    field: IGenericRecord;
    handleFieldChange: (data: IGenericRecord) => void;
}

/**
 * This interface describes the props of the item field
 *
 * @typeParam deleteItem: (id: string) => void - Function de delete an item
 * @typeParam editItem: (item: any) => void - Used to edit an item
 * @typeParam item: IGenericRecord - Item data
 * @typeParam index: number - Item field number
 * @typeParam text: string - Field text
 */
export interface IItemFieldProps {
    deleteItem: (id: string) => void;
    editItem: (item: any) => void;
    item: IGenericRecord;
    index: number;
    text?: string;
}

/**
 *  list with social media options
 */
export const SOCIAL_NETWORKS: string[] = [
    'Instagram',
    'Facebook',
    'X',
    'Messenger',
    'Tiktok',
    'Linkedin',
    'Snapchat',
    'Pinterest',
    'Youtube',
    'Telegram',
];

/**
 *  Icons in header
 */
export const SOCIAL_NETWORK_HEADER: { [key: string]: IconsNames } = {
    Instagram: 'instagramBlue',
    Facebook: 'facebookBlue',
    X: 'xTwitterBlue',
    Messenger: 'messengerBlue',
    TikTok: 'tikTokBlue',
    Linkedin: 'linkedinBlue',
    Snapchat: 'snapchatBlue',
    Pinterest: 'pinterestBlue',
    Youtube: 'youtubeBlue',
    Telegram: 'telegramBlue',
};

/**
 *  Icons in footer and header
 */
export const SOCIAL_NETWORK_OPTIONS: { [key: string]: { [key: string]: IconsNames } } = {
    [ElementType.Header]: {
        Instagram: 'instagramBlue',
        Facebook: 'facebookBlue',
        X: 'xTwitterBlue',
        Messenger: 'messengerBlue',
        TikTok: 'tikTokBlue',
        LinkedIn: 'linkedinBlue',
        Snapchat: 'snapchatBlue',
        Pinterest: 'pinterestBlue',
        Youtube: 'youtubeBlue',
        Telegram: 'telegramBlue',
    },
    [ElementType.Footer]: {
        Instagram: 'instagramWhite',
        Facebook: 'facebookWhite',
        X: 'xTwitterWhite',
        Messenger: 'messengerWhite',
        TikTok: 'tikTokWhite',
        LinkedIn: 'linkedInWhite',
        Snapchat: 'snapchatWhite',
        Pinterest: 'pinterestWhite',
        Youtube: 'youtubeWhite',
        Telegram: 'telegramWhite',
    },
};

/**
 *  Limit of social networks
 */
export const SOCIAL_NETWORKS_LIMIT = 3;

/**
 *  Form fields limit
 */
export const FORM_FIELDS: { [key: string]: number } = {
    [ElementOption.One]: 5,
    [ElementOption.Two]: 5,
    [ElementOption.Four]: 4,
};

/**
 * This buttons modal
 */
export const modalButtons = ['Atrás', 'Guardar'];
