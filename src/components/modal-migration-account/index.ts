export * from './ModalMigrationAccount';

/**
 * This interface describes what properties the custom modal component receives
 *
 * @typeParam isOpen: boolean - Show State boolean to show modal
 * @typeParam handleOpenModalMigration: () => void - ShowModal Function to change state of modal
 */
export interface IModalMigrationAccountProps {
    isOpen: boolean;
    handleOpenModalMigration: () => void;
}

// Url for redirect
export const URL_REDIRECT = 'https://develop-app.diggipymes.co';
