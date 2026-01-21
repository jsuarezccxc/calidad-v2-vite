import React from 'react';
import { Routes } from '@constants/Paths';
import { IStep, IStepDetail } from '@pages/docs-instructions';
import { TypeDoc } from '@pages/docs-instructions/context';
import { NumberRangeStep, StepSlider, StepWrapper } from '@pages/docs-instructions/components';
import { stepsUrl } from '@pages/docs-instructions/pages';
import { Modals } from '@pages/number-range/components';
import Portal from '@pages/docs-instructions/components/Portal';
import { SalesInvoiceStep } from '@pages/docs-instructions/components/SalesInvoiceStep';
import { ButtonRedirect } from '@pages/docs-instructions/components/ButtonRedirect';
import { FOUR, THREE, TWO } from '@pages/virtual-store-sales-receipts';
import { NumberRangeProvider } from '@pages/number-range/context/NumberRangeProvider';
import { IGenericRecord } from '@models/GenericRecord';
import { getRouteName } from '@utils/Paths';
import { ONE } from '@constants/Numbers';
import { PRODUCT_NAME } from '@constants/ProductName';
import { MODULE_TITLES } from '@constants/ElectronicDocuments';
import { Icon, IconsNames } from '@components/icon';
import { Link, LinkColor } from '@components/button';
import figPortalDIAN from '@assets/images/user-registered-dian-portal.gif';
import servicesModuleDIAN from '@assets/images/services-module-DIAN.png';
import homePortalDIAN from '@assets/images/home-portal-DIAN.png';
import invoiceNumberOptionsDIAN from '@assets/images/invoice-number-options-DIAN.png';
import dialogUpdateRUT from '@assets/images/dialog-update-rut.png';
import contributeInfoDIAN from '@assets/images/contribute-info-DIAN.png';
import searchNumberRangeDIAN from '@assets/images/search-number-range-DIAN.png';
import rangeAuthorizationDIAN from '@assets/images/range-authorization-request-DIAN.png';
import rangeTableDIAN from '@assets/images/range-table-DIAN.png';
import savedDIAN from '@assets/images/document-saved-DIAN.png';
import rangeVerification from '@assets/images/range-verification.png';
import saveRangeDian from '@assets/images/save-ranges-DIAN.png';
import singDocumentOne from '@assets/images/sing-document-1.png';
import singDocumentTwo from '@assets/images/sing-document-2.png';
import dynamicPass from '@assets/images/dynamic-pass-DIAN.png';
import dynamicPassPlace from '@assets/images/dynamic-pass-place-DIAN.png';
import numberRequestTable from '@assets/images/number-request-table-DIAN.png';
import numberRangeMenu from '@assets/images/number-range-menu-DIAN.png';
import addPrefixConfig from '@assets/images/add-prefix-config-DIAN.png';
import confirmDialogDIAN from '@assets/images/confirm-dialog-DIAN.png';
import { lengthEqualToZero } from '../utils/Length';

export const REQUEST_RESOLUTION_STEP = (typeDoc: TypeDoc = TypeDoc.EI): IStepDetail[] => [
    {
        description: (
            <p className="text-white font-allerbold">
                Ingresa a la página de la DIAN &nbsp;
                <a
                    href="https://www.dian.gov.co/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-base leading-5 underline cursor-pointer font-allerbold text-purple"
                >
                    https://www.dian.gov.co/
                </a>
                . Diríjase a la sección Transaccional y haga click en el usuario registrado para ingresar al módulo MUISCA.
            </p>
        ),
        content: (): React.ReactNode => (
            <div className="flex flex-col gap-4.5 px-13 mb-7">
                <div className="flex flex-col justify-center xl:flex-row">
                    <img
                        src={figPortalDIAN}
                        style={{ width: '39.625rem', height: '21.0625rem' }}
                        alt="Portal DIAN pagina principal"
                    />
                </div>
            </div>
        ),
    },
    {
        description:
            'Ingrese al portal transaccional Muisca, seleccione la opción entre A nombre propio, A nombre de un tercero, Servidor DIAN, Autorizaciones/Poderes, Organización no obligada a RUT y haga click en ingresa.',
        content: (): React.ReactNode => (
            <div className="flex flex-col gap-4 px-13 mb-7">
                <div className="flex flex-col justify-center xl:flex-row xl:gap-7">
                    <img
                        src={servicesModuleDIAN}
                        style={{ width: '19.8125rem', height: '19.3125rem' }}
                        alt="Modulo de servicios DIAN"
                    />
                </div>
            </div>
        ),
    },
    {
        description:
            typeDoc !== TypeDoc.EI
                ? 'Ingrese desde el menú izquierdo de la pantalla, haga click en Numeración de facturación y luego seleccione la opción Solicitar Numeración de Facturación. Seleccione documento soporte en tipo de documento.'
                : 'Ingrese desde el menú izquierdo de la pantalla, haga click en Numeración de facturación y luego seleccione la opción Solicitar Numeración de Facturación.',
        content: (): React.ReactNode => (
            <div className="flex flex-col xl:flex-row px-11.5 mb-7">
                <div className="flex flex-col items-center w-full mr-5 xl:w-1/2 xl:mr-3 xl:border-r-1 border-b-1 mt-4.5 xl:mt-0 xl:border-b-0 border-green border-opacity-20">
                    <img
                        src={homePortalDIAN}
                        style={{ width: '21.8125rem', height: '20.5625rem' }}
                        alt="Modulo de servicios DIAN"
                    />
                </div>
                <div className="flex flex-col items-center w-full xl:pl-1.5 xl:w-1/2">
                    <img
                        src={invoiceNumberOptionsDIAN}
                        style={{ width: '25.0625rem', height: '18.875rem' }}
                        alt="Opciones para rangos numericos plataforma DIAN"
                    />
                </div>
            </div>
        ),
    },
    {
        description:
            'El sistema generará un aviso, información del contribuyente y recordatorio del vencimiento. Verifique que la información del contribuyente, ingrese. Consulte la numeración de facturación y seleccione en Autorizar rangos.',
        content: (): React.ReactNode => (
            <div className="flex flex-col w-full xl:flex-row px-13 xl:mb-7">
                <div className="flex flex-col justify-center items-center mr-4.5 w-full xl:w-1/2 border-r-1 border-green border-opacity-20">
                    <img
                        src={dialogUpdateRUT}
                        style={{ width: '26rem', height: '6.75rem' }}
                        alt="Aviso de actualización del RUT"
                    />
                </div>
                <div className="flex flex-col items-center justify-center w-full xl:w-1/2">
                    <img
                        src={contributeInfoDIAN}
                        style={{ width: '24.5rem', height: '7.3125rem' }}
                        alt="Información del contribuyente"
                    />
                    <img
                        src={searchNumberRangeDIAN}
                        style={{ width: '24rem', height: '8.0625rem' }}
                        alt="Consultar los rangos de numeracion"
                    />
                </div>
            </div>
        ),
    },
    {
        description: (
            <p className="text-white">
                Para solicitar la autorización de rangos &nbsp;
                <span className="inline-block">
                    <Icon className="inline-block w-4 h-4" name="infoBlue" />
                </span>
                &nbsp; defina el prefijo de máximo 4 caracteres alfanuméricos, luego seleccione Facturación electrónica de venta
                en el campo tipo de facturación y especifique el rango para la numeración del consecutivo. Al finalizar la
                definición del prefijo y rango haga click en agregar para editar.
            </p>
        ),
        content: (): React.ReactNode => (
            <div className="flex flex-col justify-center items-center xl:mt-5 gap-5.5">
                <img
                    src={rangeAuthorizationDIAN}
                    style={{ width: '49.8144rem', height: '18.9669rem' }}
                    alt="Autorización de rangos de numeracion DIAN"
                />
            </div>
        ),
    },
    {
        description: 'Borrador de Solicitud de Autorización de rangos.',
        content: (): React.ReactNode => (
            <div className="flex flex-col pr-10 pl-13 pr mb-7">
                <div className="flex flex-col items-center justify-center w-full xl:flex-row">
                    <div className="flex flex-col border-0 xl:w-1/2 border-r-1 border-green border-opacity-20">
                        <p className="mb-2 leading-5 text-gray-dark xl:mr-2">
                            <span className="font-allerbold">a&#41;</span> Cuando se pulsa el botón Agregar del recuadro anterior,
                            aparecerá un resumen de la información suministrada. Si necesita editar la información utilice el
                            ícono del lápiz o para eliminarla utilice el basurero. Finalmente haga click en
                            <span className="font-allerbold"> Borrador</span>.
                        </p>
                        <img src={rangeTableDIAN} className="w-full xl:pr-3.75 xl:pl-2.25" alt="Tabla de numeracion de rangos." />
                    </div>
                    <div className="flex flex-col xl:pl-7 xl:w-1/2">
                        <p className="leading-5 text-gray-dark mb-4.5">
                            <span className="font-allerbold">b&#41;</span> Luego se genera el formato 1302 que podrá descargar
                            haciendo click en <span className="font-allerbold">Ver documento</span> y posteriormente aceptarlo.
                        </p>
                        <img
                            src={savedDIAN}
                            className="w-full xl:w-85 xl:pl-0.25 xl:h-23 xl:py-1.25 2xl:w-8/12"
                            alt="Documento guardado exitosamente"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full xl:flex-row">
                    <div className="flex flex-col xl:flex-row  xl:w-1/2 gap-5.5 xl:border-t-0  border-t-1 xl:border-r-1 border-green border-opacity-20">
                        <div className="flex flex-col xl:w-1/2">
                            <p className="leading-5 text-gray-dark mb-4.5">
                                <span className="font-allerbold">c&#41;</span> Verifique que los rangos autorizados sean
                                correctos.
                            </p>
                            <img
                                src={rangeVerification}
                                className="w-full xl:w-47 xl:pl-0.5 xl:h-32 xl:py-0.375 "
                                alt="Documento con la informacion actualizada"
                            />
                        </div>
                        <div className="flex flex-col xl:w-1/2">
                            <p className="leading-5 text-gray-dark mb-4.5">
                                <span className="font-allerbold">d&#41;</span> Luego de confirmar la información haga click en
                                <span className="font-allerbold"> Aceptar</span>.
                            </p>
                            <img
                                src={savedDIAN}
                                className="w-full xl:w-47 xl:px-0.5 xl:h-13 mx-auto"
                                alt="Documento guardado exitosamente"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col xl:pl-7 xl:w-1/2 mt-4.5">
                        <p className="leading-5 text-gray-dark mb-4.5 xl:mr-11">
                            <span className="font-allerbold">e&#41;</span> Marque la resolución como
                            <span className="font-allerbold"> Definitivo</span> haciendo click en el botón para firmar el formato.
                        </p>
                        <img
                            src={saveRangeDian}
                            className="w-full xl:w-87 xl:px-1.875 xl:h-25 xl:pt-0.25"
                            alt="Modulo de servicios DIAN"
                        />
                    </div>
                </div>
            </div>
        ),
    },
    {
        description:
            'Firme el formato 1302, solicite la clave dinámica que aparece en la ventana emergente. Luego , revise en la bandeja de comunicados para visualizar la clave dinámica.',
        content:
            typeDoc === TypeDoc.EI
                ? (): React.ReactNode => (
                      <div className="flex flex-col xl:flex-row px-13 mb-7">
                          <div className="flex flex-col justify-center items-center w-full xl:w-1/2 xl:mr-4.5 xl:border-r-1 border-b-1 xl:border-b-0 border-green border-opacity-20">
                              <img
                                  src={singDocumentOne}
                                  style={{ width: '17.75rem', height: '21.375rem' }}
                                  alt="Fomulario firma de documento primer parte"
                              />
                          </div>
                          <div className="flex flex-col items-center justify-center w-full xl:w-1/2">
                              <img
                                  src={singDocumentTwo}
                                  style={{ width: '17.3125rem', height: '20.625rem' }}
                                  alt="Fomulario firma de documento primer parte"
                              />
                          </div>
                      </div>
                  )
                : (): React.ReactNode => (
                      <div className="flex flex-col xl:flex-row px-13 mb-7">
                          <div className="flex flex-col items-center w-full xl:w-1/2 xl:mr-4.5 xl:border-r-1 border-b-1 xl:border-b-0 border-green border-opacity-20">
                              <p className="leading-5 text-gray-dark mb-4.5 xl:mr-4">
                                  <span className="font-allerbold">a&#41;</span> Para realizar la firma del formato 1302 necesita
                                  una clave dinámica para generarla diríjase a la sección
                                  <span className="font-allerbold"> Clave dinámica</span> en la ventana emergente y haga click en
                                  <span className="font-allerbold"> Solicítala aquí.</span>
                              </p>
                              <img
                                  src={singDocumentOne}
                                  className="xl:w-53 xl:px-0.5 xl:h-64 xl:py-0.375 mx-auto"
                                  alt="Fomulario firma de documento primer parte"
                              />
                          </div>
                          <div className="flex flex-col items-center w-full xl:w-1/2">
                              <p className="leading-5 text-gray-dark mb-9">
                                  <span className="font-allerbold">b&#41; </span>
                                  Seguido de solicitar la clave, haga click en{' '}
                                  <span className="font-allerbold"> Ver mi bandeja de comunicados</span> para visualizar la clave
                                  dinámica.
                              </p>
                              <img
                                  src={singDocumentTwo}
                                  className="xl:w-59 xl:pl-0.5 xl:pr-0.75 xl:h-72 xl:py-0.875 mx-auto"
                                  alt="Fomulario firma de documento primer parte"
                              />
                          </div>
                      </div>
                  ),
    },
    {
        description: 'Ingrese las claves solicitadas para firmar electrónicamente la resolución',
        content: (): React.ReactNode => (
            <div className="flex flex-col xl:flex-row px-13 mb-7">
                <div className="flex flex-col items-center w-full xl:w-1/3 xl:border-r-1 border-b-1 mb-7 xl:mb-0 xl:border-b-0 border-green border-opacity-20">
                    <ul className="leading-5 text-gray-dark mb-4.5 w-11/12 list-disc">
                        <li className="whitespace-nomal">
                            Luego se abrirá una ventana emergente donde está la clave dinámica resaltada en color azul.
                        </li>
                        <li className="whitespace-nomal">
                            Copiéla y diríjase a la ventana anterior
                            <span className="font-allerbold"> Firmar documento</span>.
                        </li>
                    </ul>
                    <img
                        src={dynamicPass}
                        className="w-full xl:w-56 xl:pl-0.25 mx-auto xl:h-56 xl:pt-0.25 xl:pb-2.5 2xl:w-10/12"
                        alt="Clave dinamica DIAN"
                    />
                </div>
                <div className="flex flex-col items-center w-full xl:w-1/3 xl:border-r-1 mb-7 xl:mb-0 border-b-1 xl:border-b-0 border-green border-opacity-20">
                    <ul className="leading-5 text-gray-dark mb-2.5  xl:w-11/11 xl:ml-6.70 list-disc">
                        <li className="whitespace-nomal">
                            Pegue la clave dinámica en el campo<span className="font-allerbold"> clave dinámica</span>. Luego
                            Ingrese la clave de su Firma electrónica.
                        </li>
                        <li className="whitespace-nomal">
                            En caso de no contar con su Clave Firma Electrónica. &#40;
                            <a
                                className="text-base underline text-purple"
                                href="https://www.dian.gov.co/Prensa/Aprendelo-en-un-DIAN-X3/Paginas/Paso-a-Paso-Generacion-Firma-Electronica.aspx"
                                target="_blank"
                                rel="noreferrer"
                            >
                                haga click aquí
                            </a>
                            &nbsp; y siga el instructivo para generar una clave de firma electrónica por primera vez o
                            recuperarla&#41;.
                        </li>
                    </ul>
                    <img
                        src={dynamicPassPlace}
                        className="w-full xl:w-39 xl:px-0.5 xl:h-45 xl:py-0.25 mt-3 2xl:w-8/12"
                        alt="Campo clave dinamica"
                    />
                </div>
                <div className="flex flex-col items-center w-full xl:w-1/3">
                    <ul className="leading-5 text-gray-dark xl:ml-7 mb-4.5 xl:w-11/12 list-disc">
                        <li className="whitespace-nomal">
                            Para finalizar haga click en el botón <span className="font-allerbold"> firmar documento(s)</span> Y
                            haga click en <span className="font-allerbold"> aceptar</span> en la ventana emergente para que el
                            estado de la solicitud sea definitivo
                        </li>
                    </ul>
                    <img
                        src={savedDIAN}
                        className="w-full xl:w-56 xl:px-0.5 xl:h-20 xl:pb-2.0 xl:pt-0.25 xl:pb-2.5 mt-3.5 2xl:w-8/12"
                        alt="Diaolog documento enviado"
                    />
                </div>
            </div>
        ),
    },
    {
        description:
            'Formalización de la solicitud de Numeración de facturación haga, click en el botón firmar. Recuerde que es obligatorio tener las dos firmas para que se visualicen la asociación de los rangos de numeración',
        content: (): React.ReactNode => (
            <div className="flex flex-col gap-7 mb-7">
                <img
                    src={numberRequestTable}
                    style={{ width: '54.25rem', height: '6.25rem' }}
                    alt="Tabla de formalizacion de los rangos de numeracion"
                />
            </div>
        ),
    },
    {
        description: 'Asociación de prefijos en la DIAN',
        content: (): React.ReactNode => (
            <div className="flex flex-col w-full xl:flex-row px-11.5 xl:mb-7">
                <div className="flex flex-col items-center mr-4.5 w-full xl:w-1/2 border-r-1 border-green border-opacity-20">
                    <ul className="leading-5 text-gray-dark mb-4.5 w-full xl:ml-5 xl:pr-10.5 list-disc">
                        <li className="whitespace-normal">
                            Una vez finalice la autorización de numeración, inicie sesión en DIAN haciendo click en el siguiente
                            link &#40;
                            <a
                                className="text-base text-purple"
                                href="https://catalogo-vpfe.dian.gov.co/User/Login"
                                target="_blank"
                                rel="noreferrer"
                            >
                                https://catalogo-vpfe.dian.gov.co/User/Login
                            </a>
                            &#41;.
                        </li>
                        <li className="whitespace-normal">
                            En el menú del lado izquierdo haga click en Configuración y luego en Rangos de Numeración.
                        </li>
                    </ul>
                    <img
                        src={numberRangeMenu}
                        className="xl:w-55 xl:h-56 xl:py-1.25 mt-7 2xl:w-2/3 w-full"
                        alt="Opcion rangos de numeración Menu DIAN "
                    />
                </div>
                <div className="flex flex-col items-center w-full xl:w-1/2">
                    <ul className="leading-5 text-gray-dark mb-4.5 list-disc xl:ml-10.5">
                        <li className="whitespace-normal">
                            En el campo Proveedor - Software seleccione
                            <span className="font-allerbold"> CENTRO DE CONSULTORÍA PARA LA COMPETITIVIDAD</span>.
                        </li>
                        <li className="whitespace-normal">
                            En el campo <span className="font-allerbold">Prefijo</span>, seleccione el prefijo y la numeración
                            creados anteriormente. Luego haga click en <span className="font-allerbold">Agregar</span>.
                        </li>
                    </ul>
                    <img
                        src={addPrefixConfig}
                        className="mx-auto xl:w-86 xl:px-1.5 xl:h-28 xl:pb-1.25 xl:pl-1.5"
                        alt="Información del contribuyente"
                    />
                    <ul className="leading-5 text-gray-dark mb-4.5 list-disc xl:ml-2.5">
                        <li className="whitespace-normal">
                            Luego en la ventana emergente haga click en <span className="font-allerbold">Aceptar</span>.
                        </li>
                    </ul>
                    <img
                        src={confirmDialogDIAN}
                        className="xl:w-39 xl:pl-1.25 xl:h-23 xl:pb-0.75 "
                        alt="Consultar los rangos de numeracion"
                    />
                </div>
            </div>
        ),
    },
];

export const SYNC_NUMBER_RANGE_STEP = (description: string): IStepDetail => ({
    description: description,
    content: (): React.ReactNode => (
        <NumberRangeProvider>
            <Portal>
                <Modals />
            </Portal>
            <NumberRangeStep />
        </NumberRangeProvider>
    ),
});

const CONTENT_FINAL_SUBSTEP = (nextNumber: number, icon: IconsNames = 'finalStepVector'): IStepDetail => {
    const SIZE_ICON_CLASS =
        icon === 'finalStepVector'
            ? 'w-68 px-0.5 h-60 py-0.25'
            : icon === 'finalStepVectorThree'
            ? 'w-61 pl-0.25 h-72 pb-2.5 pt-0.25'
            : 'w-68 pl-1 pr-0.75 h-64 py-1.5';

    return {
        description: '',
        content: (): React.ReactNode => (
            <div className="flex flex-col items-center justify-center py-8 text-gray-dark xl:py-20">
                <div className="flex flex-row items-center justify-center">
                    <div className="flex-col h-48 w-117">
                        <p className="text-title text-blue font-allerbold">¡Felicidades!</p>

                        <p className="mb-10 text-xl leading-6">Ha completado el paso {nextNumber - 1} con éxito.</p>
                        <p className="text-xl leading-6">
                            Continúe con el <span className="font-allerbold">Paso {nextNumber}:</span> Sincronizar los rangos de
                            numeración en {PRODUCT_NAME}
                        </p>
                    </div>
                    <div className="ml-12">
                        <Icon name={icon} classIcon={SIZE_ICON_CLASS} />
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <ButtonRedirect
                        className="w-70 px-2.75"
                        text={`Paso ${nextNumber}: Sincronizar los rangos de numeración en ${PRODUCT_NAME}`}
                    />
                </div>
            </div>
        ),
    };
};

export const SECOND_STEP_SUPPORT_DOCUMENT = (): IStepDetail[] => [
    SYNC_NUMBER_RANGE_STEP(
        `Sincronice con ${PRODUCT_NAME} los rangos de numeración para Documento soporte. Haga click en el botón Sincronizar para que traiga la información. En caso de un error con los prefijo comuníquese con Soporte.`
    ),
    {
        description: '',
        content: (): React.ReactNode => (
            <div className="flex flex-col items-center justify-center py-8 text-gray-dark xl:py-20">
                <div className="flex flex-row items-center justify-center">
                    <div className="flex-col h-48 w-117">
                        <p className="text-title text-blue font-allerbold">¡Felicidades!</p>

                        <p className="mb-10 text-xl leading-6">
                            Ya está listo para generar su primer <br /> Documento soporte y empezar a multiplicar <br /> sus
                            ventas. <br />
                            Haga su primer documento soporte
                        </p>
                    </div>
                    <div className="ml-12">
                        <Icon name="finalStepVectorTwo" classIcon="w-68 pl-1 pr-0.75 h-64 py-1.5" />
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <ButtonRedirect className="w-41" text="Generar y transmitir documentos electrónicos" />
                </div>
            </div>
        ),
    },
];

export const FIRST_STEP_CONTINGENCY_INVOICE = (nextNumber: number): IStepDetail[] => [
    {
        description: 'Guía para enviar el correo a la DIAN informando las inconsistencias tecnológicas.',
        content: (): React.ReactNode => (
            <div className="flex flex-col gap-4 firts-step-contingency__container xl:px-13 mb-7">
                <div>
                    <p className="leading-5 text-gray-dark">
                        Para poder generar su factura de contingencia, debe enviar una carta a la Dian. Puede seguir los
                        siguientes indicaciones<br></br>o descargar la plantilla del modelo de contingencia Tipo -03 de diggi
                        pymes.
                    </p>
                </div>
                <div className="flex firts-step-contingency__instructions text-gray-dark">
                    <div className="firts-step-contingency__list items-center gap-5.5 w-full">
                        <p>
                            <span className="font-allerbold">1&#41; Asunto: </span>Nit de la empresa con guión de dígito de
                            verificación;<br></br>Nombre de la empresa.
                        </p>
                        <p>
                            <span className="font-allerbold">2&#41; Adjunto: </span> PDF de la carta donde se declaren en
                            contingencia
                            <br></br>con la firma del representante legal.
                        </p>
                        <p>
                            <span className="font-allerbold">3&#41; Cuerpo del correo: </span> Datos de contacto &#40;nombre,
                            teléfono/
                            <br></br>celular de contacto.
                        </p>
                        <p>
                            <span className="font-allerbold">4&#41;</span> Se debe enviar al correo electrónico
                            <br></br>
                            <span className="font-allerbold">contingencia.facturadorvp@dian.gov.co.</span>
                        </p>
                        <div className="mt-4">
                            <p>
                                Si el facturador quiere entregar estas constancias por escrito lo
                                <br></br>puede realizar a través de radicados, el cual deberá remitirse a la<br></br>DIAN - nivel
                                central - factura electrónica.
                            </p>
                        </div>
                    </div>
                    <div className="firts-step-contingency__alert-container">
                        <div className="firts-step-contingency__alert relative flex flex-col border-2 items-center rounded-lg border-green px-3 py-4.5 text-blue">
                            <div className="absolute flex items-center justify-center w-8 h-8 rounded-full -top-4 bg-green">
                                <Icon name="infoBlue" classIcon="w-7 h-7 icon-white" />
                            </div>
                            <div className="flex flex-col">
                                <p className="leading-5 text-center font-allerbold align-center">Nota:</p>
                                <div>
                                    <p className="text-center">
                                        El formato modelo de <br></br> contingencia
                                        <br></br> tipo -03 de diggi pymes es una
                                        <span className="font-allerbold"> guía</span> para los
                                        <br></br> facturadores electrónicos.
                                    </p>
                                    <p className="text-center truncate">Por lo tanto, la empresa CCxC</p>
                                    <p className="text-center">
                                        <span className="font-allerbold">no se hace responsable</span> del uso que se haga del
                                        presente documento.<br></br>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-1 cursor-pointer">
                    <Link
                        href="files/Formato modelo de contingencia Tipo -03 de diggi pymes.docx"
                        target="_blank"
                        classes="text-base leading-5 underline cursor-pointer font-allerbold"
                        linkColor={LinkColor.PURPLE}
                        text={`Haga click aquí para descargar el formato modelo de contingencia Tipo -03 de ${PRODUCT_NAME}.`}
                    />
                </div>
                <div className="mt-1 text-gray-dark">
                    <p>
                        Nota: El formato <span className="italic">modelo de contingencia tipo -03 de {PRODUCT_NAME}</span> es una
                        guía para los facturadores electrónicos.<br></br>
                        Por lo tanto, la empresa CCxC no es responsable del uso que se haga del presente documento.
                    </p>
                </div>
            </div>
        ),
    },
    CONTENT_FINAL_SUBSTEP(nextNumber, 'finalStepVectorThreeOther'),
];

export const THIRD_STEP_CONTINGENCY_INVOICE = (nextNumber: number): IStepDetail[] => [
    SYNC_NUMBER_RANGE_STEP(`Sincronice con ${PRODUCT_NAME} los rangos de numeración para las facturas de contingencia`),
    {
        description: '',
        content: (): React.ReactNode => (
            <div className="flex flex-col items-center justify-center py-8 text-gray-dark xl:py-20">
                <div className="flex flex-row items-center justify-center">
                    <div className="flex-col h-48 w-117">
                        <p className="text-title text-blue font-allerbold">¡Felicidades!</p>

                        <p className="mb-10 text-xl leading-6">
                            Ya está listo para generar su primera factura <br /> de contingencia y empezar a multiplicar sus
                            <br /> ventas.
                        </p>
                        <p className="text-xl leading-6">
                            Haga su primera factura en el
                            <span className="font-allerbold"> Paso {nextNumber}.</span>
                        </p>
                    </div>
                    <div className="ml-12">
                        <Icon name="finalStepVectorTwo" classIcon="w-68 pl-1 pr-0.75 h-64 py-1.5" />
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    <ButtonRedirect className="w-41" text={`Paso ${nextNumber}`} />
                </div>
            </div>
        ),
    },
];

export const DOCS_INSTRUCTION = (doc?: TypeDoc, step?: string): IGenericRecord => ({
    PAGE_CONTENT: 'Documentos electrónicos',
    TITLE: MODULE_TITLES.INVOICE,
    SUBTITLE: getRouteName(Routes.DOCS_INSTRUCTIONS),
    DESCRIPTION: (
        <p className="text-base font-normal leading-5 font-aller text-gray-dark">
            Seleccione el documento electrónico que va a generar y haga click en siguiente
        </p>
    ),
    ROUTE:
        doc === TypeDoc.EI && !lengthEqualToZero(step ?? '')
            ? 'Factura electrónica de venta'
            : doc === TypeDoc.SD && !lengthEqualToZero(step ?? '')
            ? 'Documento soporte'
            : doc === TypeDoc.CI && !lengthEqualToZero(step ?? '')
            ? 'Factura de talonario o papel (Contingencia)'
            : 'Selección del documento electrónico.',
});

const createStepWrapper = (title: string, description: string, steps: IStepDetail[], stepNumber: number): React.ReactNode => (
    <StepWrapper title={title} description={description}>
        <StepSlider steps={steps} stepNumber={stepNumber} />
    </StepWrapper>
);

const createStepContent = (
    stepUrl: stepsUrl,
    stepNumber: number,
    icon: IconsNames,
    title: string,
    description: string,
    steps: IStepDetail[],
    subDescription?: string
): IStep => ({
    icon,
    title,
    description,
    type: stepUrl,
    content: (): React.ReactNode => createStepWrapper(title, !subDescription ? description : subDescription, steps, stepNumber),
});

export const STEPS: Record<TypeDoc, IStep[]> = {
    [TypeDoc.EI]: [
        createStepContent(
            stepsUrl.REQUEST,
            ONE,
            'instructionStepOne',
            'Paso 1: Solicitud de resolución de facturación electrónica',
            ``,
            [...REQUEST_RESOLUTION_STEP(), CONTENT_FINAL_SUBSTEP(TWO)]
        ),
        createStepContent(
            stepsUrl.SYNC,
            TWO,
            'instructionStepTwo',
            `Paso 2: Sincronizar los rangos de numeración en ${PRODUCT_NAME}`,
            ``,
            [
                SYNC_NUMBER_RANGE_STEP(
                    `Sincronice con ${PRODUCT_NAME} los rangos de numeración para las facturas electrónicas. Haga click en el botón Sincronizar para que traiga la información. En caso de un error con los prefijo comuníquese con Soporte.`
                ),
                CONTENT_FINAL_SUBSTEP(THREE, 'finalStepVectorTwo'),
            ]
        ),
        {
            icon: 'instructionStepThree',
            title: 'Paso 3: Generación y transmisión del documento electrónico',
            description: '',
            type: stepsUrl.GENERATE,
            content: (): React.ReactNode => (
                <SalesInvoiceStep title="Paso 3: Generación y transmisión del documento electrónico" description="" />
            ),
        },
    ],
    [TypeDoc.SD]: [
        createStepContent(
            stepsUrl.REQUEST,
            ONE,
            'instructionStepOne',
            'Paso 1: Solicitud de resolución de documento soporte',
            ``,
            [...REQUEST_RESOLUTION_STEP(TypeDoc.SD), CONTENT_FINAL_SUBSTEP(TWO)]
        ),
        createStepContent(
            stepsUrl.SYNC,
            TWO,
            'instructionStepTwo',
            `Paso 2: Sincronizar los rangos de numeración en ${PRODUCT_NAME}`,
            ``,
            SECOND_STEP_SUPPORT_DOCUMENT()
        ),
        {
            icon: 'instructionStepThree',
            title: 'Paso 3: Generación y transmisión del documento electrónico',
            description: '',
            type: stepsUrl.GENERATE,
            content: (): React.ReactNode => (
                <SalesInvoiceStep
                    title="Paso 3: Generación y transmisión del documento electrónico"
                    description=""
                    typeDoc={TypeDoc.SD}
                />
            ),
        },
    ],
    [TypeDoc.CI]: [
        createStepContent(
            stepsUrl.SEND,
            ONE,
            'mailInstruction',
            'Paso 1: Envío carta a la DIAN informando el inconveniente tecnológico',
            'A continuación, encuentre las instrucciones para hacer el correo informando a la DIAN sobre las inconsistencias tecnológicas.',
            FIRST_STEP_CONTINGENCY_INVOICE(TWO)
        ),
        createStepContent(
            stepsUrl.REQUEST,
            TWO,
            'instructionStepOne',
            'Paso 2: Solicitud de resolución de factura de contingencia',
            'Solicite la resolución y los prefijos asociados con documentos electrónicos.',
            [...REQUEST_RESOLUTION_STEP(), CONTENT_FINAL_SUBSTEP(THREE, 'finalStepVectorThree')],
            `A continuación encuentre las instrucciones para solicitar y sincronizar la resolución de facturación y los prefijos asociados con ${PRODUCT_NAME}.`
        ),
        createStepContent(
            stepsUrl.SYNC,
            THREE,
            'instructionStepTwo',
            `Paso 3: Sincronizar los rangos de numeración en ${PRODUCT_NAME}`,
            `Sincronizar con ${PRODUCT_NAME} la resolución de facturación y los prefijos asociados.`,
            THIRD_STEP_CONTINGENCY_INVOICE(FOUR)
        ),
        {
            icon: 'instructionStepThree',
            title: 'Paso 4: Generación del documento electrónico',
            description: 'Genere el documento electrónico.',
            type: stepsUrl.GENERATE,
            content: (): React.ReactNode => (
                <SalesInvoiceStep
                    title="Paso 4: Generación y transmisión del documento electrónico"
                    description="Genere y transmita el documento electrónico a la DIAN"
                    typeDoc={TypeDoc.CI}
                />
            ),
        },
    ],
};
