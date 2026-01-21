import React from 'react';
import { ColorPicker } from '@components/color-picker';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Select } from '../select';
import { OPTIONS } from '..';
import { IToolsProps, Opacity, SpinOption, Icon, SelectLink } from '.';

export const IconTools: React.FC<IToolsProps> = ({ handleStyleChange, style }) => {
    return (
        <div className="flex flex-1 gap-2">
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-icon-tools-color`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'color', value })}
                value={style?.color}
            />
            <span className="border-l-1 border-gray-smoke" />
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-icon-tools-turn`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                placeholder="Girar"
                options={OPTIONS.TURN}
                handleChange={(value: string): void => handleStyleChange({ name: 'turn', value })}
                value={style?.turn}
                customOption={SpinOption}
                wrapperClassName="basic-editor__select--turn"
            />
            <span className="border-l-1 border-gray-smoke" />
            <Opacity
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-icon-tools-opacity`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'opacity', value })}
                value={style?.opacity}
            />
            <span className="border-l-1 border-gray-smoke" />
            <SelectLink handleStyleChange={handleStyleChange} style={style} />
            <span className="border-l-1 border-gray-smoke" />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-icon-tools`,
                    action: ActionElementType.PUT_FORWARD,
                    elementType: ElementType.ICO,
                })}
                name="putForward"
                className="icon-size--common"
                onClick={(): void => handleStyleChange({ name: 'zIndex', value: 10 })}
            />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-icon-tools`,
                    action: ActionElementType.PUT_BACK,
                    elementType: ElementType.ICO,
                })}
                name="putBack"
                className="icon-size--common"
                onClick={(): void => handleStyleChange({ name: 'zIndex', value: 0 })}
            />
        </div>
    );
};
