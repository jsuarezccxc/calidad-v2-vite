export { default } from './ModalSaveNext';
/**
 * This interface describes the properties ModalSaveNext component receives
 *
 * @typeParam id: string - Id for recognize modal
 * @typeParam show: boolean - Optional Show is a boolean to show modal
 * @typeParam closeIcon: boolean - Optional prop to show modal icon
 * @typeParam showModal: () => void - Optional ShowModal Function to change state of modal
 * @typeParam setOpenShowModal: () => void - Optional open modal save
 * @typeParam data:() => void - Require function save
 * @typeParam onClick: () => void - Optional click handler
 */
export interface IModalSave {
    id: string;
    show?: boolean;
    closeIcon?: boolean;
    showModal?: () => void;
    setOpenShowModal?: () => void;
    data: () => void;
    onClick: () => void;
}
