import React, { Dispatch, SetStateAction } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { Routes } from '@constants/Paths';
import { PRODUCT_NAME } from '@constants/ProductName';
import { getRoute } from '@utils/Paths';
import { Icon } from '@components/icon';
import { IEntity } from '@components/radiobutton';
import { Link, LinkColor } from '@components/button';
import { IPrefixNextToExpire } from '@components/electronic-invoice';
import { TooltipIcon } from '@components/electronic-invoice/components';

export const PARAGRAPHS = {
    TITLE_SALES: (isEditSales: boolean): string => (isEditSales ? 'Editar Factura de venta' : 'Visualizar factura de venta'),
    DESCRIPTION_CREATE_ELECTRONIC_INVOICE: (
        <>
            <p className="description-text font-aller">
                Desde esta pantalla genere facturas electrónicas. Para ello, agregue la información solicitada, tenga en cuenta
                que la facturación electrónica requiere que los campos identificados con un asterisco (*) estén debidamente
                diligenciados.
            </p>
            <p className="w-full mt-4 mb-4">
                Para crear las facturas electrónicas de venta, <span className="font-allerbold">{PRODUCT_NAME}</span> le ofrece
                dos opciones:
            </p>
            <ul className="ml-1 list-none">
                <li>
                    1. &nbsp;Agregando la información de los campos solicitados en &nbsp;
                    <span className="font-allerbold">Crear factura electrónica de venta a través de {PRODUCT_NAME}.</span>
                </li>
                <li>
                    2. &nbsp;Agregando la información de los campos solicitados a través de una plantilla de Excel que puede
                    descargar en &nbsp;
                    <span className="font-allerbold"> Crear factura electrónica de venta a través de Excel.</span>
                </li>
            </ul>
            <p className="w-full my-4">Seleccione la opción que prefiera.</p>
        </>
    ),
    TITLE_CREATE_INVOICE: 'Crear factura electrónica de venta a través de',
    TITLE_REGISTER_SALES: 'Registro de ventas a través de',
    DESCRIPTION_CREATE_INVOICE_FAMIEFI: (
        <>
            <p className="mb-4">
                La DIAN requiere <span className="font-allerbold">únicamente</span> que los campos identificados con un asterisco,
                estén debidamente diligenciados para generar la factura electrónica.
            </p>
            <p className="mb-4">
                Si no contesta las preguntas con opciones de respuesta SI o NO, diggi pymes selecciona por defecto la opción NO.
            </p>
            <p className="mb-4">
                En caso de no seleccionar ninguna opción de los campos detalle de impuestos, responsabilidad fiscal y medio de
                pago, diggi pymes selecciona por defecto la opción no aplica, otros, no definido.
            </p>
            <p className="mb-4">
                Al terminar haga click en <span className="font-allerbold">Guardar</span> para almacenar la información en el
                sistema y enviar la factura a la DIAN.
            </p>
        </>
    ),
    DESCRIPTION_CREATE_INVOICE_EXCEL: (
        <p>
            Descargue la plantilla de Excel y cree cada una de las facturas electrónicas de manera individual. Una vez haya
            terminado de agregar la información de una factura en el Excel vuelva a subir el archivo en el cuadro que se muestra a
            continuación. Más adelante puede <strong>editar o actualizar</strong> la información que ha subido con anterioridad
            dando click en el icono del lápiz. Si desea <strong>eliminar</strong> la información, seleccionela y haga click en el
            icono de caneca.
        </p>
    ),
    DESCRIPTION_REGISTER_SALES: (
        <>
            <p className="w-full my-4">
                Para agregar la información de sus ventas en el sistema, {PRODUCT_NAME} le ofrece dos opciones:
            </p>
            <ul className="ml-8 list-none">
                <li>
                    1. &nbsp;Agregando la información de los campos solicitados en el &nbsp;
                    <span className="font-allerbold"> Registro de ventas a través de {PRODUCT_NAME}.</span>
                </li>
                <li>
                    2. &nbsp;Agregando la información de los campos solicitados a través de una plantilla de Excel que puede
                    descargar en <span className="font-allerbold"> Registro de ventas a través de Excel.</span>
                </li>
            </ul>
            <p className="w-full my-2">Seleccione la opción que prefiera.</p>
        </>
    ),
    DESCRIPTION_REGISTER_SALES_FAMIEFI:
        'En caso de que ya haya registrado una venta y necesite registrar una nueva para el mismo cliente, puede obtener su información precargada desde la sección buscar cliente. Para encontrarlo, seleccione el tipo de documento, agregue el número de docuemnto del cliente y haga click en Buscar. Una vez haya agregado la información correspondiente, haga click en Guardar.',

    DESCRIPTION_VIEW_PREVIOUS_RECORD: (
        <>
            <p className="description-text font-aller">
                Desde esta pantalla puede visualizar el histórico de las facturas no electrónicas agregadas y su respectivo
                estado. Si la factura tiene estado “Aceptada” significa que el cliente no ha manifestado haber encontrado errores
                en ella. Si tiene estado “Anulada” significa que es una factura que usted ha anulado.
            </p>
            <ul className="mt-4 ml-20">
                <li>Para visualizar una factura, haga click sobre su número.</li>
                <li>
                    <div className="flex">
                        Para editar una factura, haga click sobre el ícono &nbsp;
                        <Icon name="editBlue" className="h-5" />.
                    </div>
                </li>
                <li>
                    <div className="flex">
                        Para anular una factura, haga click sobre el ícono &nbsp;
                        <Icon name="cancelBlue" className="h-5" />.
                    </div>
                </li>
            </ul>
        </>
    ),
    DESCRIPTION_VISUAL_OR_EDIT_SALES: (isEditSales: boolean): JSX.Element | string =>
        isEditSales ? (
            <p>
                Desde esta pantalla puede editar la información de la factura de venta no electrónica. Revise todos los campos y
                si desea modificar alguno, seleccione el campo correspondiente y edite la información. Una vez finalice, haga
                click en <span className="font-allerbold"> Guardar. </span>
            </p>
        ) : (
            'Desde esta pantalla puede visualizar la información de la factura de venta no electrónica'
        ),

    DESCRIPTION_SAVE_LOAD_EXCEL: (
        <p>
            Desde esta pantalla puede editar la información de la factura electrónica creada con el archivo excel. Revise todos
            los campos y si desea modificar alguno, seleccione el campo correspondiente y edite la información. Una vez finalice,
            haga click en <span className="font-allerbold">Guardar.</span> En caso de que haya agregado más de una factura, puede
            buscarla cambiando las páginas en la esquina superior derecha de la sección &nbsp;
            <span className="font-allerbold"> Orden de compra </span> o puede usar el buscador escribiendo el número de la factura
            en <span className="font-allerbold"> Buscar Factura.</span>
        </p>
    ),
    DESCRIPTION_SAVE_LOAD_EXCEL_SALES: (
        <p>
            Desde esta pantalla puede editar la información subida del registro de sus ventas con el archivo Excel. Revise todos
            los campos y si desea modificar alguno, seleccione el campo correspondiente y edite la información. Una vez finalice,
            haga click en <span className="font-allerbold">Guardar</span>. En caso de que haya agregado más de una factura, puede
            buscarla cambiando las páginas en la esquina superior derecha de la sección &nbsp;
            <span className="font-allerbold"> Registro de ventas a través de Excel </span> o puede usar el buscador escribiendo el
            número de la factura en <span className="font-allerbold"> Buscar Factura. </span>
        </p>
    ),
    DESCRIPTION_TABLE_INVOICE: (isRegisterSale: boolean, isView: boolean, isQuote: boolean): JSX.Element =>
        isRegisterSale ? (
            <p className="mt-4.5">
                La información puede ser <span className="font-allerbold">editada</span> dando click en el icono del lápiz. Si
                necesita
                <span className="font-allerbold"> eliminar</span> un producto o servicio, selecciónelo en las casillas ubicadas al
                lado derecho de la tabla y utilice el ícono de la caneca.
            </p>
        ) : (
            <>
                {!isQuote && (
                    <p className="text-gray-dark">
                        Al facturar servicios, las columnas Bodega, Lote y Fecha de vencimiento son inhabilitadas, y si requiere
                        definir un periodo {isQuote ? 'cotizado' : 'facturado'}, agréguelo en la columna descripción.
                    </p>
                )}
                {(!isView || isQuote) && (
                    <p className="text-gray-dark">
                        La información puede ser <span className="font-allerbold">editada</span> ubicándose en el campo requerido.
                        Si necesita &nbsp;
                        <span className="font-allerbold">eliminar</span> un producto o servicio, selecciónelo en las casillas
                        ubicadas al lado derecho de la tabla y utilice el ícono de la caneca.
                    </p>
                )}
            </>
        ),
    MESSAGE_TIMEOUT: (
        <div className="modal--response">
            <div className="flex flex-row items-center mb-2">
                <Icon name="infoBlue" className="header__icon" alt="info-modal" />
                <h3 className="text-xl font-allerbold leading-xl text-blue">Información</h3>
            </div>
            <div className="text-gray-dark lg:w-103.75">
                <p className="mb-4.5 leading-19.38px">
                    ¡La DIAN ha excedido el tiempo habitual para procesar el documento electrónico!
                </p>
                <p className="leading-19.38px">
                    Actualmente su documento electrónico se encuentra en estado de verificación. Por favor, vuelva a revisar el
                    estado del documento en aproximadamente 1 hora para verificar si ha cambiado a &nbsp;
                    <span className="font-allerbold">Aceptado</span> o <span className="font-allerbold">Rechazado.</span>
                </p>
            </div>
        </div>
    ),
};

export const DELETE_SALES = {
    INFORMATION: (
        <div className="modal--response">
            <div className="w-min-mi">
                <div className="flex flex-row items-center mb-2">
                    <Icon name="checkBlue" className="header__icon" alt="info-modal" />
                    <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
                </div>
                <div className="text-base leading-base text-gray-dark w-96">
                    <p>
                        Tenga en cuenta que al anular la factura los movimientos dentro de ella serán reversados y el número de la
                        factura no podrá usarse nuevamente.
                    </p>
                    <p className="mt-6">¿Está seguro que desea anular la factura?</p>
                </div>
            </div>
        </div>
    ),
    SAVE: (
        <div className="modal--response">
            <div className="text-base leading-base text-gray-dark w-96">
                <p className="mt-3">Su información ha sido guardada con éxito</p>
                <p className="mt-6">Tenga en cuenta informarle a su cliente sobre los cambios realizados.</p>
            </div>
        </div>
    ),
    TITLE: 'Información guardada',
};

export const SAVE_INVOICE = {
    INFORMATION: (
        <div className="modal--response">
            <div className="w-min-mi">
                <div className="flex flex-row items-center mb-2">
                    <Icon name="checkBlue" className="header__icon" alt="info-modal" />
                    <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
                </div>
                <div className="text-base leading-base text-gray-dark w-96">
                    <p className="mt-3">Su información ha sido guardada con éxito</p>
                    <p className="mt-6">
                        Para agregar otra factura de venta, haga click en Agregar otra, de lo contrario haga click en Siguiente.
                    </p>
                </div>
            </div>
        </div>
    ),
};

export const SAVE_INVOICE_SALES = (prefix: string, number: string, hour = '', isQuote = false): JSX.Element => (
    <div className="modal--response">
        <div className="flex flex-row items-center mb-2">
            <Icon name="checkBlue" className="header__icon" alt="info-modal" />
            <h3 className="text-xl font-bold leading-xl text-blue">Información guardada</h3>
        </div>
        <div className="w-full text-base leading-base text-gray-dark">
            <p className="mt-3">¡Su información ha sido guardada con éxito!</p>
            <p className="mt-3">
                Su {isQuote ? 'cotización ha sido creada con' : `factura de venta ha sido creada con el prefijo ${prefix} Y`}
                &nbsp; el número {number}.
            </p>
            <p className="mt-3">
                Hora de emisión: <span className="lowercase">{hour}</span> hrs
            </p>
            <p className="mt-6">
                Si desea crear otra {isQuote ? 'cotización' : 'factura'}, haga click en el botón Agregar. Si no tiene más &nbsp;
                {isQuote ? 'cotizaciones' : 'facturas'} por crear, haga click en Siguiente
            </p>
        </div>
    </div>
);

export const EDIT_INVOICE_SALES = {
    INFORMATION: (
        <div className="modal--response">
            <div className="w-min-mi">
                <div className="flex flex-row items-center mb-2">
                    <Icon name="checkBlue" className="header__icon" alt="info-modal" />
                    <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
                </div>
                <div className="text-base leading-base text-gray-dark w-96">
                    <p className="mt-3">Su información ha sido guardada con éxito</p>
                    <p className="mt-4">Tenga en cuenta informarle a su cliente sobre los cambios realizados</p>
                </div>
            </div>
        </div>
    ),
};

export const VALIDATE_EMAIL_INVOICE = (previousEmail: string, currentEmail: string): IGenericRecord => (
    <div className="modal--response">
        <div className="w-min-mi">
            <div className="flex flex-row items-center mb-2">
                <Icon name="infoBlue" className="header__icon" alt="info-modal" />
                <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
            </div>
            <div className="text-base leading-base text-gray-dark w-96">
                <p className="mt-3">El número de documento ingresado está asociado el correo electrónico {previousEmail}.</p>
                <p className="mt-4">
                    Para asociar el correo {currentEmail} haga click en <span className="font-allerbold">Aceptar</span>; de lo
                    contrario haga click en <span className="font-allerbold">Atrás</span> para asignar el correo {previousEmail} a
                    la factura de venta.
                </p>
            </div>
        </div>
    </div>
);

export const VALIDATE_DOCUMENT_EMAIL_INVOICE = (document: string, email: string, idCustomer: string): IGenericRecord => (
    <div className="modal--response">
        <div className="w-min-mi">
            <div className="flex flex-row items-center mb-2">
                <Icon name="infoBlue" className="header__icon" alt="info-modal" />
                <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
            </div>
            <div className="text-base leading-base text-gray-dark w-117">
                <p className="mt-3">
                    El correo electrónico <span className="font-bold">{email}</span>, ya se encuentra asociado al número de
                    documento <span className="font-bold">{document}</span>.
                </p>
                <div className="my-4.5">
                    <span className=" text-gray-dark">
                        Si desea actualizarlo, &nbsp;
                        <Link
                            href={`${getRoute(Routes.HOME)}?document_client=${idCustomer}`}
                            text="haga click aquí."
                            classes="text-base"
                            linkColor={LinkColor.PURPLE}
                        />
                    </span>
                </div>
            </div>
        </div>
    </div>
);

export const MEMBERSHIP_AVAILABLE_INVOICES = (): IGenericRecord => (
    <p>
        Usted no tiene más facturas disponibles, para continuar facturando compre un paquete adicional de facturas haciendo click
        en el botón <span className="font-allerbold">Planes de membresía.</span>
    </p>
);

export const VALIDATE_DOCUMENT_INVOICE = (email: string, previousDocument: string, currentDocument: string): IGenericRecord => (
    <div className="modal--response">
        <div className="w-min-mi">
            <div className="flex flex-row items-center mb-2">
                <Icon name="infoBlue" className="header__icon" alt="info-modal" />
                <h3 className="text-xl font-bold leading-xl text-blue">Información</h3>
            </div>
            <div className="text-base leading-base text-gray-dark w-96">
                <p className="mt-3">
                    El correo electrónico <span className="font-allerbold">{email}</span> está asociado al número de documento
                    &nbsp;
                    <span className="font-allerbold">{previousDocument}</span>. Para asociar el nuevo número de documento &nbsp;
                    <span className="font-allerbold">{currentDocument}</span> haga click en &nbsp;
                    <span className="font-allerbold">Aceptar.</span>
                </p>
            </div>
        </div>
    </div>
);

export const MODAL_BILLING_PACKAGE = (numberInvoiceAvalible: IGenericRecord): JSX.Element => (
    <div className="modal--response">
        <div className="flex flex-row items-center mb-2">
            <Icon name="infoBlue" onClick={(): void => {}} className="header__icon" alt="info-modal" />
            <h3 className="text-xl font-bold leading-xl text-blue">Notificación paquete de facturación</h3>
        </div>
        <div className="text-base leading-5 text-gray-dark">
            Actualmente su paquete cuenta con <span className="font-allerbold">{numberInvoiceAvalible}</span> facturas
            disponibles. Para renovar o adquirir un nuevo paquete de facturación electrónica haga click en planes de pago.
        </div>
    </div>
);

export const TITLES_MODALS_RESOLUTION: { [key: string]: string } = {
    CONSECUTIVE: 'Notificación consecutivos de facturación',
    RESOLUTION_EXPIRE: 'Notificación vencimiento de resolución para facturar',
};

export const MODAL_CONSECUTIVE_RESOLUTION = (numberInvoiceAvalible: string): JSX.Element => (
    <div className="flex flex-col items-center">
        <p className="mb-7 text-gray-dark">
            Actualmente cuenta con <span className="font-allerbold">{numberInvoiceAvalible}</span> consecutivos de facturas
            electrónicas autorizados en la DIAN por resolución.
        </p>
        <p className="text-gray-dark">
            Para saber cómo autorizar un nuevo rango de consecutivos, &nbsp;
            <Link
                text="haga click aquí."
                href={getRoute(Routes.ELECTRONIC_INVOICE_INSTRUCTIONS)}
                linkColor={LinkColor.PURPLE}
                classes="text-base"
            />
        </p>
    </div>
);

export const MODAL_RESOLUTION_EXPIRATION = ({ numberPrefix, dayExpirate }: IPrefixNextToExpire): JSX.Element => (
    <div className="flex flex-col items-center">
        <p className="mb-7 text-gray-dark">
            Se le informa que la resolución número <span className="font-allerbold">{numberPrefix}</span> vence en &nbsp;
            <span className="font-allerbold">{dayExpirate}</span> días. Si se vence y no cuenta con más resoluciones disponibles,
            no podrá continuar facturando electrónicamente.
        </p>
        <p className="text-gray-dark">
            Para saber como se realiza la habilitación de numeración de una resolución vencida, &nbsp;
            <Link
                text="haga click aquí."
                href={getRoute(Routes.ELECTRONIC_DOCUMENTS)}
                linkColor={LinkColor.PURPLE}
                classes="text-base"
            />
        </p>
    </div>
);

export const DESCRIPTION_MODAL = {
    TITLE: 'Definición de términos',
    DESCRIPTION: (
        <div className="justify-between pr-1 overflow-y-auto lg:w-full md:h-auto md:pb-11.5 xs:h-full bg-green-scrollbar xs:max-h-96 modal__description">
            <p className="mb-4">
                <span className="font-allerbold"> Prefijo: </span>es un identificador de facturas electrónicas de venta de cuatro
                caracteres alfanuméricos.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Divisa: </span>es la moneda con la que se va a expedir la factura de venta.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Fecha de emisión: </span>fecha en la que se expide la factura de venta.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Hora de emisión: </span>hora en la que se expide la factura de venta.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Fecha de vencimiento: </span>fecha límite de cobro de la factura.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Número de orden de compra: </span>número entregado por el cliente asociado a un
                documento de orden de compra donde le solicita al empresario los producto que necesita comprar.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Encargado de la venta: </span>nombre del vendedor que realizó la venta.
            </p>
            <p className="mb-4">
                <span className="font-allerbold">
                    &nbsp; Tipo de documento encargado de la venta y Número de documento encargado de la venta: &nbsp;
                </span>
                es la identificación del vendedor que realizó la venta.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Nombre cliente: </span>es el nombre del cliente.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Tipo de documento del cliente y número de documento del cliente: </span> es la
                identificación del cliente.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Correo electrónico: </span>es el correo electrónico del cliente.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Dirección, país, departamento/estado, ciudad y código postal: </span>son los
                campos de ubicación geográfica del cliente.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Teléfono: </span>es número de teléfono fijo o celular del cliente.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Encargado de compra: </span>Encargado de compra: es el nombre del tercero
                (empleado) que realiza la compra a nombre del cliente.
            </p>
            <p className="mb-4">
                <span className="font-allerbold">
                    &nbsp; Tipo de documento encargado de compra y número de documento encargado de compra: &nbsp;
                </span>
                es la identificación del tercero (empleado) que realiza la compra a nombre del cliente.
            </p>
            <span className="font-allerbold">Tipo de pago:</span>
            <ul className="mt-4 ml-6 list-disc font-allerbold">
                <li>
                    <span className="font-allerbold">Crédito: </span> &nbsp;
                    <span className="font-aller">
                        es la modalidad de pago que se hace efectivo en un periodo de tiempo diferente al día en el que se realiza
                        la compra.
                    </span>
                </li>
                <li className="mt-4">
                    <span className="font-allerbold">Contado: </span> &nbsp;
                    <span className="font-aller">
                        es la modalidad de pago que se hace efectivo en el mismo instante que se realiza la compra.
                    </span>
                </li>
            </ul>
            <p className="mt-4 mb-4">
                <span className="font-allerbold"> Días de cobro: </span>es el número de días que tiene el cliente de plazo para
                pagar la factura.
            </p>
            <p className="mb-4">
                <span className="font-allerbold"> Forma de pago: </span>es el medio que se utiliza para pagar la factura.
            </p>
            <span className="font-allerbold">Tipo de contribuyente:</span>
            <ul className="mt-4 ml-6 list-disc font-allerbold">
                <li>
                    <span className="font-allerbold"> Persona natural: </span>
                    <span className="font-aller">cuando el cliente actúa a título personal.</span>
                </li>
                <li className="mt-4">
                    <span className="font-allerbold">Persona jurídica: </span> &nbsp;
                    <span className="font-aller">
                        cuando el cliente actúa en representación de una sociedad conformada por una o mas personas.
                    </span>
                </li>
            </ul>
            <p className="mt-4 mb-4">
                <span className="font-allerbold">Responsabilidad fiscal: </span> es la clasificación que la DIAN le da a los
                contribuyentes, para saber a que impuestos están obligados.
            </p>
            <p>
                <span className="font-allerbold">Detalle de impuestos: </span> es el tributo al que el contribuyente está obligado
                a facturar. Por ejemplo, el impuesto sobre las ventas IVA o impuesto nacional al consumo INC.
            </p>
        </div>
    ),
};

export const TOOLTIPS_INFORMATION = {
    SEND_EMAIL: (
        <>
            Si selecciona esta opción, diggi pymes envía la factura electrónica al correo electrónico del cliente suministrado en
            el formulario.
            <p className="my-4.5 text-sm">
                Esta opción da cumplimiento a lo establecido por DIAN en la circular 000007 para la entrega de facturas:
            </p>
            <p className="m-0 text-sm italic">
                Por correo electrónico a la dirección electrónica suministrada por el adquiriente al facturador electrónico, en
                formato digital de representación gráfica.
            </p>
        </>
    ),
    INVOICE_PRINT: (
        <>
            Con esta opción puede imprimir la factura y entregarla directamente a su cliente o enviársela a domicilio en la
            dirección suministrada en el formulario
            <p className="my-4.5 text-sm">
                Esta opción da cumplimiento a lo establecido por la DIAN en la circular 000007 para la entrega de facturas:
            </p>
            <p className="m-0 text-sm italic">Impresión de representación gráfica.</p>
        </>
    ),
    INVOICE_DEVICE: (
        <>
            Con esta opción puede descargar la factura electrónica de venta para almacenarla en un dispositivo electrónica y
            entregarlo directamente a su cliente o enviársela a domicilio en la dirección suministrada en el formulario.
            <p className="my-4.5 text-sm">
                Esta opción da cumplimiento a lo establecido por la DIAN en la circular 000007 para la entrega de facturas:
            </p>
            <p className="m-0 text-sm italic">
                Por envío electrónico entre el servidor del facturador electrónico y el servidor del adquiriente, en dispositivos
                electrónicos.
            </p>
        </>
    ),
    REGISTRATION_NAME: (
        <>
            El <span className="font-allerbold">nombre de la empresa</span> o <span className="font-allerbold">razón social</span>{' '}
            &nbsp; debe coincidir con el que se encuentra registrado en el RUT.
        </>
    ),
    COMPANY_ID: (
        <>
            El <span className="font-allerbold">número de documento</span> debe coincidir con el que se encuentra registrado en el
            RUT.
        </>
    ),
    FREE_DOCUMENTS: (
        <>
            <span className="font-allerbold">15 Documentos por año:</span> Este plan aplica únicamente para las microempresas que
            cumplan con los parámetros establecidos en el artículo 2 de la Ley 905 de 2004, y que requieran utilizar como máximo
            15 documentos electrónicos al año. En caso de requerir un documento electrónico adicional se deberá adquirir un
            paquete diferente, ya que el Plan Gratis para Microempresas solo podrá ser adquirido por una única vez al año.
        </>
    ),
    TAXES: (
        <>
            Obligaciones tributarias que la persona o empresa deben pagar al estado.
            <br />
            Para saber mas sobre impuestos haga click aca: &nbsp;
            <Link
                href="https://www.dian.gov.co/Paginas/Vencimientos-tributarios-marzo-2024.aspx"
                text="Ver más...."
                linkColor={LinkColor.PURPLE}
                target="_blank"
                download
            />
        </>
    ),
};

export const CUSTOMER_UPDATE_MODAL = {
    TITLE: (
        <div className="flex flex-row items-center mb-2">
            <Icon name="infoBlue" className="header__icon" alt="info-modal" />
            <h3 className="text-xl font-allerbold leading-xl text-blue">Actualización de datos</h3>
        </div>
    ),
    UPDATE: (documentClient: string, isModalDocumentNumber = false, nameClient = '', isQuote = false): JSX.Element => (
        <p className="text-gray-dark">
            {isModalDocumentNumber ? (
                <>
                    Ya existe un cliente con este número de documento <span className="font-allerbold">{documentClient}</span>. Si
                    guarda la factura, la información del cliente que ya existe con ese número será reemplazada.
                </>
            ) : (
                <>
                    Se ha modificado la información del cliente asociado al Número de documento &nbsp;
                    <span className="font-allerbold">{documentClient}</span>
                    {isQuote && (
                        <>
                            &nbsp; a nombre de <span className="font-allerbold">{nameClient}</span>
                        </>
                    )}
                    . Los siguientes campos presentan cambios.
                </>
            )}
        </p>
    ),
    DESCRIPTION: (isQuote = false): JSX.Element => (
        <p className="text-gray-dark">
            Haga click en Guardar para actualizar la información del cliente y &nbsp;
            {isQuote ? 'generar la cotización' : 'enviar la factura a la DIAN'}. En caso contrario haga click en Descartar cambios
            para conservar los datos originales del cliente y editarlos de ser necesario.
        </p>
    ),
};

export const radioClientOptions: IEntity[] = [
    {
        name: 'yes',
        label: 'Voluntariamente autoriza su información personal',
        tooltip: true,
        titleTooltip: 'Voluntariamente autoriza su información personal:',
        descTooltip:
            'Si su cliente suministra su información personal, agréguela en el formulario para la generación de la factura.',
        labelClass: 'radio-client--label',
    },
    {
        name: 'no',
        label: 'No autoriza su información personal',
        tooltip: true,
        titleTooltip: 'No suministró información personal:',
        descTooltip:
            'Si su cliente no autoriza dar su información personal, la factura se genera a nombre de Consumidor final con número de documento 222222222222.',
        labelClass: 'radio-client--label',
    },
];

export const authorizationInformation = (tooltip: string, setTooltip: Dispatch<SetStateAction<string>>): IEntity[] => [
    {
        name: 'yes',
        label: '',
        labelElement: (
            <>
                <div className="label-style label-style__size-375">
                    <span>Voluntariamente autoriza su información personal</span>&nbsp;
                    <TooltipIcon
                        tooltip={tooltip}
                        setTooltip={(): void => setTooltip('informationClient')}
                        classTooltip="padding-bottom__15"
                    />
                </div>
            </>
        ),
    },
    {
        name: 'no',
        label: '',
        labelElement: (
            <>
                <div className="label-style label-style__size-275">
                    <span>No autoriza su información personal</span>&nbsp;
                    <TooltipIcon
                        tooltip={tooltip}
                        setTooltip={(): void => setTooltip('notInformationClient')}
                        classTooltip="padding-bottom__15"
                    />
                </div>
            </>
        ),
    },
];

export const questionsRadioButtonInvoice = {
    electronicCustomer: '¿El adquiriente (cliente) es facturador electrónico?',
    emailCustomer: '¿El cliente autoriza el envío de la factura?',
    onlyProducts: '¿El cliente solicita que se le envíen los productos a su dirección?',
    productsInvoice: '¿El cliente solicita que se le envíen los productos y/o factura a su dirección?',
};

export const instructionsForInvoice = {
    prefix:
        'El número de la factura de venta está compuesto por el prefijo y el consecutivo. El consecutivo asignado por la DIAN lo fija diggi pymes por orden numérico al guardar la factura',
    sale:
        'La información en este recuadro no es obligatoria y solamente la llena el empresario para el control de productividad de su empresa',
    typeTaxpayer: (
        <>
            Su cliente persona jurídica está obligado a suministrar la información de la empresa en las facturas electrónicas.
            <br /> Su cliente persona natural NO está obligado a suministrar información personal.
            <br /> Para el cliente persona natural seleccione la opción que aplique.
        </>
    ),
    address:
        'En caso de que los productos vayan a ser enviados a una dirección seleccionada por el cliente, esta dirección se agregará aquí.',
};

export const fieldsMessage = {
    fieldsRequired: (
        <p className="text-base">
            Para continuar revise el formulario y diligencie los campos resaltados y marcados como &nbsp;
            <span className="text-purple">*Campo obligatorio</span> o <span className="text-purple">*Campo a diligenciar.</span>
        </p>
    ),
    fieldRequired: (
        <p className="text-base">
            Para continuar revise el formulario y diligencie los campos resaltados y marcados como &nbsp;
            <span className="text-purple">*Campo obligatorio.</span>
        </p>
    ),
    fieldToFill: '*Campo a diligenciar',
};
