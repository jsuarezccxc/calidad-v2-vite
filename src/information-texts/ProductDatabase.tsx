import React, { ReactElement } from 'react';
import { Icon } from '@components/icon';
import { PRODUCT_NAME } from '@constants/ProductName';
import { IGenericRecord } from '@models/GenericRecord';
import { InformationBulb } from '@components/information';
import { documentText } from '@utils/ElectronicInvoice';
import { buildTextInvoices } from '@utils/Warehouse';

export const PRODUCT_DATABASE = {
    TITLE: 'Agregar producto/servicio',
    DESCRIPTION: 'Agregue la información requerida para agregar su producto/servicio a la ficha técnica.',
    QUESTION: '¿Para que se utiliza la información agregada en el producto/servicio?',
    DESCRIPTION_POP_UP:
        'La información agregada en el producto/servicio se utiliza para vender en su sitio web y en la tienda física. Adicionalmente incluye los datos requeridos para generar los documentos electrónicos.',
};

export const METHOD_ADD = {
    TITLE: 'Método para agregar producto/servicio',
    DESCRIPTION: 'Seleccione la opción para agregar un producto/servicio',
    CLASSIFICATION: 'Clasificación de producto/servicios',
};

export const INFORMATION = {
    SERVICE: (
        <p>
            <span>Servicios: </span> Acciones o actividades ofrecidas para satisfacer necesidades específicas o realizar tareas
            determinadas.
        </p>
    ),
    PRODUCT: (
        <p className="text-blue">
            <span>Producto: </span> Elemento que satisface una necesidad o deseo del consumidor.
        </p>
    ),
};

export const BASIC_INFORMATION = {
    TITLE: 'Información básica',
    DESCRIPTION: 'Escriba el nombre del producto/servicio, la unidad de medida, la descripción y agregue variantes si aplica.',
    SUN_EDITOR_TITLE: 'Descripción del producto/servicio:',
    SUN_EDITOR:
        'Descripción del producto/servicio: Texto breve que explica las características principales y los beneficios de un producto o servicio, proporcionando información esencial para ayudar a los clientes en su decisión de compra.',
    VARIANTS_TITLE: 'Variantes',
    VARIANTS_DESCRIPTION: (
        <p className="cursor-default">
            Si este producto lo vende diferenciado por talla, color u otro, haga click en &nbsp;
            <span className="text-green">+ Agregar variantes</span>.
        </p>
    ),
    VARIANTS_DESCRIPTION_TOOLTIP: (
        <p className="text-sm font-aller">
            <span className="text-sm font-allerbold">Variantes:</span> diferentes opciones disponibles para un mismo producto,
            como tallas, colores o especificaciones.
        </p>
    ),
    VARIANTS_DESCRIPTION_ADD: (
        <div>
            <p className="mt-2 text-base font-aller text-gray-dark mb-4.5 cursor-default">
                Agregue las variantes de su producto/servicio. Para cada variante agregue las opciones que apliquen y presione
                enter.
            </p>
        </div>
    ),
};

export const ADD_PRICE_CODE = {
    TITLE: 'Código del producto/servicio y valor de venta',
    DESCRIPTION: (uniqueProduct: boolean): JSX.Element => (
        <>
            <p>Agregue un código único para identificar (SKU) el producto/servicio y el valor unitario de venta.</p>
            {!uniqueProduct && (
                <p className="mt-4.5 text-base font-aller mb-4.5">
                    <span className="font-allerbold">{PRODUCT_NAME}</span> le genera las distintas variantes creadas de acuerdo a
                    lo agregado en el paso anterior. Seleccione las variantes que aplican a su catálogo y agregue la información
                    por variante.
                </p>
            )}
        </>
    ),
};

export const TOOLTIP = {
    VARIANTS_TABLE: (
        <p className="text-sm text-gray-dark">
            <span className="font-allerbold">Variantes:</span> diferentes opciones disponibles para un mismo producto, como
            tallas, colores o especificaciones.
        </p>
    ),
};

export const ADD_IMAGES = {
    TITLE: 'Agregar imágenes',
    DESCRIPTION: (
        <>
            <p className="text-gray-dark">
                Suba la(s) imagen(es) que correspondan a su producto/servicio haciendo click en el recuadro de
                <span className="text-green">+ Agregar imagen.</span> Visualice en miniatura las imágenes subidas.
            </p>
            <ul className="pl-6 list-disc">
                <li>
                    Para eliminar una imagen haga click sobre el ícono <Icon name="trashBlue" classIcon="w-4.5 inline" />.
                </li>
                <li>
                    Para editar y reemplazar una imagen haga click sobre el ícono&nbsp;
                    <Icon name="editBlue" classIcon="w-4.5 inline" />.
                </li>
            </ul>
        </>
    ),
    DESCRIPTION_VARIANTS: (
        <p className="text-gray-dark">
            Asigne las imágenes subidas a cada variante. Tenga en cuenta que puede asignar máximo 5 imágenes por cada variante.
            Asigne la imagen principal pasando el cursor sobre la imagen y haga click en el icono&nbsp;
            <Icon name="starYellow" classIcon="w-4.5 inline" /> .
        </p>
    ),
};

export const ADD_INVENTORY = {
    TITLE: 'Agregar inventario inicial para utilizar diggi pymes',
    SUB_TITLE: 'Inventario inicial',
    SUB_TITLE_DESCRIPTION: (
        <p className="text-sm font-aller">
            <span className="text-sm font-allerbold">Inventario inicial:</span> es la cantidad de unidades de productos
            disponibles para la venta al comienzo de un periodo.
        </p>
    ),
    DESCRIPTION_BULB: ' ¿Donde se registra en diggi pymes la información de Inventario Inicial?',
    DESCRIPTION_BULB_TOOLTIP:
        ' En diggi pymes, los valores del inventario inicial se registran en dos secciones. Primero, en la sección de Armar Producto, se solicita al empresario que registre cuántas unidades disponibles para la venta tiene de cada producto y en qué lugar están almacenadas, lo cual se identifica como "bodega". Además, en el módulo Sitio Web y Tienda Virtual, se le pide al empresario que actualice los datos del inventario inicial de las unidades disponibles para la venta de cada producto. También tiene la opción de actualizar la ubicación donde almacena estas unidades, si así lo prefiere.',
    TEXT_DESCRIPTION: (
        <div>
            <p className="add-inventory__description">
                El inventario inicial es el valor y la cantidad de unidades disponibles para la venta de productos, incluyendo
                todas sus características contables. Al comenzar a utilizar diggi pymes, solicitamos esta información para dar
                inicio al registro contable de sus movimientos de inventario.
            </p>
        </div>
    ),
    notDeletedInventory: (
        name: string,
        warehouse: string,
        documents: IGenericRecord[],
        includesBstches = false
    ): ReactElement => {
        return (
            <div className="flex flex-col items-center justify-center w-full xs:h-80 xs:p-11 xs:pb-0">
                <Icon name="triangleInfoMulticolor" />
                <h4 className="px-10 mt-2 ml-2 text-xl text-center text-blue font-allerbold leading-xl">
                    La {includesBstches ? 'bodega/lote' : 'bodega'} no se ha eliminado
                </h4>
                <p className="mt-2 text-center text-gray-dark">
                    La <span className="font-allerbold">{`${includesBstches ? 'bodega/lote' : 'bodega'} ${warehouse} `}</span> no
                    se ha eliminado porque el <span className="font-allerbold">{`producto ${name} `}</span> se encuentra en un
                    proceso pendiente de transmisión en &nbsp;
                    <span className="font-allerbold">{buildTextInvoices(documents)}</span>. Una vez se finalice este proceso puede
                    eliminar el producto/servicio.
                </p>
            </div>
        );
    },
};

export const ADD_TAXES = {
    TITLE: 'Agregue los  Impuestos',
    DESCRIPTION: (edit = false): JSX.Element => (
        <p className="text-sm text-gray-dark font-aller">
            {edit ? 'Edite' : 'Agrege'} y visualice los impuestos para sus productos y/o servicios, para eliminar un impuesto
            seleccione el recuadro de la izquierda de la tabla y después haga click en el icono
            <Icon name="trashBlue" classIcon="w-4.5 inline" /> .
        </p>
    ),
    DESCRIPTION_IVA: (
        <p className="text-sm text-gray-dark font-aller">
            <span className="font-allerbold text-blue">IVA:</span> es el impuesto al valor agregado es un valor adicional que se
            aplica al precio de cada producto/servicio.Si dese consultar sobre este impuesto ingrese al siguiente link:
            <span className="underline text-purple">Ver más...</span>
        </p>
    ),
    DESCRIPTION_IBUA: (
        <p className="text-sm text-gray-dark font-aller">
            <span className="font-allerbold text-blue">IBUA bebidas azucaradas:</span> es el impuesto a las bebidas ultra
            procesadas azucaradas, hace parte a los impuestos saludables. Si dese consultar sobre este impuesto ingrese al
            siguiente link: <span className="underline text-purple">Ver más...</span>
        </p>
    ),
    DESCRIPTION_ICUI: (
        <p className="text-sm text-gray-dark font-aller">
            <span className="font-allerbold text-blue">ICUI comestibles ultraprocesados:</span>ICUI comestibles ultraprocesados:
            es el impuesto a los productos comestibles ultraprocesados industrialmente y/o con alto contenido de azúcares
            añadidos, sodio o grasas saturadas. Si dese consultar sobre este impuesto ingrese al siguiente link:
            <span className="underline text-purple">Ver más...</span>
        </p>
    ),
    DESCRIPTION_INC: (
        <>
            <p className="text-sm font-aller">
                <span className="font-allerbold text-blue">ICUI comestibles ultraprocesados:</span> INC Impuesto al consumo: es un
                impuesto generado por la prestación o la venta al consumidor final, o la importación por parte del usuario final,
                de los siguientes bienes y servicios:
            </p>
            <ul className="mt-5 ml-10 list-disc xs:ml-4 ">
                <li> La prestación del servicio de telefonía móvil.</li>
                <li>
                    La venta de algún bien corporal mueble de producción doméstica o importado (vehículos automóviles, barcos,
                    aviones).
                </li>
                <li>El servicio de expendio de comidas y bebidas preparadas.</li>
                <li>
                    La entrega de bolsas plásticas cuya finalidad sea cargar o llevar productos enajenados por los
                    establecimientos comerciales.
                </li>
            </ul>
            <p className="text-sm font-aller">
                Si dese consultar sobre este impuesto ingrese al siguiente link:
                <span className="underline text-purple">Ver más</span>
            </p>
        </>
    ),
    TITLE_IVA: 'IVA',
    DESCRIPTION_IBUA_SELECT: (
        <>
            <span className="text-base text-gray-dark">
                El impuesto a bebida azucarada se cobra con respecto al contenido de gramos azúcar por cada 100 mililitros de las
                bebidas. Determine a cual le corresponde.
            </span>
            <span className="text-base text-gray-dark mt-4.5">Seleccione el contenido de azúcar por cada 100 mililitros.</span>
        </>
    ),
    DESCRIPTION_ADD_CONTENT: (
        <p className="my-4.5 font-aller text-gray-dark">
            Agregue el contenido neto de su producto para que <span className="font-allerbold">diggi pymes</span> realice el
            cálculo del valor del impuesto. El contenido neto lo encuentra en la etiqueta del producto.
        </p>
    ),
};

export const MASSIVE_UPLOAD = {
    TITLE: 'Agregar producto/servicio a través de Excel',
    DESCRIPTION: (urlDownload: string): React.ReactElement => (
        <>
            <InformationBulb
                text=" ¿Por qué es importante agregar sus productos/servicios a través de excel?"
                textDescription="Porque le permite agregar una mayor cantidad de productos que le ayudará a ahorrar tiempo, reducir errores, mejorará la productividad y la actualización será más ágil."
            />
            <p>
                Haga click en &nbsp;
                <a className="text-base underline cursor-pointer text-purple" href={urlDownload}>
                    plantilla agregar producto/servicios a través de excel
                </a>
                &nbsp; para descargar un ejemplo del formato requerido. Una vez haya terminado de agregar la información de sus
                productos a excel, vuelva a subir el archivo en el cuadro que se muestra a continuación y haga click en validar.
            </p>
        </>
    ),
    DESCRIPTION_SAVE: (
        <p className="mt-2 text-base font-aller">
            Una vez la validación sea exitosa haga click en <span className="text-base font-allerbold"> Guardar</span> para
            continuar con el proceso.
        </p>
    ),
    ERROR_MASSIVE_PRODUCTS: (location: string): React.ReactElement => (
        <div className="flex items-start gap-2 mt-4">
            <Icon name="infoPurple" />
            <p className="text-sm text-purple">
                {`
                    Errores detectados en el archivo subido debido a formatos incorrectos, datos faltantes e información inválida
                    en los siguientes campos: (${location}).`}
                <br />
                <span className="text-sm text-purple">
                    Una vez haga las correcciones, vuelva a subir la plantilla de carga masiva
                </span>
            </p>
        </div>
    ),
    NO_FILE: (
        <p className="flex items-center gap-2 mt-4.5">
            <Icon name="infoPurple" />
            <span className="text-sm text-purple">No ha ingresado ningún archivo</span>
        </p>
    ),
    VALID_FILE: (
        <p className="flex items-center gap-2 mt-4.5">
            <Icon name="checkGreen" />
            <span className="text-sm text-green">
                ¡Validación Exitosa! El archivo cargado ha sido validado con éxito y no contiene errores.
            </span>
        </p>
    ),
};

export const PRODUCT_CATALOG = {
    TITLE: 'Ficha técnica de productos/servicios',
    QUESTION: '¿Para que se utiliza la información agregada en el producto/servicio?',
    DESCRIPTION: (
        <p className="text-gray-dark text-base lg:w-231 pr-4.25 lg:break-all xs:pr-0 xs:px-1">
            En esta sección, gestione los productos/servicios disponibles. Para ver el detalle de cada uno, haga clic en el nombre
            del producto/servicio. Para eliminar la información de su producto/servicio, seleccione el recuadro de la izquierda de
            la tabla y después haga clic en el icono &nbsp;
            <Icon name="trashBlue" classIcon="w-5 h-5 -mt-1.5 -mx-1 inline" />. Los productos/servicios agregados en esta sección
            se utilizan para vender en su sitio web y en la tienda física.
        </p>
    ),
    DETAIL_TITLE: 'Detalle del producto/servicio',
    DETAIL_DESCRIPTION: 'A continuación detalle y edite la información del producto/servicio.',
    modalDelete: (singleProductSelected: boolean): React.ReactElement => (
        <>
            <h4 className="mt-2 text-xl text-center font-allerbold text-blue">{`Eliminar ${
                singleProductSelected ? 'producto/servicio' : 'productos/servicios'
            }`}</h4>
            <p className="px-10 mt-2 text-center text-gray-dark">{`¿Está seguro que desea eliminar ${
                singleProductSelected ? 'el producto/ servicio seleccionado?' : 'los productos/ servicios seleccionados'
            }`}</p>
        </>
    ),
    notDeletedProduct: (name: string, documents: IGenericRecord[]): ReactElement => {
        return (
            <div className="flex flex-col items-center justify-center w-full xs:h-80 xs:p-11 xs:pb-0">
                <Icon name="triangleInfoMulticolor" />
                <h4 className="px-10 mt-2 ml-2 text-xl text-center text-blue font-allerbold leading-xl">
                    El producto/servicio no se ha eliminado
                </h4>
                <p className="mt-2 text-center text-gray-dark">
                    El producto/servicio <span className="font-allerbold">{name}</span> no se ha eliminado porque se encuentra en
                    un proceso pendiente de transmisión en &nbsp;
                    <span className="font-allerbold">{documentText(documents)}</span>. Una vez se finalice este proceso puede
                    eliminar el producto/servicio.
                </p>
            </div>
        );
    },
};

export const EDIT = {
    TITLE: 'Editar producto/servicio ',
    TITLE_TAX: 'Edite los  Impuestos',
    DESCRIPTION_TAX:
        'Edite y visualice los impuestos para sus productos y/o servicios, para eliminar un impuesto seleccione el recuadro de la izquierda de la tabla y después haga click en el icono.',
};
