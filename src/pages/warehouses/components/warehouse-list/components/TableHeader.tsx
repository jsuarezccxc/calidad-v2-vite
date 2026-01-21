import React from 'react';

export const TableHeader: React.FC = () => {
    return (
        <tr>
            <th className="w-7" />
            <th className="warehouse-list__table-n">N°</th>
            <th className="warehouse-list__table-name">Nombre de la bodega</th>
            <th className="warehouse-list__table-country">Pais</th>
            <th className="warehouse-list__table-department">Departamento</th>
            <th className="warehouse-list__table-city">Ciudad</th>
            <th className="warehouse-list__table-address">Dirección</th>
        </tr>
    );
};

export const TableHeaderModal: React.FC = () => {
    return (
        <tr>
            <th className="warehouse-list__table-name--modal">Nombre de la bodega</th>
            <th className="warehouse-list__table-document--modal">Documento electrónico</th>
        </tr>
    );
};
