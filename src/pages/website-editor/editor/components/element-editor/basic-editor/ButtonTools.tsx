import React from 'react';
import borderWidth from '@assets/images/border-width.svg';
import { ColorPicker } from '@components/color-picker';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Select } from '../select';
import { OPTIONS } from '..';
import { Icon, IToolsProps, BorderOption, SizeOptions, Opacity, BorderThicknessOption, SelectLink } from '.';

export const ButtonTools: React.FC<IToolsProps> = ({ handleStyleChange, style }) => {
    return (
        <div className="flex flex-1 gap-2">
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools-border-style`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                options={OPTIONS.BORDER}
                customOption={BorderOption}
                placeholder="Borde"
                handleChange={(value: string): void => handleStyleChange({ name: 'borderStyle', value })}
                value={style?.borderStyle}
                wrapperClassName="basic-editor__select--border"
            />
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools-border-thickness`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                customList={BorderThicknessOption}
                handleStyleChange={handleStyleChange}
                placeholder={<img alt="Border width" src={borderWidth} />}
                value={style?.borderWidth}
            />
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools-color-picker-border`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'borderColor', value })}
                value={style?.borderColor}
            />
            <span className="border-l-1 border-gray-smoke" />
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools-color-picker-background`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'background', value })}
                value={style?.background}
            />
            <span className="border-l-1 border-gray-smoke" />
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools-size`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                placeholder="Tamaño"
                wrapperClassName="basic-editor__select--size"
                customList={SizeOptions}
                handleStyleChange={handleStyleChange}
                style={style}
            />
            <span className="border-l-1 border-gray-smoke" />
            <Opacity
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools-opacity`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'opacity', value })}
                value={style?.opacity}
            />
            <span className="border-l-1 border-gray-smoke" />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-button-tools`,
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
                    submodule: `editor-action-button-tools`,
                    action: ActionElementType.PUT_BACK,
                    elementType: ElementType.ICO,
                })}
                name="putBack"
                className="icon-size--common"
                onClick={(): void => handleStyleChange({ name: 'zIndex', value: 0 })}
            />
            <span className="border-l-1 border-gray-smoke" />
            <SelectLink handleStyleChange={handleStyleChange} style={style} />
        </div>
    );
};
