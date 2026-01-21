import { useState } from 'react';

/**
 * This interface describes the modal list
 *
 * @typeParam [key: string]: boolean - Boolean that show and hide the modal
 */
export interface IModals {
    [key: string]: boolean;
}

/**
 * This interface describes the properties that the useModal return
 *
 * @typeParam activeModal: string - Active modal
 * @typeParam modals: IModals - Modal list
 * @typeParam toggleModal: (modalActive: string) => void - Function that change the current modal active
 */
interface IUseModal {
    activeModal: string;
    modals: IModals;
    toggleModal: (modalActive: string) => void;
}

/**
 * Custom hook that save a modal list and toggle the modal active send as argument
 *
 * @typeParam initialState: IModals - Initial state with the modal list
 * @returns IUseParam
 */
const useModal = (initialState: IModals): IUseModal => {
    const [activeModal, setActiveModal] = useState<string>('');
    const [modals, setModals] = useState<IModals>(initialState);

    const toggleModal = (modal: string): void => {
        const hiddenModals: IModals = {};
        for (const modal in modals) {
            hiddenModals[modal] = false;
        }
        const isActive = !modals[modal];
        setModals({ ...hiddenModals, [modal]: isActive });
        setActiveModal(isActive ? modal : '');
    };

    return { activeModal, modals, toggleModal };
};

export default useModal;
