import React, { useContext, useEffect, useMemo } from 'react';
import { v4 } from 'uuid';
import { Button, SimpleButton } from '@components/button';
import { ColorPicker } from '@components/color-picker';
import { TextArea } from '@components/input';
import { Color } from '@constants/Color';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption, ElementType } from '@models/WebsiteNode';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { lengthEqualToZero } from '@utils/Length';
import { ActionElementType, generateId, ElementType as ElementTypeId, ModuleApp } from '@utils/GenerateId';
import { Field, TextFields, IFormFieldsProps, modalButtons, FORM_FIELDS } from '.';
import './Styles.scss';

export const FormFields: React.FC<IFormFieldsProps> = ({
    withPlaceholder = false,
    wrapperClassName,
    title = '',
    itemName,
    showModal = (): void => {},
    isModal = false,
}) => {
    const { handleSettingChange, handleStyleChange, saveElement, selectedElement } = useContext(ElementsContext);

    const [{ Form, Header, Footer }, { One, Three, Five }] = [ElementType, ElementOption];
    const fields: IGenericRecord[] = selectedElement?.setting?.fields ?? [];
    const setting = selectedElement?.setting ?? {};
    const [option, type] = [selectedElement?.option ?? One, selectedElement?.type ?? Form];
    const textProperty = `Título ${withPlaceholder ? 'de los campos' : ''}`;
    const isForm = type === Form;

    useEffect(() => {
        if (lengthEqualToZero(fields)) {
            addField();
        }
    }, []);

    const addField = (): void => {
        if (selectedElement) {
            const newElement = {
                ...selectedElement,
                setting: { ...setting, fields: [...fields, { name: textProperty, type: '', id: v4() }] },
            };
            saveElement(newElement);
        }
    };

    const deleteField = (id: string): void => {
        if (selectedElement) {
            saveElement({ ...selectedElement, setting: { ...setting, fields: fields.filter(field => field.id !== id) } });
        }
    };

    const handleFieldChange = ({ value, name }: IGenericRecord, id: string): void => {
        if (selectedElement) {
            const newFields = fields.map(field => ({ ...field, ...(field.id === id && { [name]: value }) }));
            saveElement({ ...selectedElement, setting: { ...setting, fields: newFields } });
        }
    };

    const enableFieldsButton = useMemo(() => fields.length < FORM_FIELDS[option], [selectedElement?.option, fields]);

    const showButton =
        (isForm && option !== Five && option !== Three) || ((type === Footer || type === Header) && fields.length < 6);

    return (
        <div className={wrapperClassName}>
            {title && <h3 className="mb-4.5 composite-editor__title">{title}</h3>}
            <TextFields item={itemName || 'title'} labelText="Título de los campos" />
            <div className="flex flex-col gap-2 mt-2">
                {option !== Five &&
                    fields?.map((field, index) => (
                        <Field
                            key={field.id}
                            field={field}
                            deleteField={(): void => deleteField(field.id)}
                            enableDeletion={!!index}
                            handleFieldChange={(data: IGenericRecord): void => handleFieldChange(data, field.id)}
                        />
                    ))}
            </div>
            {showButton && (
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-header-footer-form-edit-other-field`,
                        action: ActionElementType.ADD,
                        elementType: ElementTypeId.BTN,
                    })}
                    className={`mt-1 composite-editor__link  ${isForm && enableFieldsButton ? '' : 'disabled-link'}`}
                    onClick={addField}
                    disabled={isForm ? !enableFieldsButton : false}
                >
                    + Agregar otro campo
                </SimpleButton>
            )}
            <h3 className="composite-editor__title mt-4.5 mb-2">Botón de acción</h3>
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-header-footer-form-edit-background-color`,
                    action: ActionElementType.INPUT,
                    elementType: ElementTypeId.TXT,
                })}
                labelText="Fondo botón"
                handleChange={(value): void => handleStyleChange({ item: 'button', name: 'background', value })}
                value={selectedElement?.style?.button?.background ?? Color.Primary}
            />
            <TextFields item="button" labelText="Texto botón:" wrapperClassName="mt-4.5" />
            <TextArea
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-header-footer-form-edit-value-btn`,
                    action: ActionElementType.INPUT,
                    elementType: ElementTypeId.TXT,
                })}
                classesWrapper="text-area mt-2"
                value={selectedElement?.setting?.buttonText}
                onChange={({ target: { value } }): void => handleSettingChange({ name: 'buttonText', value })}
                placeholder="..."
                rows={3}
                maxLength={17}
            />
            {isModal && (
                <div className="flex justify-end mt-4.5 gap-x-5">
                    {modalButtons.map((button, index) => (
                        <Button id={`buttonAction${index}`} text={button} key={button} onClick={!index ? showModal : showModal} />
                    ))}
                </div>
            )}
        </div>
    );
};
