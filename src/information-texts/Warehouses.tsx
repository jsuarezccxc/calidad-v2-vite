import React from 'react';
import { Icon } from '@components/icon';

export const INFORMATION = {
    WAREHOUSE: {
        TITLE: 'Ficha técnica de bodegas',
        DESCRIPTION: (
            <p>
                En esta sección, gestione las bodegas que ha agregado. Para ver el detalle de cada uno, haga clic en el nombre 
                de la bodega. Para eliminar una bodega, seleccione el recuadro de la izquierda de la tabla y después haga clic
                en el icono <Icon name="trashBlue" className="inline w-5 h-5 -mt-1.5 -mx-1"/>. Las bodegas agregadas en esta sección se 
                utilizan para realizar un control de inventario y hacer un seguimiento de los movimientos de compra y venta.
            </p>
        ),
    },
    ADD_WAREHOUSE: {
        TITLE: 'Agregar bodega',
        DESCRIPTION: 'Agregue la información básica para crear una bodega en la ficha técnica. Esta información es relevante para realizar un control de inventario y hacer un seguimiento de los movimientos de compra y venta.',
    },
    EDIT_WAREHOUSE: {
        TITLE: 'Editar bodega ',
        DESCRIPTION: 'Agregue la información requerida para modificar su bodega en ficha técnica.',
    },
    WAREHOUSE_DETAIL: {
        TITLE: 'Detalle de la bodega',
        DESCRIPTION: 'A continuación detalle y edite la información de la bodega.',
    },
};
