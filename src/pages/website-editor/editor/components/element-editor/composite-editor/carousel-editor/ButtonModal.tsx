import React, { FormEvent, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import trashIcon from '@assets/images/trash-blue.svg';
import { Button, ButtonType, SimpleButton } from '@components/button';
import { Modal } from '@components/modal';
import { Form } from '@components/form';
import { INFORMATION } from '@information-texts/WebsiteEditor';
import { IGenericRecord } from '@models/GenericRecord';
import { TextInput } from '@components/input';
import { RootState } from '@redux/rootReducer';
import { createProductOptions } from '@utils/WebsiteNode';
import { generateId, ModuleApp, ActionElementType, ElementType as ElementTypeId } from '@utils/GenerateId';
import { ContentItem, IButtonModalProps, DEFAULT_CONTENT } from '.';

export const ButtonModal: React.FC<IButtonModalProps> = ({ button, saveButton, toggleModal, updateButton }) => {
    const {
        catalogWebsite: { data: catalogWebsite },
    } = useSelector((state: RootState) => state.productCatalog);
    const [validate, setValidate] = useState<boolean>(false);

    const productOptions = useMemo(() => createProductOptions(catalogWebsite), [catalogWebsite]);

    const { contents, name, number } = button;
    const hasCheckedContents = contents.some(content => content.checked);

    const addContent = (): void => {
        updateButton({ ...button, contents: [...contents, { ...DEFAULT_CONTENT, id: v4(), number: contents.length + 1 }] });
    };

    const deleteContents = (): void => {
        const uncheckedContents = contents.filter(content => !content.checked);
        updateButton({
            ...button,
            contents: uncheckedContents.length ? uncheckedContents : [{ ...DEFAULT_CONTENT, id: v4(), number: 1 }],
        });
    };

    const sendForm = (e: FormEvent): void => {
        e.preventDefault();
        if (!button.name || contents.some(({ src, productName }) => !src && !productName)) return setValidate(true);
        saveButton();
        setValidate(false);
    };

    const updateContent = (content: IGenericRecord): void => {
        const newContents = contents.map(item => (item.id === content.id ? content : item));
        updateButton({ ...button, contents: newContents }, content);
    };

    return (
        <Modal
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal`,
                action: ActionElementType.INFO,
                elementType: ElementTypeId.MDL,
            })}
            modalClassName="button-modal"
            open
            handleClose={toggleModal}
        >
            <div className="button-modal__content">
                <Form className="button-modal__fields bg-green-scrollbar" sendWithEnter>
                    <h2 className="mb-2 text-lg font-allerbold text-gray-dark">Agregar botón</h2>
                    <p className="mb-4.5 text-gray-dark">{INFORMATION.BUTTON_MODAL}</p>
                    <h2 className="mb-2 text-blue font-allerbold">Botón {number}</h2>
                    <TextInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal-name`,
                            action: ActionElementType.INPUT,
                            elementType: ElementTypeId.TXT,
                        })}
                        labelText="*Nombre del botón:"
                        onChange={({ target }): void => updateButton({ ...button, name: target.value })}
                        placeholder="Agregar nombre a botón"
                        value={name}
                        required={validate && !name}
                    />
                    <img
                        alt="trash icon"
                        onClick={deleteContents}
                        className={`block my-2 ml-auto cursor-${hasCheckedContents ? 'pointer' : ''}`}
                        src={trashIcon}
                    />
                    {contents.map((content, index) => (
                        <ContentItem
                            key={content.id}
                            content={content}
                            productOptions={productOptions}
                            updateContent={updateContent}
                            validate={validate}
                            index={index}
                        />
                    ))}
                    <SimpleButton
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal-other-content`,
                            action: ActionElementType.ADD,
                            elementType: ElementTypeId.BTN,
                        })}
                        className="button-modal__link"
                        onClick={addContent}
                    >
                        + Agregar otro contenido
                    </SimpleButton>
                </Form>
                <div className="flex justify-end mt-4.5 gap-5.5">
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal`,
                            action: ActionElementType.BACK,
                            elementType: ElementTypeId.BTN,
                        })}
                        onClick={toggleModal}
                        text="Atrás"
                    />
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `${ModuleApp.MODALS}-editor-composite-element-carousel-button-modal`,
                            action: ActionElementType.SAVE,
                            elementType: ElementTypeId.BTN,
                        })}
                        onClick={sendForm}
                        text="Guardar"
                        type={ButtonType.Submit}
                    />
                </div>
            </div>
        </Modal>
    );
};
