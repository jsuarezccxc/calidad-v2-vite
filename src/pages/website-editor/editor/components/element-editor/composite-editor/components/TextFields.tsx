import React, { useContext } from 'react';
import { ColorPicker } from '@components/color-picker';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { Select } from '../../select';
import { OPTIONS } from '../..';
import { ITextFieldsProps } from '.';

export const TextFields: React.FC<ITextFieldsProps> = ({ item, labelText, wrapperClassName }) => {
    const { handleStyleChange, selectedElement } = useContext(ElementsContext);
    const { styleKey } = useContext(ScreensContext);

    const style = selectedElement?.[styleKey]?.[item];

    return (
        <div className={wrapperClassName}>
            {labelText && <h4 className="mb-1 composite-editor__caption">{labelText}</h4>}
            <div className="flex gap-2">
                <Select
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-font-family`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    selectClassName="select--font-family"
                    placeholder="Tipografia"
                    handleChange={(value): void => handleStyleChange({ item, name: 'fontFamily', value })}
                    options={OPTIONS.FONT_FAMILY}
                    value={style?.fontFamily}
                />
                <Select
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-font-weight`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    selectClassName="select--font-weight"
                    placeholder="Bold"
                    handleChange={(value): void => {
                        handleStyleChange({ item, name: 'fontWeight', value });
                    }}
                    options={OPTIONS.FONT_WEIGHT}
                    value={style?.fontWeight}
                />
            </div>
            <div className="flex gap-2 mt-2">
                <Select
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-font-size`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    selectClassName="select--font-size"
                    placeholder="Size"
                    handleChange={(value): void => handleStyleChange({ item, name: 'fontSize', value })}
                    options={OPTIONS.FONT_SIZE_TEXT_FIELDS}
                    value={style?.fontSize}
                />
                <span className="border-l-1 border-gray-smoke" />
                <ColorPicker
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-font-color`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    handleChange={(value): void => handleStyleChange({ item, name: 'color', value })}
                    value={style?.color}
                />
            </div>
        </div>
    );
};
