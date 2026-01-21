import { IconsNames } from '@components/icon';
import { ModalType } from '@constants/Modal';

export * from './Modal';

/**
 * This interface describes the props for Modal component
 *
 * @typeParam id: string - Id of modal
 * @typeParam handleClose: string - Function to handle close modal
 * @typeParam open: boolean - Prop for know if modal is open or no
 * @typeParam modalClassName: string - Optional class of modal
 * @typeParam children:  React.ReactNode - content of modal
 */
export interface IModalProps {
    id: string;
    handleClose: () => void;
    open: boolean;
    modalClassName?: string;
    children: React.ReactNode;
}

/**
 * This interface describes the props of the shared modal
 *
 * @typeParam moduleId: string - Module Id for modal
 * @typeParam finalAction: () => void - Function to end the action
 * @typeParam handleClosed: () => void - Function to handle close modal
 * @typeParam open: boolean - Prop for know if modal is open or no
 * @typeParam text: { title: string; description: string | JSX.Element } - Optional text with title and description
 * @typeParam type: ModalType - Modal type
 * @typeParam leftButton: { text: string; action: () => void } - Optional left button data
 * @typeParam finishButtonText: string - Optional finish button text
 * @typeParam iconName: IconsNames - Optional icon name
 * @typeParam className: string - Optional class to customize the component
 * @typeParam children: React.ReactNode - Optional children
 */
export interface ISharedModalProps {
    moduleId: string;
    finalAction: () => void;
    handleClosed?: () => void;
    open: boolean;
    text?: { title: string; description: string | JSX.Element };
    type?: ModalType;
    leftButton?: { text: string; action: () => void };
    finishButtonText?: string;
    iconName?: IconsNames;
    className?: string;
    children?: React.ReactNode;
}

/**
 * This interface is for modal type
 *
 * @typeParam iconName?: IconsNames - Option prop icon name
 * @typeParam textButton?: string - Option prop label button
 * @typeParam otherButton?: { textButton: string; onClick: () => void; } - Option prop other button
 * @typeParam isChildText?: boolean - Option prop child component text
 * @typeParam classContent?: string - Option prop style component
 * @typeParam classTitle?: string - Option prop style title
 * @typeParam classModal?: string - Option prop style modal
 */
export interface IModalTypeProps extends ISharedModalProps {
    iconName?: IconsNames;
    textButton?: string;
    otherButton?: {
        textButton: string;
        onClick: () => void;
    };
    isChildText?: boolean;
    classContent?: string;
    classTitle?: string;
    classModal?: string;
}

/**
 * Style of Material UI Modal
 */
export const STYLE_MODAL = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
};

/**
 * Default shared modal props
 */
export const SHARED_MODAL_PROPS: { [key in ModalType]: { text: { title: string; description: string }; icon: IconsNames } } = {
    [ModalType.Success]: {
        text: { title: 'Información guardada', description: '¡Su información ha sido guardada con éxito!' },
        icon: 'check',
    },
    [ModalType.Delete]: {
        text: {
            title: 'Eliminar producto/servicio',
            description: '¿Está seguro que desea eliminar los elementos seleccionados?',
        },
        icon: 'trashMulticolor',
    },
    [ModalType.Information]: {
        text: { title: 'Información', description: '' },
        icon: 'triangleInfoMulticolor',
    },
};
