import * as React from 'react';

export const PARAGRAPHS = {
    TITLE_SEND_MAIL: 'Enviar cotización por correo',
    DESCRIPTION_SEND_MAIL: (
        <>
            <p className="mb-4">
                Desde esta pantalla puede enviar la cotización generada por correo electrónico a su cliente.
            </p>
            <p className="mb-4">
                Complete los campos requeridos como el <span className="font-allerbold">correo electrónico</span> del destinatario,
                el <span className="font-allerbold">asunto</span> y el <span className="font-allerbold">contenido</span> del mensaje.
            </p>
            <p className="mb-4">
                Opcionalmente puede agregar una imagen como adjunto. Los formatos permitidos son PNG, JPG y JPEG con un
                tamaño máximo de 5MB.
            </p>
            <p className="mb-4">
                Una vez completada la información, haga click en <span className="font-allerbold">Enviar correo</span> para
                enviar la cotización a su cliente.
            </p>
        </>
    ),
};

export const UI_MESSAGES = {
    SEND_EMAIL_TITLE: 'Enviar correo - Cotización #{number}',
    EDIT_TEMPLATE_TITLE: 'Editar plantilla de correo',
    BUTTON_LABELS: {
        BACK: 'Atrás',
        PREVIEW: 'Previsualizar',
        SEND_EMAIL: 'Enviar correo',
        ACCEPT: 'Aceptar',
    },
    MODALS: {
        SUCCESS: {
            TITLE: 'Correo enviado',
            DESCRIPTION: '¡El correo se ha enviado con éxito al destinatario!',
        },
        ERROR: {
            TITLE: 'Error al enviar correo',
            DESCRIPTION: 'Ha ocurrido un error al enviar el correo. Por favor, inténtelo de nuevo.',
        },
    },
    EMAIL: {
        PLACEHOLDER: 'Ej: correo@correo.com; otro@correo.com',
        TOOLTIP: 'Ingrese una o varias direcciones de correo electrónico separadas por punto y coma (;)',
        ERROR: 'Por favor ingrese un correo electrónico válido',
        LABEL: 'Correo electrónico:',
    },
    SUBJECT: {
        LABEL: '*Asunto',
        PLACEHOLDER: 'Ingrese el asunto del correo',
    },
    CONTENT: {
        LABEL: '*Contenido',
        PLACEHOLDER: 'Escriba el contenido del correo...',
        EDITOR_BUTTON: '🎨 Formato',
        SIMPLE_EDITOR: 'Editor simple',
        FORMATTED_EDITOR: 'Editor con formato',
        TOOLBAR_TOOLTIPS: {
            BOLD: 'Negrita',
            ITALIC: 'Cursiva',
            UNDERLINE: 'Subrayado',
            BULLET_LIST: 'Lista con viñetas',
            NUMBERED_LIST: 'Lista numerada',
            LINK: 'Enlace',
            FONT: 'Fuente',
        },
        FONTS: {
            HELVETICA: 'Helvetica Neue',
            ARIAL: 'Arial',
            TIMES: 'Times New Roman',
            COURIER: 'Courier New',
        },
        LINK_PROMPT: 'URL:',
        BULLET_SYMBOL: '•',
        NUMBER_SYMBOL: '1.',
        LINK_SYMBOL: '🔗',
        BACK_SYMBOL: '«',
    },
    UPLOAD: {
        LABEL: 'Agregar imagen:',
        UPLOAD_TEXT: 'Subir archivo png, jpg, jpge',
        SUCCESS_SYMBOL: '✓',
        SUCCESS_MESSAGE: 'Archivo seleccionado correctamente',
        SIZE_LIMIT_ERROR: 'El archivo no puede ser mayor a {size}MB',
        TYPE_ERROR: 'Solo se permiten archivos PNG, JPG o JPEG',
        SIZE_TEXT: 'Tamaño máximo: {size}MB',
        TOOLTIPS: {
            EDIT_FILE: 'Cambiar archivo adjunto',
            DELETE_FILE: 'Eliminar archivo adjunto',
        },
    },
    CHARACTER_COUNTER: {
        TEMPLATE: '{current}/{max} caracteres',
    },
} as const;