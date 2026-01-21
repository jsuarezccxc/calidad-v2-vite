import React from 'react';
import informationIcon from '@assets/images/info-green.svg';
import { Link, LinkColor } from '@components/button';
import { IEntity } from '@components/radiobutton';
import { Tooltip } from '@components/tooltip';
import { Icon } from '@components/icon';
import { STRING } from '@constants/DataTypes';
import { PRODUCT_NAME } from '@constants/ProductName';
import { IGenericRecord } from '@models/GenericRecord';
import { IStep } from '@pages/enable-electronic-biller/components';
import { Certificate } from '@pages/enable-electronic-biller/components/enablement';
import { TypeLinkDian, dianLinks } from '@constants/DianLinks';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';

export const INFORMATION: IGenericRecord = {
    INSTRUCTIONS:
        'Siga las instrucciones para habilitarse como facturador electrónico en caso tal de que ya lo sea igualmente continue para configurar FamiEFI como su proveedor tecnológico.',
    WELCOME_TITLE: '¡Bienvenido al módulo de Documentos electrónicos!',
    STEPS_TITLE: 'Cómo habilitarse como facturador electrónico',
    STEPS: 'Tan sencillo como hacerlo en 3 simples pasos',
    ACCOMPANIMENT: (
        <p className="electronic-biller__aid-description">
            <span className="font-allerbold">Acompañamiento</span>&nbsp; de un experto en facturación electrónica de
            <span className="font-allerbold"> diggi pymes </span>
            para entender este módulo.
        </p>
    ),
    DEFINITIONS: (
        <p className="electronic-biller__aid-description">
            <span className="font-allerbold">Definiciones cortas</span> y claras de los términos que encontrará en la factura
            electrónica y que usted podría no conocer
        </p>
    ),
    ENABLEMENT: (
        <p className="electronic-biller__aid-description">
            <span className="font-allerbold">Instrucciones</span>&nbsp; dadas por la &nbsp;
            <Link
                id={generateId({
                    module: ModuleApp.ELECTRONIC_DOCUMENTS,
                    submodule: `dian-enablement`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.LNK,
                })}
                classes="text-sm leading-4"
                linkColor={LinkColor.PURPLE}
                text="DIAN"
                href={dianLinks[TypeLinkDian.RUT_DIAN].url}
                target="_blank"
                download
            />
            &nbsp; de cómo habilitarse en su sistema de facturación electrónica
        </p>
    ),
    COMPANY_INFORMATION: (
        <>
            <p className="mb-2 text-base text-gray-dark">
                Agregue la información básica, información de contacto y detalles tributarios de su empresa.
            </p>
            <p className="text-lg text-purple font-allerbold">
                El nombre, tipo de documento y número de documento debe coincidir con la información del RUT de no hacerlo sus
                documentos electrónicos serán rechazados por la DIAN.
            </p>
        </>
    ),
    COMPANY_FIELDS:
        'Esta información es necesaria porque se verá reflejada en el encabezado de su factura electrónica de venta y además le permitirá cumplir con la información requerida por la DIAN.',
    TITLE_INFORMATION_BULB: '¿Por qué es necesaria esta información?',
    BUTTON_NEXT: 'Ir al paso siguiente',
};

export const STEP_DATA: IGenericRecord = {
    COMPANY_INFORMATION: {
        title: 'Paso 1: Datos de la empresa',
    },
    COMPANY_FULL_DATA: {
        title: 'Paso 1: Datos de la empresa',
    },
    DIAN_REGISTRATION: {
        title: 'Paso 2: Registro en la DIAN',
    },
    ENABLEMENT: {
        title: 'Paso 3: Habilitación como facturador electrónico en la DIAN',
    },
    BUTTON_BACK_DR: 'Regresar al paso anterior',
    BUTTON_NEXT_DR: 'Ir al paso siguiente',
    BUTTON_BACK_EN: 'Regresar al paso anterior',
};

export const DIAN_REGISTER_STEPS: IStep[] = [
    {
        step: '2.1',
        indication: (
            <p className="text-white">
                Ingresa a la página de la DIAN &nbsp;
                <Link
                    id={generateId({
                        module: ModuleApp.ELECTRONIC_DOCUMENTS,
                        submodule: `dian-registration-go-enablement`,
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.LNK,
                    })}
                    href={dianLinks[TypeLinkDian.PAGE_DIAN].url}
                    text={dianLinks[TypeLinkDian.PAGE_DIAN].text}
                    linkColor={LinkColor.PURPLE}
                    download
                    target="_blank"
                />
                &nbsp; &nbsp; y elige la opción &quot;Habilitación&quot;.
            </p>
        ),
        image: 'dian-registration1',
        styles: {
            width: '54.125rem',
            height: '21.625rem',
        },
    },
    {
        step: '2.2',
        indication:
            'Seleccione su tipo de usuario, si es empresa o persona para iniciar sesión. Luego, diligencie la información solicitada en el formulario.',
        image: 'dian-registration2',
        styles: {
            width: '28.25rem',
            height: '21.625rem',
        },
    },
    {
        step: '2.3',
        indication:
            'Después de hacer click en el botón "Entrar". A su dirección de correo electrónico registrada en el RUT le llegará un correo con el link habilitado para acceder a la plataforma y lo dirigirá a la plataforma de la DIAN.',
        image: 'dian-registration3',
        styles: {
            width: '55rem',
            height: '19.3125rem',
        },
    },
    {
        step: '2.4',
        indication: 'Acceda al menú principal y seleccione Registro y habilitación opción “Documentos electrónicos”',
        image: 'dian-registration4',
        styles: {
            width: '53.9375rem',
            height: '21.625rem',
        },
    },
    {
        step: '2.5',
        indication: 'Seleccione como tipo de documento la opción "Factura electrónica"',
        image: 'dian-registration5',
        styles: {
            width: '54.125rem',
            height: '19.3125rem',
        },
    },
    {
        step: '2.6',
        indication:
            'En esta pantalla aparecen los datos de la empresa, revise que estén correctos y haga click en "configurar modos de operación"',
        image: 'dian-registration6',
        styles: {
            width: '54.125rem',
            height: '19.3125rem',
        },
    },
    {
        step: '2.7',
        indication:
            'Seleccione el modo de operación, los datos de la empresa Centro de Consultoría para la competitividad CCXC COLOMBIA SAS y de software FamiEFI.',
        image: 'dian-registration7',
        styles: {
            width: '24.6875rem',
            height: '21.625rem',
        },
    },
    {
        step: '2.8',
        indication:
            'Confirme en el listado de modos de operación asociados que su software es FamiEFI. Luego continue con el set de pruebas de facturación electrónica descrito en el paso 3.',
        image: 'dian-registration8',
        styles: {
            width: '54.125rem',
            height: '10.0625rem',
        },
    },
    {
        step: '2.9',
        image: 'dian-registration-finished',
        styles: {
            width: '46.6rem',
            height: '14.875rem',
            marginTop: '4.4375rem',
        },
    },
];

export const ENABLING_STEPS: IStep[] = [
    {
        step: '3.1',
        indication: (
            <p className="text-white">
                Haga click en el ícono <Icon className="inline-block w-5.5 h-5.5" name="eyeBlue" /> llamado &quot;Detalle de set
                de pruebas&quot; en la columna de &quot;Acciones&quot; para ser redirigido a las pruebas de aceptación de la DIAN
            </p>
        ),
        image: 'enablement1',
        styles: {
            width: '54.125rem',
            height: '10.0625rem',
        },
    },
    {
        step: '3.2',
        indication: ({ anchorEl, mouseProps, tooltip, anchorElTest, mousePropsTest, tooltipTest }): JSX.Element => (
            <>
                <p className="text-white">
                    Haga click en el botón &quot;Set de pruebas&quot; &nbsp;
                    <span className="inline-block ml-1" {...mouseProps}>
                        <Icon className="inline-block w-4 h-4" name="infoBlue" />
                    </span>
                    &nbsp; para obtener el código TestSetID
                    <span className="inline-block ml-1" {...mousePropsTest}>
                        <Icon className="inline-block w-4 h-4" name="infoBlue" />
                    </span>
                </p>
                <Tooltip
                    placement="bottom-start"
                    anchorEl={anchorEl}
                    iconName="infoBlue"
                    description={tooltip.description}
                    title={tooltip.title}
                    wrapperClassName="rounded"
                />
                <Tooltip
                    placement="bottom-start"
                    anchorEl={anchorElTest}
                    iconName="infoBlue"
                    description={tooltipTest.description}
                    title={tooltipTest.title}
                    wrapperClassName="rounded"
                />
            </>
        ),
        image: 'enablement2',
        styles: {
            width: '54.125rem',
            height: '17.5rem',
        },
    },
    {
        step: '3.3',
        indication:
            'Copie el código TestSetID que se encuentra en la notificación y regrese a esta pantalla y haga click en botón siguiente para ingresarlo.',
        image: 'enablement3',
        styles: {
            width: '54.125rem',
            height: '18.875rem',
        },
    },
    {
        step: '3.4',
        indication: ({ anchorElTest, mousePropsTest, tooltipTest }): JSX.Element => (
            <div className="flex flex-col">
                <p className="text-white">
                    Ingrese el código TestSetID &nbsp;
                    <span className="inline-block ml-1" {...mousePropsTest}>
                        <Icon className="inline-block w-4 h-4" name="infoBlue" />
                    </span>
                    &nbsp; en {PRODUCT_NAME}.
                </p>
                <p className="text-white">
                    Está a punto de completar el set de pruebas sólo falta un paso para habilitarse como facturador electrónico.
                </p>
                <Tooltip
                    placement="bottom-start"
                    anchorEl={anchorElTest}
                    iconName="infoBlue"
                    description={tooltipTest.description}
                    title={tooltipTest.title}
                    wrapperClassName="rounded"
                />
            </div>
        ),
        image: '',
    },
    {
        step: '3.5',
        indication: ({ anchorElSign, mousePropsSign, tooltipSign }): JSX.Element => (
            <>
                <p className="text-white">
                    Seleccione el tipo de certificado de firma digital &nbsp;
                    <span className="inline-block ml-1" {...mousePropsSign}>
                        <Icon className="inline-block w-4 h-4" name="infoBlue" />
                    </span>
                    &nbsp; entre gratuito o propio. Una vez haya finalizado el set de prueba diggi pymes le notificará. Este
                    proceso puede tardar máximo 48 horas.
                </p>
                <Tooltip
                    placement="bottom-start"
                    anchorEl={anchorElSign}
                    iconName="infoBlue"
                    description={tooltipSign.description}
                    title={tooltipSign.title}
                    wrapperClassName="rounded"
                />
            </>
        ),
    },
    {
        step: '3.6',
        image: 'enablement-finished',
        styles: {
            width: '45.8125rem',
            height: '18.5069rem',
            marginTop: '5rem',
        },
    },
];

export const getCertificateOptions = ({
    mouseProps,
    anchorEl,
    mousePropsSecond,
    anchorElSecond,
    activeTooltip,
    activateTooltip,
}: IGenericRecord): IEntity[] => [
    {
        name: Certificate.Gratuitous,
        label: 'Certificado gratuito',
        labelElement: (
            <div className="flex items-center w-full">
                <p className="w-full text-xs text-center">Certificado gratuito</p>
                <img
                    className="inline-block w-4 h-4 ml-2"
                    src={informationIcon}
                    alt="Information"
                    onMouseEnter={(): void => activateTooltip(Certificate.Gratuitous)}
                    {...mouseProps}
                />
                <Tooltip
                    placement="bottom-start"
                    anchorEl={anchorEl}
                    iconName="infoBlue"
                    description={
                        activeTooltip === Certificate.Gratuitous ? (
                            <p className="text-sm text-blue">
                                <span className="font-allerbold">Certificado gratuito:</span>
                                &nbsp; Si no cuenta con un certificado de firma digital, puede usar el de &nbsp;
                                <span className="font-allerbold">{PRODUCT_NAME}</span> sin ningún costo.
                            </p>
                        ) : (
                            <p className="text-sm text-blue">
                                <span className="font-allerbold">Certificado propio:</span> Si ya cuenta con un certificado de
                                firma digital con alguno de los proveedores autorizados (certicámara, Andes, Edicom etc.),.
                            </p>
                        )
                    }
                />
            </div>
        ),
    },
    {
        name: Certificate.Own,
        label: 'Certificado propio',
        labelElement: (
            <div className="flex items-center w-full">
                <p className="w-full text-xs text-center">Certificado propio</p>
                <img
                    className="inline-block w-4 h-4 ml-2"
                    src={informationIcon}
                    alt="Information"
                    onMouseEnter={(): void => activateTooltip(Certificate.Own)}
                    {...mousePropsSecond}
                />
                <Tooltip
                    placement="bottom-start"
                    anchorEl={anchorElSecond}
                    iconName="infoBlue"
                    description={
                        activeTooltip === Certificate.Own ? (
                            <p className="text-sm text-blue">
                                <span className="font-allerbold">Certificado propio:</span>
                                &nbsp; Si ya cuenta con un certificado de firma digital con alguno de los proveedores autorizados
                                (certicámara, Andes, Edicom etc.),.
                            </p>
                        ) : (
                            <p className="text-sm text-blue">
                                <span className="font-allerbold">Certificado propio:</span> Si ya cuenta con un certificado de
                                firma digital con alguno de los proveedores autorizados (certicámara, Andes, Edicom etc.),.
                            </p>
                        )
                    }
                />
            </div>
        ),
    },
];

export const getText = (text: string | JSX.Element, isTop = true): string | JSX.Element => {
    return typeof text === STRING ? <p className={`text-center text-gray-dark ${isTop ? 'mb-7' : 'mt-7'}`}>{text}</p> : text;
};

export const TOOLTIP_CONTRIBUTOR = (
    <ul className="ml-5 list-disc">
        <li>
            <span className="text-sm font-allerbold text-blue">Persona natural:</span> cuando el cliente actúa a título personal.
        </li>
        <li className="mt-4">
            <span className="text-sm font-allerbold text-blue">Persona jurídica:</span> cuando el cliente actúa en representación
            de una sociedad conformada por una o mas personas.
        </li>
    </ul>
);
