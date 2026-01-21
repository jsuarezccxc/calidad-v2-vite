export * from './ArticleCard';
export * from './ModalBlog';
export * from './ArticleComments'

/**
 * This interface describes the properties of component article card
 *
 * @typeParam activeArticle: boolean - Is active article
 * @typeParam returnActive: () => void - Function set return active article
 */
export interface IArticleCardProps {
    activeArticle: boolean;
    returnActive: () => void;
}

/**
 * This interface describes the properties of each card article
 *
 * @typeParam show: boolean - Is active modal
 * @typeParam showModal: () => void - Function set show modal
 */
export interface IModalBlogProps {
    show: boolean;
    showModal: () => void;
}

/**
 * List buttons
 */
export const MODAL_BUTTONS = ['Atrás', 'Guardar'];
