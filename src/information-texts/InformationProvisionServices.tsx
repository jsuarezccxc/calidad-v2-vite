import React from 'react';
import { Icon } from '@components/icon';

export const PROVISION_SERVICES = {
    DESCRIPTION_INFORMATION_PROVISION_SERVICES: (
        <>
            <p className="text-gray-dark mb-4.5">
                Seleccione en la siguiente tabla las ciudades en las que tiene cobertura para la prestación de sus servicios.
            </p>
            <p className="text-gray-dark">
                En caso de que un cliente agregue al carrito de compras uno de sus servicios desde la tienda virtual y este no se
                encuentre ubicado en una de las ciudades que agregó en la tabla, se le informará que no es posible realizar la
                compra porque no hay cobertura de envío. Más adelante puede{' '}
                <strong className="font-allerbold">editar o actualizar</strong> la información que ha subido con anterioridad en
                los campos habilitados.
            </p>
            <div className="flex w-full mt-4.5">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Para agregar un departamento haga click en
                    <span className="text-green"> +Agregar departamento.</span>
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Para agregar una ciudad haga click en
                    <span className="text-green"> +Agregar ciudad.</span>
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Si desea eliminar una de las ciudades, seleccione la casilla correspondiente y haga click en el ícono
                    <Icon name="trashBlue" className="inline w-4.25 h-4.25" />.
                </p>
            </div>
        </>
    ),
    MODAL_DELETE: (
        <div className="flex flex-col justify-between h-full lg:w-full xs:mb-10 xs:h-full xs:justify-center">
            <p className="text-gray-dark">¿Está seguro de eliminar los elementos seleccionados?</p>
            <br />
            <p className="text-gray-dark">Los elementos eliminados son llevados a la papelera.</p>
        </div>
    ),
    MODAL_INACTIVITY: (
        <p>
            Ha superado el tiempo límite de inactividad, por motivos de seguridad diggi pymes lo ha re direccionado a la pantalla
            Planes de pago.
        </p>
    ),
};
