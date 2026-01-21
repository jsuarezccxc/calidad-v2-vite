import { Routes } from '@constants/Paths';
import { IWebsite } from '@models/WebsiteNode';

export * from './WebsiteCard';

/**
 * Interface props from webside card props component
 *
 * @typeParam plan: string - Name plan
 * @typeParam website: IWebsite | null - Data from current website user
 * @typeParam domain: string - Domain website
 * @typeParam handleRedirect: (path: Routes | string, openWindow?: boolean) => void - Action to redirect from buttons
 */
export interface IWebsiteCardProps {
    plan: string
    website: IWebsite | null;
    domain: string
    handleRedirect: (path: Routes | string, openWindow?: boolean) => void;
}

/**
 * Current state of website
 */
export enum StateWebsite {
    PUBLISHED = 'Publicado',
    PENDING = 'Pendiente por publicar'
}
