import React from 'react';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import { Tooltip } from '@components/tooltip';
import { getRouteName } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { IMouseProps } from '@hooks/usePopper';

export const WEBSITE_INVENTORY = (
    anchorlEl: HTMLElement | null,
    toggle: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void,
    mousePropsPopUp: IMouseProps
): IGenericRecord => ({
    TITLE: getRouteName(Routes.WEBSITE_MENU),
    SUBTITLE: 'Inventario inicial',
    HELP_TEXT: '¿Donde se registra en diggi pymes la información de Inventario Inicial?',
    DESCRIPTION: (
        <React.Fragment>
            <p onClick={toggle} className="w-full mb-2 whitespace-normal cursor-pointer lg:w-max">
                <span className="flex flex-row items-center gap-2 text-base underline text-purple" {...mousePropsPopUp}>
                    <Icon name="lightPurple" classIcon="inline" />
                    ¿Donde se registra en diggi pymes la información de Inventario Inicial?
                </span>
                <Tooltip
                    wrapperClassName="rounded"
                    anchorEl={anchorlEl}
                    placement="bottom-start"
                    iconName="lightBlue"
                    description={
                        <p className="text-base leading-5 font-aller">
                            En diggi pymes los valores de inventario inicial se registran en dos secciones, primero en la sección
                            Ficha técnica se le solicita al empresario que registre con cuantas unidades disponibles cuenta para
                            la venta y además donde las tiene almacenadas, esto se identifica como &quot;bodega&quot;.
                            Adicionalmente, en el módulo Sitio web y tienda virtual se le solicita al empresario que actualice los
                            datos sobre el inventario inicial de las unidades disponibles para la venta de cada producto que
                            vende. Igualmente tiene la opción de actualizar el lugar donde tiene almacenadas estas unidades, de si
                            preferirlo.
                        </p>
                    }
                />
            </p>
            <p className="text-base font-normal leading-5 font-aller text-gray-dark mb-4.5">
                Agregue o actualice la información de su inventario inicial.
            </p>

            <p className="text-base font-normal leading-5 font-aller text-gray-dark">
                ¿Cómo editar la tabla de inventario inicial?
            </p>
            <ul className="pl-6 text-base font-normal leading-5 list-disc font-aller text-gray-dark">
                <li>Para editar, haga click sobre el campo y ajuste lo que necesite.</li>
                <li>
                    <div className="flex items-center">
                        Para eliminar, seleccione los recuadros a la izquierda de cada fila y haga click en el ícono&nbsp;
                        <Icon classIcon="inline w-5" name="trashBlue" />.
                    </div>
                </li>
            </ul>
        </React.Fragment>
    ),
});
