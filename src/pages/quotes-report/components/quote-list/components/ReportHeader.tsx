import React from 'react';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import { Routes } from '@constants/Paths';
import { getRoute, getRouteName } from '@utils/Paths';

export const ReportHeader: React.FC = () => {
    const routes = [
        {
            name: getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT),
            route: getRoute(Routes.DASHBOARD_ELECTRONIC_DOCUMENT)
        },
        {
            name: getRouteName(Routes.QUOTES_REPORT),
            route: getRoute(Routes.QUOTES_REPORT)
        }
    ];

    return (
        <>
            <PageTitle title={getRouteName(Routes.DASHBOARD_ELECTRONIC_DOCUMENT)} pageContent={SUPPORT_DOCUMENTS_SUBTITLE} />
            <BreadCrumb routes={routes} />
            <h2 className="page-subtitle">Cómo generar y transmitir Factura electrónica de venta y Documento soporte</h2>

            <div className="quotes-common__container">
                <h3 className="quotes-common__title">
                    Cotizaciones
                </h3>
            </div>

            <p className="quotes-common__description">
                En este listado encuentra todas las cotizaciones que ha generado. Filtre por rango de fecha, busque por número de cotización,
                correo electrónico del cliente o nombre del cliente. Adicionalmente filtre por estado del documento, enviado o sin enviar.
            </p>
        </>
    );
};

