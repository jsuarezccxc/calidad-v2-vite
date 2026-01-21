import React from 'react';
import { Icon } from '@components/icon';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { IEditInputProps } from '.';
import './Styles.scss';

export const EditInput: React.FC<IEditInputProps> = ({
    placeholder = '',
    value,
    handleChange,
    wrapperClassName = '',
    handleClickIcon,
    iconName,
    handleClickIconTrash,
    name = '',
    iconTrash,
    handleBlurChange,
}) => {
    return (
        <div className={`edit-input ${wrapperClassName}`}>
            <input
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-header-footer-blog-edit-${name}`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                onBlur={handleBlurChange}
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className="input__contact-edit"
            />
            {iconName && <Icon name={iconName} classIcon="cursor-pointer" onClick={handleClickIcon} />}
            {iconTrash && <Icon name="trashBlue" classIcon="cursor-pointer ml-1" onClick={handleClickIconTrash} />}
        </div>
    );
};
