import { IModalTypeProps } from '@components/modal';
import { TitleButtons } from '@constants/Buttons';
import { PRODUCT_NAME } from '@constants/ProductName';

export const INFORMATION_PAGE = {
    DESCRIPTION: `Desde esta pantalla, habilite el estado de contingencia tipo 03 en ${PRODUCT_NAME} y complete el formulario con la información correspondiente a la contingencia. Luego, haga clic en el botón “Activar contingencia” para iniciar el proceso.`,
};

export const MODAL_TYPE = (onClick: () => void): { [key: string]: Omit<IModalTypeProps, 'open' | 'finalAction'> } => ({
    MODAL_QUESTION: {
        text: {
            title: '¿Está seguro de activar contingencia?',
            description:
                'Al confirmar la activación de la contingencia, todos los clientes de diggi pymes se verán afectados, y las facturas que generen utilizarán el prefijo de contingencia.',
        },
        otherButton: {
            textButton: TitleButtons.CANCEL,
            onClick,
        },
    },
    MODAL_SAVE: {
        text: {
            title: 'Activación de contingencia',
            description: '¡La información sobre activación de la contingencia tipo 3 en diggi pymes ha sido activada con éxito!',
        },
    },
});
