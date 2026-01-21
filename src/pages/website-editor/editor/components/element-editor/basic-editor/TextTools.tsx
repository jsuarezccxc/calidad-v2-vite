import React, { useEffect } from 'react';
import { ColorPicker } from '@components/color-picker';
import { FontVariant } from '@constants/WebsiteNode';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { Select } from '../select';
import { INCOMPLETE_FONTS, OPTIONS } from '..';
import { Icon, IToolsProps, Opacity } from '.';

export const TextTools: React.FC<IToolsProps> = ({ handleStyleChange, style }) => {
    const fontFamily = style?.fontFamily;

    useEffect(() => {
        handleStyleChange({ name: 'fontVariant', value: FontVariant.Regular });
    }, [fontFamily]);

    const incompleteFontVariants = INCOMPLETE_FONTS[fontFamily] ?? [];

    const availableFontVariants = OPTIONS.FONT_WEIGHT.filter(fontVariant => !incompleteFontVariants.includes(fontVariant));

    return (
        <div className="flex flex-1 gap-2">
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-font-family`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                options={OPTIONS.FONT_FAMILY}
                placeholder="Nombre tipografía"
                handleChange={(value: string): void => handleStyleChange({ name: 'fontFamily', value })}
                value={fontFamily}
                wrapperClassName="basic-editor__select--font-family"
            />
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-font-weight`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                placeholder="Bold"
                options={availableFontVariants}
                handleChange={(value: string): void => handleStyleChange({ name: 'fontWeight', value })}
                value={style?.fontWeight}
                wrapperClassName="basic-editor__select--font-weight"
            />
            <Select
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-font-size`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                placeholder="14"
                options={OPTIONS.FONT_SIZE_TEXT_TOOLS}
                handleChange={(value: string): void => handleStyleChange({ name: 'fontSize', value })}
                value={style?.fontSize}
                wrapperClassName="basic-editor__select--font-size"
            />
            <span className="border-l-1 border-gray-smoke" />
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-font-color`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'color', value })}
                value={style?.color}
            />
            <span className="border-l-1 border-gray-smoke" />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-capital`,
                    action: ActionElementType.CHANGE,
                    elementType: ElementType.ICO,
                })}
                name="size"
                className="icon-size"
                onClick={(): void => handleStyleChange({ name: 'capitalLetter', value: !style?.capitalLetter })}
            />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-text-align`,
                    action: ActionElementType.CHANGE,
                    elementType: ElementType.ICO,
                })}
                name="align"
                className="w-4.5 h-4.5"
                onClick={(): void => handleStyleChange({ name: 'textAlign', value: !style?.textAlign })}
            />
            <span className="border-l-1 border-gray-smoke" />
            <Opacity
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools-opacity`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ name: 'opacity', value })}
                value={style?.opacity}
            />
            <Icon
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-text-tools`,
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
                    submodule: `editor-action-text-tools`,
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
