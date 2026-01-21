import React from 'react';
import { Icon } from '@components/icon';
import { Link, LinkColor } from '@components/button';
import { getRoute } from '@utils/Paths';
import { Routes } from '@constants/Paths';
import { INotFindElements } from '.';

/**
 * Not find elements is a component that shows a text when search not found anything.
 */
export const NotFindElements: React.FC<INotFindElements> = ({
    classesWrapper = '',
    classesIcon = '',
    classesText = '',
    withoutData = false,
    module = 'productos/ servicios',
    href = '',
    customText = '',
    onClick = (): void => {},
}) => {
    const changeLetter = (module: string): string => {
        const letter = module[module.length - 2];
        return `agregarl${letter === 'e' ? 'a' : letter || '0'}s`;
    };

    return (
        <div className={`flex items-center mt-4.5 text-blue xs:items-start ${classesWrapper}`}>
            <Icon name={withoutData ? 'warningBlue' : 'searchBlue'} className={`mr-2 w-5.5 h-5.5 self-start ${classesIcon}`} />
            <p className={`cursor-default ${classesText}`}>
                {customText ? (
                    customText
                ) : withoutData ? (
                    <>
                        Hasta el momento no ha agregado {module}, &nbsp;
                        <Link
                            href={href || getRoute(Routes.HOME)}
                            text="haga click aquí"
                            classes="text-base"
                            linkColor={LinkColor.PURPLE}
                            onClick={onClick}
                        />
                        &nbsp; para {changeLetter(module)}.
                    </>
                ) : (
                    'No se encontraron resultados para esa búsqueda.'
                )}
            </p>
        </div>
    );
};
