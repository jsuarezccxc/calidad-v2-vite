import React from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';

const HeaderTable: React.FC = () => {
    const { anchorEl: anchorPerishable, mouseProps: mousePerishable } = usePopper();
    const { anchorEl: anchorBatch, mouseProps: mouseBatch } = usePopper();
    const { anchorEl: anchorWarehouse, mouseProps: mouseWarehouse } = usePopper();

    return (
        <tr>
            <th className="box-border h-10 text-sm leading-4 field-header--uneditable table-register-date text-blue font-allerbold">
                Fecha de registro
            </th>
            <th className="box-border h-10 text-sm leading-4 field-header--uneditable w-120 text-blue font-allerbold">
                Unidad de medida
            </th>
            <th className="box-border text-sm leading-4 field-header--uneditable w-120 text-blue font-allerbold">
                <div className="flex flex-row items-center w-full h-full p-0 m-0">
                    <div {...mousePerishable}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    <span>*Perecedero</span>
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorPerishable}
                        description="Productos que tienen una vida útil limitada y se deterioran o expiran."
                        title="Perecedero:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="box-border h-10 text-sm leading-4 field-header--uneditable w-150 text-blue font-allerbold">
                <div className="flex flex-row items-center w-full h-full p-0 m-0">
                    <div {...mouseBatch}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    *Lote
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorBatch}
                        description="es la identificación del lote del producto."
                        title="Lote:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="box-border h-10 text-sm leading-4 field-header--uneditable table-expired-date text-blue font-allerbold">
                *Fecha de vencimiento
            </th>
            <th className="box-border h-10 text-sm leading-4 field-header--uneditable w-150 text-blue font-allerbold">
                *Cantidad
            </th>
            <th className="box-border h-10 text-sm leading-4 field-header--uneditable w-160 text-blue font-allerbold">
                <div className="flex flex-row items-center w-full h-full p-0 m-0">
                    <div {...mouseWarehouse}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    *Bodega
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorWarehouse}
                        description="es el nombre de la(s) bodega(s) en las que está almacenado el producto."
                        title="Bodega:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="w-28" />
        </tr>
    );
};

export default HeaderTable;
