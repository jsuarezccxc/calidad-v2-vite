import React, { useContext } from 'react';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';
import { ELEMENT_INFORMATION, ELEMENTS } from '@information-texts/WebsiteElements';
import { ElementType } from '@models/WebsiteNode';
import { ElementType as ElementTypeId, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ICardProps, LIST_BASIC_ELEMENTS } from '.';
import { ElementsContext } from '../../context';

export const Card: React.FC<ICardProps> = React.memo(({ element, selectElement }) => {
    const { selectElement: onClickSelectElement } = useContext(ElementsContext);

    const { name, icon, type } = element;
    const { anchorEl, mouseProps } = usePopper();

    return (
        <div
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `editor-sidebar-card-${name}`,
                action: ActionElementType.INFO,
                elementType: ElementTypeId.CRD,
            })}
            className="sidebar__card"
            onClick={(): void => {
                selectElement(element);
                LIST_BASIC_ELEMENTS.includes(type) && onClickSelectElement(null);
            }}
        >
            <div className="sidebar__card-icon">
                <Icon name={icon} className="cursor-pointer icon--width" />
                <Tooltip
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-sidebar-card-${name}`,
                        action: ActionElementType.INFO,
                        elementType: ElementTypeId.TOOL,
                    })}
                    anchorEl={anchorEl}
                    description={ELEMENT_INFORMATION[type]}
                    wrapperClassName={`${type === ElementType.Button ? 'pr-0 w-64' : ''} rounded-lg`}
                    title={name === ELEMENTS.CAROUSEL.NAME ? 'Carrusel imágenes y productos/ servicios' : name}
                    placement="bottom-start"
                />
                <span {...mouseProps} className="absolute -bottom-1 -right-1">
                    <Icon name="addGreen" className="w-5 h-5 cursor-pointer" />
                </span>
            </div>
            <p className="sidebar__card-name">{name}</p>
        </div>
    );
});
