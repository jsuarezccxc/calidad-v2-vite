import { IconsNames } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';

export * from './PageTitle';

/**
 * Properties that page title component receives
 * @typeParam title: string - Page's title
 * @typeParam classContainer: string - Optional class container
 * @typeParam classTitle: string - Optional class title
 * @typeParam pageContent: string - optional prop that indicates the content of the page
 */
export interface IPageTitleProps {
    title: string;
    classContainer?: string;
    classTitle?: string;
    pageContent?: string;
}

/**
 * Properties that page title component receives
 * @typeParam title: string - page's title
 * @typeParam classContainer: string - optional prop to manage the class container
 * @typeParam classTitle: string - optional prop to manage the class title
 */
export interface IPageTitleProps {
    title: string;
    classContainer?: string;
    classTitle?: string;
}

/**
 * Properties that page icon title component receives
 * @typeParam id: string - id for the container
 * @typeParam icon: string - IconsNames
 * @typeParam title: string - page's title
 * @typeParam size: string - page's title size
 * @typeParam classContainer: string - Optional classes page's title
 */
export interface IIconTitleProps {
    id: string;
    icon?: IconsNames;
    label: string | IGenericRecord;
    size?: 'small' | 'medium' | 'large';
    classContainer?: string;
}
