export * from './ReplacementModal';

/**
 * This describes the props of the replacement modal
 *
 * @typeParam acceptChanges: () => void - Selected template
 * @typeParam isTemplate: boolean - Selected template
 * @typeParam toggleModal: () => void - This is used to toggle the modal
 */
export interface IReplacementModalProps {
    acceptChanges: () => void;
    isTemplate?: boolean;
    toggleModal: () => void;
}
