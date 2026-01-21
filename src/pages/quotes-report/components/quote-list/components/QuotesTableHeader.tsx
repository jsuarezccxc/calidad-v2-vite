import React from 'react';

export const QuotesTableHeader: React.FC = React.memo(() => {
    return (
        <tr>
            <th className="table-field quotes-report-table__selector quotes-report-table__cell-selector">
            </th>
            <th className="table-field quotes-report-table__number quotes-report-table__cell-standard quotes-report-table__header-bg">
                <span className="quotes-report-table__header-text whitespace-nowrap text-sm font-allerbold leading-4">No. de cotización</span>
            </th>
            <th className="table-field quotes-report-table__date quotes-report-table__cell-standard quotes-report-table__header-bg">
                <span className="quotes-report-table__header-text whitespace-nowrap text-sm font-allerbold leading-4">Fecha de emisión</span>
            </th>
            <th className="table-field quotes-report-table__client quotes-report-table__cell-standard quotes-report-table__header-bg">
                <span className="quotes-report-table__header-text whitespace-nowrap text-sm font-allerbold leading-4">Nombre cliente</span>
            </th>
            <th className="table-field quotes-report-table__email quotes-report-table__cell-standard quotes-report-table__header-bg">
                <span className="quotes-report-table__header-text text-sm font-allerbold leading-4">Correo electrónico del<br />cliente</span>
            </th>
            <th className="table-field quotes-report-table__status quotes-report-table__cell-standard quotes-report-table__header-bg">
                <span className="quotes-report-table__header-text whitespace-nowrap text-sm font-allerbold leading-4">Estado del documento</span>
            </th>
        </tr>
    );
});

