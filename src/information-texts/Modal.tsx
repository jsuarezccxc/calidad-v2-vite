import React from 'react';
import { CHECKS_SELECTED } from '@constants/Modal';
import { PRODUCT_NAME } from '@constants/ProductName';
import { IGenericRecord } from '@models/GenericRecord';

export const USAGE_MESSAGE = (startMessage: string, registerMessage: string): string => {
    return `${startMessage} ${PRODUCT_NAME} ${registerMessage} `;
};

export const MODAL_INFORMATION = {
    DELETE_TITLE: 'Eliminar',
    DELETE_DESCRIPTION: (
        <>
            <p>¿Está seguro que desea eliminar el elemento seleccionado?</p>
            <p className="mt-5">El elemento seleccionado es llevado a la papelera.</p>
        </>
    ),
    DELETE_TEXT: (items: number, item: IGenericRecord): React.ReactElement => {
        const isOnlyOne = items === 1;
        return (
            <>
                <p>
                    ¿Está seguro de eliminar {isOnlyOne ? 'el elemento' : 'los elementos'} seleccionado{isOnlyOne ? '' : 's'}?
                </p>
                <p className="mt-4.5">
                    {isOnlyOne
                        ? 'El elemento seleccionado es llevado a la papelera'
                        : 'Los elementos eliminados son llevados a la papelera'}
                    .
                </p>
                {!item.update && (
                    <p className="mt-4.5">Al eliminar todos los elementos será redirigido a la pantalla anterior.</p>
                )}
            </>
        );
    },
    INFO_TITLE: 'Definición de términos',
    SAVE_TITLE: 'Información guardada',
    SAVE_DESCRIPTION: '¡Su información ha sido guardada con éxito!',
    WARNING_TITLE: 'Advertencia',
};

export const DELETE_DESCRIPTION_NUMBER = (
    elements: number,
    showElements = true,
    translate?: (key: string) => void,
    showTrashMessage = true
): JSX.Element => (
    <>
        <p>
            ¿{translate ? translate('modal.are-you-sure-to-delete') : 'Está seguro que desea eliminar'} &nbsp;
            {elements === CHECKS_SELECTED
                ? 'el elemento seleccionado'
                : `los ${showElements ? elements : ''} elementos seleccionados`}
            ?
        </p>
        {showTrashMessage && (
            <p className="mt-4.5">
                {elements === CHECKS_SELECTED ? 'El elemento eliminado es llevado' : 'Los elementos eliminados son llevados'}
                &nbsp; a la papelera.
            </p>
        )}
    </>
);

export const MODAL_TEXTS = {
    NOT_SAVED: {
        title: 'Información',
        description: (
            <p>
                ¿Desea guardar la información antes de continuar? <br />
                <br />
                Si desea guardar la información haga click en <span className="font-allerbold">Guardar</span>, de lo contrario,
                haga click en <span className="font-allerbold">Siguiente</span>
            </p>
        ),
    },
};

export const MODAL_WARNING_SUPPLIER = {
    TITLE: 'Datos registrados',
    DESCRIPTION: (
        <>
            Actualmente se encuentra registrado los datos del proveedor. <br />
            Si desea editar al proveedor registrado haga click en el botón de “Editar proveedor”
        </>
    ),
    TITLE_BUTTON: 'Editar proveedor',
};

export const MODAL_WARNING_CLIENT = {
    TITLE: 'Datos registrados',
    DESCRIPTION: (
        <>
            Actualmente se encuentra registrado los datos del cliente. <br />
            Si desea editar al cliente registrado haga click en el botón de “Editar cliente”
        </>
    ),
    TITLE_BUTTON: 'Editar cliente',
};
