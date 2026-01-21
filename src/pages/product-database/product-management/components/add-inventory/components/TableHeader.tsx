import React from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';

export const TableHeader: React.FC = () => {
    const { anchorEl: anchorPerishable, mouseProps: mousePerishable } = usePopper();
    const { anchorEl: anchorBatch, mouseProps: mouseBatch } = usePopper();
    const { anchorEl: anchorWarehouse, mouseProps: mouseWarehouse } = usePopper();
    const { anchorEl: anchorVariants, mouseProps: mouseVariants } = usePopper();

    return (
        <tr>
            <th className="add-inventory__table-variants">
                <div className="flex flex-row items-center w-full h-full p-0 m-0">
                    <div {...mouseVariants}>
                        <Icon name="infoGreen" classIcon="inline w-5 mx-1" />
                    </div>
                    <span className="text-blue">Variantes</span>
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorVariants}
                        description="diferentes opciones disponibles para un mismo producto, como tallas, colores o especificaciones."
                        title="Variantes:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="pl-2 text-left add-inventory__table-name text-blue">Nombre</th>
            <th className="add-inventory__table-perishable">
                <div className="flex flex-row items-center w-full h-full p-0 m-0 text-blue">
                    <div {...mousePerishable}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    Perecedero
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorPerishable}
                        description=" productos que tienen una vida útil limitada y se deterioran o expiran."
                        title="Perecedero:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="add-inventory__table-batch">
                <div className="flex flex-row items-center w-full h-full p-0 m-0 text-blue">
                    <div {...mouseBatch}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    Lote
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorBatch}
                        description="es la identificación del lote del producto."
                        title="Lote:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="justify-start text-left add-inventory__table-date-expired text-blue">Fecha de vencimiento</th>
            <th className="add-inventory__table-units text-blue">Cantidad</th>
            <th className="add-inventory__table-warehouse text-blue">
                <div className="flex flex-row items-center w-full h-full p-0 m-0 text-blue">
                    <div {...mouseWarehouse}>
                        <Icon name="infoGreen" classIcon="inline w-5 mr-1" />
                    </div>
                    Bodega
                    <Tooltip
                        iconName="infoBlue"
                        anchorEl={anchorWarehouse}
                        description="es el nombre de la(s) bodega(s) en las que está almacenado el producto."
                        title="Bodega:"
                        placement="bottom-start"
                    />
                </div>
            </th>
            <th className="w-10" />
        </tr>
    );
};
