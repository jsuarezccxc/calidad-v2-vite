import React from 'react';
import { Icon } from '@components/icon';

export const PRODUCT_SHIPPING = {
    PRODUCT_SHIPPING_INFORMATION: (
        <>
            <p className="text-gray-dark">
                En esta tabla se recopila toda la información que usted agregó sobre costo de envío, en ella se puede visualizar
                el resumen de esta información. Adicionalmente si encuentra que alguna de la información está errada, o que ya no
                es vigente puede editarla o eliminarla. Estás acciones las puede realizar de la siguiente manera:
            </p>
            <div className="flex w-full">
                <p className="w-auto pl-2 xs:mt-1 md:mt-1 text-gray-dark">
                    • &nbsp; Para editar haga click sobre el ícono
                    <Icon name="editBlue" className="inline w-5 h-5" />
                    que lo llevará a la sección &nbsp;
                    <span className="font-allerbold">Crear tipo de envío</span>
                    &nbsp; donde puede modificar la información para cada tipo de envío.
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 xs:mt-1 md:mt-1 text-gray-dark">
                    • &nbsp; Para eliminar uno o más tipos de envío a la vez, selecciónelos y haga click en el ícono
                    <Icon name="trashBlue" className="inline w-5 h-4" />.
                </p>
            </div>
            <p className="pl-2 xs:mt-1 md:mt-1 text-gray-dark">
                • &nbsp; Para visualizar la tabla resumen por tipo de empresa o país de destino seleccione la opción en el cuadro
                filtrar por.
            </p>
        </>
    ),
    MODAL_DELETE: (
        <div className="flex flex-col justify-between h-full lg:w-full xs:mb-10 xs:h-full xs:justify-center">
            <p className="text-gray-dark">¿Está seguro de eliminar los elementos seleccionados?</p>
            <br />
            <p className="text-gray-dark">Los elementos eliminados son llevados a la papelera.</p>
        </div>
    ),
    MODAL_DELETE_SINGULAR: (
        <div className="flex flex-col justify-between h-full lg:w-full xs:mb-10 xs:h-full xs:justify-center">
            <p className="text-gray-dark">¿Está seguro de eliminar el elemento seleccionado?</p>
            <br />
            <p className="text-gray-dark">El elemento eliminado es llevado a la papelera.</p>
        </div>
    ),
    MODAL_DELETE_HOUR: (
        <div className="flex flex-col justify-between h-full lg:w-full xs:mb-10 xs:h-full xs:justify-center">
            <p className="text-gray-dark">¿Está seguro de eliminar este horario?</p>
        </div>
    ),
    PRODUCT_SHIPPING: (
        <>
            <p className="mb-2 text-gray-dark">
                Una vez haya agregado la empresa de envío y todas las variables en la información del costo de envío para las
                ciudades de destino agregadas, haga click en Guardar para almacenar la información en el sistema. Adicionalmente,
                al hacer click en el botón Guardar, tiene la opción de agregar información de otra bodega con la misma empresa de
                envío o de cambiar la empresa de envío.
            </p>
            <div className="flex w-full">
                <p className="w-auto pl-2 xs:mt-1 md:mt-1 text-gray-dark">
                    • &nbsp; Si selecciona la opción agregar bodega, regresará a la sección Crear tipo de envío para seleccionar
                    otra bodega, en el campo correspondiente, con la misma empresa de envío.
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 xs:mt-1 md:mt-1 text-gray-dark">
                    • &nbsp; Si selecciona la opción agregar otra empresa de envío, regresará a la sección Crear tipo de envío
                    para agregar el nombre de la nueva empresa de envío en el campo correspondiente.
                </p>
            </div>
        </>
    ),
    FOREIGN_INFORMATION: (
        <>
            <p className="mb-4.5 text-gray-dark">
                Seleccione los países e ingrese las ciudades a las que va a realizar envíos. Luego, agregue el tiempo estimado de
                entrega para cada ciudad junto con el costo de envío asociado. Tenga en cuenta que el costo de envío agregado para
                cada ciudad será un costo fijo que aplica para todas las zonas de esa ciudad.
            </p>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Para agregar un país de destino haga click en
                    <span className="text-green"> +Agregar país.</span>
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Para agregar una ciudad a un país de destino haga click en
                    <span className="text-green"> +Agregar ciudad.</span>
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Si desea eliminar un país, seleccione la casilla correspondiente y haga click en el ícono
                    <Icon name="trashBlue" className="inline w-4 h-4 mb-1.5" />.
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Si desea eliminar una de las ciudades de un país, seleccione la casilla correspondiente y haga click
                    en el ícono
                    <Icon name="trashBlue" className="inline w-4 h-4 mb-1.5" />.
                </p>
            </div>
        </>
    ),
    NATIONAL_INFORMATION: (
        <>
            <p className="mb-4.5 text-gray-dark pr-7">
                Para empezar, seleccione los departamentos y ciudades a las que va a realizar envíos. Luego, agregue el tiempo
                estimado de entrega para cada ciudad junto con el costo de envío asociado. Tenga en cuenta que el costo de envío
                agregado para cada ciudad será un costo fijo que aplica para todas las zonas de esa ciudad.
            </p>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Para agregar un departamento de destino haga click en
                    <span className="text-green"> +Agregar departamento.</span>
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Para agregar una ciudad a un departamento de destino haga click en
                    <span className="text-green"> +Agregar ciudad.</span>
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Si desea eliminar un departamento, seleccione la casilla correspondiente y haga click en el ícono
                    <Icon name="trashBlue" className="inline w-4 h-4 mb-1.5" />.
                </p>
            </div>
            <div className="flex w-full">
                <p className="w-auto pl-2 text-gray-dark">
                    • &nbsp; Si desea eliminar una de las ciudades de un departamento, seleccione la casilla correspondiente y
                    haga click en el ícono
                    <Icon name="trashBlue" className="inline w-4 h-4 mb-1.5" />.
                </p>
            </div>
        </>
    ),
};

export const PRODUCT_SHIPING_COST_INFORMATION = {
    description: (
        <div>
            <p>
                Para contar con la información completa de su proceso de compra y venta que se presenta en la tienda virtual se
                necesita incluir el costo de envío de los productos que su empresa envía a sus clientes. Más adelante puede editar
                o actualizar la información que ha subido con anterioridad en los campos habilitados.
            </p>
        </div>
    ),
    title: 'Costo de envio de productos',
};
