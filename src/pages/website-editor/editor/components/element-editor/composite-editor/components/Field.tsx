import React from 'react';
import { Icon } from '@components/icon';
import { ChangeEvent } from '@components/input';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { Select } from '../../select';
import { OPTIONS } from '../..';
import { IFieldProps } from '.';

export const Field: React.FC<IFieldProps> = ({ deleteField, enableDeletion, handleFieldChange, field }) => {
    return (
        <div className="field">
            <input
                className="field__input"
                onChange={({ target: { name, value } }: ChangeEvent): void => handleFieldChange({ name, value })}
                value={field.name}
                name="name"
                maxLength={35}
            />
            <div className="flex items-center gap-2">
                <Select
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-header-form-field`,
                        action: ActionElementType.INPUT,
                        elementType: ElementType.DRP,
                    })}
                    isStyle={false}
                    handleChange={(value: string): void => handleFieldChange({ name: 'type', value })}
                    options={OPTIONS.FORM_FIELDS}
                    placeholder="Seleccionar"
                    value={field.type}
                />
                {enableDeletion && <Icon className="cursor-pointer" name="trashBlue" onClick={deleteField} />}
            </div>
        </div>
    );
};
