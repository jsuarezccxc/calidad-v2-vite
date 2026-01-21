export { default } from './CardArticle';

/**
 * This interface describes the properties of a card article component.
 * @typeParam id: string - Id for recognize card article
 * @typeParam title: string - The title of the card article.
 * @typeParam classTitle: string - CSS class for the title element.
 * @typeParam classCard: string - CSS class for the card element.
 * @typeParam children: JSX.Element - The content of the card article.
 */
export interface ICardArticle {
    id: string;
    title?: string;
    classTitle?: string;
    classCard?: string;
    children: JSX.Element;
}
