import React from 'react';
import { Link, LinkColor } from '@components/button';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';

export const CALENDAR_PLANNING = {
    DESCRIPTION_PREVIEW: (
        <p className="mb-4.5">Para ver el formulario que aparecerá en su sitio web haga click en Previsualizar.</p>
    ),
    DESCRIPTION_FORM: (
        <p className="mb-4.5">
            El formulario de citas estará disponible en la pantalla &nbsp;
            <Link
                id={generateId({
                    module: ModuleApp.CALENDAR_PLANNING,
                    submodule: `selection-tabs.edit`,
                    action: ActionElementType.REDIRECT,
                    elementType: ElementType.LNK,
                })}
                text="Diseño de pestañas, imágenes y descripción de productos/servicios"
                linkColor={LinkColor.PURPLE}
                href="/selection-tabs-edit"
                classes="ml-1 text-base"
            />
            &nbsp; al agregar la plantilla Formulario citas. Agregue esta plantilla en la página que requiera de su sitio web.
        </p>
    ),
    DESCRIPTION_NOTIFICATION_SETTINGS: (
        <>
            <p className="mt-2">
                Las notificaciones de este módulo que fueron configuradas en el módulo Perfil de la empresa se muestran en esta
                sección. Si no realizó la configuración en ese módulo, puede hacerlo desde esta pantalla. Todos los cambios
                realizados aquí, se aplicarán también en la configuración de notificaciones en el módulo Perfil de la empresa.
            </p>
            <p className="mt-2">A continuación se explica la siguiente notificación</p>
            <p className="mt-4.5 ml-4.5">
                1. Cuando su cliente agende una cita desde el sitio web se genera una notificación para aceptar o rechazar la
                cita.
                <br />
                2. Se genera una notificación 10 minutos antes de una cita agendada en el calendario.
            </p>
            <p className="mt-4.5">
                Todas las notificaciones serán enviadas a la pantalla de
                <Link
                    id={generateId({
                        module: ModuleApp.CALENDAR_PLANNING,
                        submodule: `daily-notification`,
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.LNK,
                    })}
                    text="notificaciones diarias"
                    linkColor={LinkColor.PURPLE}
                    href="/calendar-notification"
                    classes="ml-1 text-base"
                />
                &nbsp; a la que puede acceder por la barra superior azul y por el menú del lado izquierdo verde en la pestaña de
                Planeación y organización.
            </p>
        </>
    ),
};
