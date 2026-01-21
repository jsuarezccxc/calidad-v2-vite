import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption } from '@models/WebsiteNode';

export * from './Card';
export * from './Texts';

/**
 * This describes the card props
 *
 * @typeParam className: string - Optional className
 * @typeParam image: string - Card image
 * @typeParam option: ElementOption - Banner option
 * @typeParam product: IGenericRecord - Product
 * @typeParam mobileClassName: string - Mobile class name
 */
export interface ICardProps {
    className?: string;
    image: string;
    option: ElementOption;
    product: IGenericRecord;
    mobileClassName: string;
}

/**
 * This describes the texts props
 *
 * @typeParam description: string - Optional description
 * @typeParam option: ElementOption - Used for elements that have multiple options
 * @typeParam title: string - Title
 * @typeParam className: string - Optional mobile className
 */
export interface ITextsProps {
    description?: string;
    option: ElementOption;
    title: string;
    mobileClassName?: string;
}
