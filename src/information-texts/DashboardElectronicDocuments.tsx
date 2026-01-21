import React from 'react';
import { Link, LinkColor } from '@components/button';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export const INFORMATION_PAGE = {
    TITLE: 'Documentos electrónicos',
    SUB_TITLE_1: 'Haga click en la acción que desea hacer:',
    SUB_TITLE_2: 'Seleccione el mes en el que quiere ver los datos:',
    LINK: (route: string): JSX.Element => (
        <>
            Haga click para ver el reporte detallado: &nbsp;
            <Link
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `dashboard-month-report-detail-report`,
                    action: ActionElementType.PREVIEW,
                    elementType: ElementType.LNK,
                })}
                classes="text-tiny"
                href={route}
                linkColor={LinkColor.PURPLE}
                text="Reporte documentos generados"
            />
        </>
    ),
};
