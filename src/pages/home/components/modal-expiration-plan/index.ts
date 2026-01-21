export * from './ModalExpirationPlan';

/**
 * Interface props from modal expiration plan
 * @param show: boolean - State to show modal
 * @param showModal: () => void - Action to show modal
 * @param handleMainAction: () => void - Action when you click in main button
 * @param remembered: boolean - State to know if this information was shown to the user
 */
export interface IModalExpirationPlan {
    show: boolean;
    showModal: () => void;
    handleMainAction: () => void;
    remembered: boolean;
}
