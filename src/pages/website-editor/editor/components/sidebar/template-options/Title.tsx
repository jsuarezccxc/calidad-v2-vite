import React from 'react';
import usePopper from '@hooks/usePopper';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ITitleProps } from '.';

export const Title: React.FC<ITitleProps> = React.memo(({ information, title }) => {
    const { anchorEl, mouseProps } = usePopper();

    return (
        <div className="flex gap-2">
            <div>
                <span {...mouseProps}>
                    <Icon name="infoGreen" alt="information" className="w-5.5 h-5.5 cursor-pointer" />
                </span>
            </div>
            <h2 className="text-sm font-allerbold text-gray-dark"> {title}</h2>
            <Tooltip
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-tab-template-title-${title}`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TOOL,
                })}
                anchorEl={anchorEl}
                description={information}
                iconName="infoBlue"
                title={`${title}:`}
                wrapperClassName="rounded-lg sidebar__template-popper"
            />
        </div>
    );
});
