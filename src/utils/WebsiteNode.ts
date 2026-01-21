import { v4 } from 'uuid';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { FontVariant } from '@constants/WebsiteNode';
import { CSSObject } from '@emotion/react';
import {
    IDraggableElement,
    DEFAULT_ELEMENT_STYLE,
    DEFAULT_ELEMENT_SETTING,
    DROP_ZONE,
    MOBILE_DEFAULT_STYLE,
} from '@pages/website-editor/editor/components/drag-and-drop';
import { IGenericRecord } from '@models/GenericRecord';
import { IOptionSelect } from '@components/input';
import { ElementOption, ElementType, IPageWebsite, IWebsite } from '@models/WebsiteNode';
import { FOOTER, HEADER } from './PageTemplates';

interface IElement {
    activePageId?: string;
    option?: ElementOption;
    type: ElementType;
    style?: IGenericRecord;
    value?: string;
    items?: IGenericRecord[];
    setting?: IGenericRecord;
}

export const createDraggableElement = ({
    option = ElementOption.One,
    style = {},
    type,
    value = '',
    setting,
    activePageId = '',
}: IElement): IDraggableElement => {
    const desktopStyle = {
        ...style,
        ...DEFAULT_ELEMENT_STYLE[type],
        ...DEFAULT_ELEMENT_STYLE[`${type}_${option}`],
    };
    return {
        id: v4(),
        pageId: activePageId,
        option,
        type,
        value,
        style: desktopStyle,
        desktopStyle,
        mobileStyle: {
            ...MOBILE_DEFAULT_STYLE[type],
            ...MOBILE_DEFAULT_STYLE[`${type}_${option}`],
        },
        setting: {
            ...(DEFAULT_ELEMENT_SETTING[type] ?? {}),
            ...(DEFAULT_ELEMENT_SETTING[`${type}_${option}`] ?? {}),
            ...setting,
        },
        isNew: true,
    };
};

const cleanString = (text: string): string => text.replace(' ', '').toLowerCase();

export const createStyle = (style: IGenericRecord): CSSObject => {
    if (!style) return {};
    const formattedStyle = { ...style, ...createTextStyle(style) };
    delete formattedStyle.fontWeight;
    return formattedStyle;
};

/**
 * This creates text styles based on an object with CSS properties
 *
 * @param style: IGenericRecord - Text style
 * @returns CSSObject
 */
export const createTextStyle = ({
    fontWeight = 'Regular',
    textAlign = true,
    fontFamily = 'aller',
    fontSize = 16,
    color,
    ...style
}: IGenericRecord): CSSObject => {
    const isRegular = fontWeight === FontVariant.Regular;
    const fontName = `${fontFamily}${isRegular ? '' : cleanString(fontWeight)}`;

    return {
        fontFamily: fontName,
        textAlign: textAlign ? 'start' : 'center',
        fontSize: Number(fontSize),
        color,
        background: style?.background,
    };
};

export const getCenterCoordinates = ({ height, width }: IGenericRecord): { left: string; top: number } => {
    const { clientHeight, clientWidth } = document.querySelector(`#${DROP_ZONE}`) ?? { clientHeight: 0, clientWidth: 0 };
    return { left: convertToPercentage(clientWidth, clientWidth / 2 - width / 2), top: clientHeight / 2 - height / 2 };
};

const convertToPercentage = (total: number, currentValue: number): string => `${(currentValue * 100) / total}%`;

const getCommonElements = (websiteId: string): IGenericRecord[] => [
    {
        name: ElementType.Header,
        type: ElementType.Header,
        value: [{ ...HEADER, isNew: false }],
        class_name: 'element',
        style_desktop: { color: 'black' },
        style_mobile: { color: 'black' },
        website_id: websiteId,
    },
    {
        name: ElementType.Footer,
        type: ElementType.Footer,
        value: [{ ...FOOTER, style: { ...FOOTER.style, top: 1380 }, isNew: false }],
        class_name: 'element',
        style_desktop: { color: 'black' },
        style_mobile: { color: 'black' },
        website_id: websiteId,
    },
];

export const addPageToWebsite = (website: IWebsite, addCommonElements = true): IGenericRecord => {
    const numberOfPage = (website?.pages[website.pages.length - 1]?.order ?? 0) + 1;

    return {
        id: website.id,
        is_draft: website.is_draft,
        is_template: false,
        pages: [
            {
                is_enable: false,
                tab_name: `Página ${numberOfPage} Sitio web`,
                order: numberOfPage,
                style: { background: '#FFFFFF' },
                website_id: website.id,
                elements: [],
            },
        ],
        common_elements: addCommonElements ? getCommonElements(website.id) : [],
    };
};

export const getCurrentPublishMessage = (publishDate: Date, autoSaveTimes: IGenericRecord): string => {
    const currentTime = new Date();
    const minutesDiff = differenceInMinutes(currentTime, publishDate);
    const hoursDiff = differenceInHours(currentTime, publishDate);
    const daysDiff = differenceInDays(currentTime, publishDate);

    if (minutesDiff < autoSaveTimes.sixtySeconds) {
        return `Publicado hace ${minutesDiff} min`;
    }

    if (hoursDiff < autoSaveTimes.valueDay) {
        return `Publicado hace ${hoursDiff} ${hoursDiff === autoSaveTimes.differenceOneDay ? 'hora' : 'horas'}`;
    }

    if (daysDiff < autoSaveTimes.valueMonth) {
        return `Publicado hace ${daysDiff} ${daysDiff === autoSaveTimes.differenceOneDay ? 'día' : 'días'}`;
    }
    return 'Publicado hace más de 1 mes';
};

const formatDraggableElements = (elements: IGenericRecord[] = []): IDraggableElement[] => {
    return elements?.map(element => {
        const draggableElement = element?.value[0];
        return { ...draggableElement, dbId: element.id, isNew: false };
    });
};

export const getPageElements = (page: IPageWebsite, selectedWebsite: IWebsite): IDraggableElement[] => {
    const elements = formatDraggableElements(page?.elements);
    const commonElements = formatDraggableElements(selectedWebsite?.common_elements);
    return [...commonElements, ...elements];
};

export const createProductOptions = (catalog: IGenericRecord[]): IOptionSelect[] =>
    catalog?.map(item => ({
        key: v4(),
        productId: item.id,
        value: item.name,
        name: item.name,
        src: item.unique_product_images[0]?.url ?? '',
        unitValue: item.unit_value,
        categories: item?.category_ids ?? [],
        id: item.id,
    }));

export const getProductData = (
    option: IOptionSelect,
    products: IGenericRecord[]
): { productName: string; productValue: string; src: string; categories: string[] } => {
    const product: IGenericRecord = products.find(product => product.key === option.key) ?? {};
    const { name: productName, unitValue: productValue, src, categories } = product;
    return { productName, productValue, src, categories };
};
