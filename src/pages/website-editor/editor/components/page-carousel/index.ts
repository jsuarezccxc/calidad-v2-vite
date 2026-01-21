import { BASIC_PLAN, STANDARD_PLAN } from '@constants/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { IPageWebsite, IWebsite } from '@models/WebsiteNode';

export * from './PageCarousel';

/**
 * This describes the carousel button props
 *
 * @typeParam page: IPageWebsite - Page that brings the data of the button
 * @typeParam onClick: (page: IPageWebsite) => void - Action to get current page
 * @typeParam id: string - Id for recognize button
 */
export interface IButtonProps {
    page: IPageWebsite;
    onClick: (page: IPageWebsite) => void;
    id: string;
}

/**
 * Number for dele page without show modal
 */
export const TWO = 2

/**
 * This describes the carousel button props
 *
 * @typeParam anchorEl: HTMLElement | null - Reference to Popper
 * @typeParam handlePageTitle: () => void - Function to handle the action when the page title button is clicked
 * @typeParam handleDeletePage: () => void - Function to handle the action when the delete page button is clicked
 * @typeParam handleDuplicatePage: () => void - Function to handle the action when the duplicate page button is clicked
 * @typeParam closePopper: () => void - Function to close Popper
 */
export interface IPageTitlePopperProps {
    anchorEl: HTMLElement | null;
    handlePageTitle: () => void;
    handleDeletePage: () => void;
    handleDuplicatePage: () => void;
    closePopper: () => void;
}

/**
 * Style for divider of Material UI
 */
export const dividerStyle: React.CSSProperties = { borderColor: '#0B2C4C', margin: '0.25rem 0' };

/**
 * Page carousel settings
 */
export const CAROUSEL_SETTINGS = (website: IWebsite): IGenericRecord => ({
    className: 'slider custom-slider',
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    dots: false,
    slidesToShow: website?.pages?.length >= 3 ? 3 : website?.pages?.length,
});

/**
 * Page limit in basic plan
 */
const PAGE_LIMIT_BASIC_PLAN = 2;

/**
 * function that returns a boolean that tells me if the limit of pages of the basic plan has been reached
 *
 * @param numberOfCurrentPages: number - Number of pages on the websiteSelected
 * @param planWebsiteActive: string | undefined - Plan website active
 * @returns boolean
 */
export const isPageLimitBasicPlan = (numberOfCurrentPages: number, planWebsiteActive = ''): boolean => {
    return (
        (planWebsiteActive === BASIC_PLAN || planWebsiteActive === STANDARD_PLAN) && numberOfCurrentPages >= PAGE_LIMIT_BASIC_PLAN
    );
};
