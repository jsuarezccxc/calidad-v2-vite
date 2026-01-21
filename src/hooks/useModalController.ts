import { useState } from 'react';

/**
 * Interface representing the controller for modal visibility state
 *
 * @typeParam isModalOpen: boolean - Indicates if the modal is currently open
 * @typeParam toggleModal: () => void - Function to toggle the modal open/closed state
 */
interface IUseModalController {
    isModalOpen: boolean;
    toggleModal: () => void;
}

const useModalController = (): IUseModalController => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = (): void => setIsModalOpen(prev => !prev);

    return {
        isModalOpen,
        toggleModal,
    };
};

export default useModalController;
