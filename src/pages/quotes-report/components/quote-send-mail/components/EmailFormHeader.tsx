import React from 'react';
import { BreadCrumb } from '@components/bread-crumb';
import { PageTitle } from '@components/page-title';
import { Routes } from '@constants/Paths';
import { SUPPORT_DOCUMENTS_SUBTITLE } from '@constants/DocumentTexts';
import type { IEmailFormHeaderProps } from '..';
import { getRouteName } from '@utils/Paths';

export const EmailFormHeader: React.FC<IEmailFormHeaderProps> = ({ 
  title = 'Editar plantilla de correo',
  description = 'Agregue una imagen en caso que lo requiera, complete el asunto y la descripción del correo correspondiente. Además, asegúrese de incluir las direcciones de correo electrónico de las personas a las que enviará el mensaje.'
}) => {
  const routes = [
    {
      name: getRouteName(Routes.ELECTRONIC_DOCUMENTS),
      route: '/documentos-electronicos',
    },
    {
      name: 'Cómo generar y transmitir Factura electrónica de venta y Documento soporte',
      route: '/documentos-electronicos/factura-electronica',
    },
    {
      name: 'Cotizaciones',
      route: '/documentos-electronicos/factura-electronica/cotizaciones',
    },
    {
      name: 'Visualización cotización',
      route: '/quotes-report?view=quote-view',
    },
    {
      name: title,
      route: '#',
    },
  ];

  return (
    <>
      <PageTitle 
        title={getRouteName(Routes.ELECTRONIC_DOCUMENTS)} 
        pageContent={SUPPORT_DOCUMENTS_SUBTITLE} 
      />
      <BreadCrumb routes={routes} />
      <h2 className="quote-send-mail__page-subtitle">
        Cómo generar y transmitir Factura electrónica de venta y Documento soporte
      </h2>

      <div className="quote-send-mail__container">
        <h3 className="quote-send-mail__title whitespace-nowrap">
          {title}
        </h3>
      </div>

      <p className="quote-send-mail__description">
        {description}
      </p>
    </>
  );
};
