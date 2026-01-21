import React from 'react';
import { Icon } from '@components/icon';

export const ELEMENTS = {
    CAROUSEL: {
        NAME: 'Carrusel',
        DESCRIPTION:
            'Forma interactiva de mostrar variedad imágenes y productos/servicios en un solo lugar, como un catálogo en movimiento. Permite a los visitantes ver rápidamente lo que tiene para ofrecer.',
    },
};

export const ELEMENT_INFORMATION: { [key: string]: string | JSX.Element } = {
    BUTTON: (
        <p className="popper__description text-blue">
            Son figuras geométricas que se usan para activar una acción específica.
            <span className="flex">
                Por ejemplo: &nbsp;
                <button className="inline h-6 text-white rounded w-19.25 bg-blue">Siguiente</button>
            </span>
        </p>
    ),
    ICON: (
        <p className="popper__description text-blue">
            Es un elemento que facilita la identificación de un objeto o acción. Por ejemplo, un ícono que representa las
            notificaciones es: <Icon name="notificationsBlue" className="inline" />
        </p>
    ),
    IMAGE: 'Le da la opción de subir las imágenes que requiera y ubicarlas en el espacio de trabajo.',
    MAP: 'diggi pymes le ofrece sincronización con google maps para mostrar un punto geográfico específico.',
    SHAPE:
        'Figuras geométricas que se utilizan para decorar el sitio web. Por ejemplo utilice un círculo y agregue un texto encima de el.',
    TEXT:
        'Agregue un cuadro de texto con todas las características posibles de edición para escribir lo que requiera o elija una preselección de texto como títulos, subtítulos o textos corridos.',
    VIDEO: 'Le da la opción de enlazar los videos que requiera y ubicarlos en el espacio de trabajo.',
    BANNER:
        'Es un anuncio en el sitio web que combina imágenes y texto para promocionar productos o servicios. Está diseñado para llamar la atención de sus clientes y realizar rápidamente una compra.',
    BLOG:
        'Es un espacio donde puede compartir información útil sobre el negocio, consejos y noticias relevantes. Ayuda a conectar con los clientes y a construir una relación con ellos.',
    CAROUSEL:
        'Forma interactiva de mostrar variedad imágenes y productos/ servicios en un solo lugar, como un catálogo en movimiento. Permite a los visitantes ver rápidamente lo que tiene para ofrecer.',
    CATALOG:
        'Enlista y detalla los productos o servicios ofrecidos, facilitando a los clientes la búsqueda, comparación y comprensión de los productos, con descripciones, imágenes y precios, promoviendo ventas y proporcionar información de contacto.',
    COLLAGE:
        'Es una colección de imágenes y elementos visuales que puede usar en el sitio web para crear una presentación atractiva de sus productos, servicios o ideas. Ayuda a transmitir información de manera creativa y llamativa.',
    HEADER:
        'Es la parte superior del sitio web que contiene el logo o el nombre de su negocio y la navegación principal. Sirve como la introducción de su sitio web y ayuda a sus clientes a moverse y encontrar lo que necesitan fácilmente.',
    FORM:
        'Es un espacio donde los visitantes de su sitio web pueden proporcionar información importante, como sus datos de contacto o consultas. Le ayuda a recopilar información y facilita la comunicación con sus clientes.',
    FOOTER:
        'Es la parte inferior de su sitio web que contiene información útil como datos de contacto, enlaces importantes y términos legales. Facilita que sus clientes encuentren información importante y se comuniquen con el negocio.',
};

export const TAB_INFORMATION = {
    BASIC_ELEMENTS:
        'Son los elementos fundamentales como: texto, ícono, imagen, video, botón, formas, mapa, que se utilizan para diseñar el sitio web.',
    COMPOUND_ELEMENTS:
        'Los elementos compuestos son para facilitar la creación de secciones en su sitio web, incluye carrusel de productos, imágenes y/o promociones, encabezados, pies de página, formularios, banner de promociones, collage entre otros.',
    PREDESIGNED_TEMPLATES:
        'Las plantillas prediseñadas son páginas que  incluyen elementos como imágenes, catalogo, preguntas frecuentes, carruseles, contáctenos y más. Estas plantillas permiten tener una estructura definida para hacer un sitio web más fácil y rápido.',
};

export const TEMPLATE_INFORMATION = {
    HOMEPAGE: {
        TITLE: 'Página de inicio',
        INFORMATION:
            'La primera página con la cual se busca llamar la atención de sus usuarios, incluye fotografías, textos e iconos.',
    },
    COMPANY_INFORMATION: {
        TITLE: 'Información general de la empresa',
        INFORMATION:
            'Páginas prediseñadas que incluyen la descripción de su empresa, los productos que vende, su equipo de trabajo, la localización etc.',
    },
    ONLINE_STORE: {
        TITLE: 'Tienda virtual',
        INFORMATION:
            'Plantillas diseñadas para potenciar sus ventas. Incluyen secciones como descripción de la empresa con imagen, catálogo de productos, carrito de compras, preguntas frecuentes, carrusel de productos, banners promocionales, formulario de contacto y más.',
    },
};
