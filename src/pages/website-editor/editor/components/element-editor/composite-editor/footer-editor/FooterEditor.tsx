import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { uploadImage } from '@redux/website-node/actions';
import { ColorPicker } from '@components/color-picker';
import { ChangeEvent, ImageInput, TextArea } from '@components/input';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { Switch } from '@components/switch';
import { ElementOption } from '@models/WebsiteNode';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { Color } from '@constants/Color';
import { IMAGE_WEIGHT_ERROR, MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { EditInput, ModalForm, AddSocialNetwork, TextFields } from '../components';
import { LOGO } from '../..';
import './FooterEditor.scss';

export const FooterEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { selectedElement, handleStyleChange, handleSettingChange } = useContext(ElementsContext);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isSizeExceeded, setIsSizeExceeded] = useState<boolean>(false);

    const optionsWithImage = [ElementOption.One, ElementOption.Four, ElementOption.Five, ElementOption.Six];

    const handleChange = (e: ChangeEvent, name: string): void => {
        handleSettingChange({ name, value: e.target.value });
    };

    const toggleModal = (): void => {
        setOpenModal(!openModal);
    };

    const handleImageChange = async ({ target }: ChangeEvent): Promise<void> => {
        if (target.files) {
            if (target.files[0].size > MAXIMUM_IMAGE_SIZE) {
                setIsSizeExceeded(true);
                return;
            }
            const src = String(await dispatch(uploadImage(target.files[0])));
            if (src) {
                handleSettingChange({ name: LOGO, value: src });
                setIsSizeExceeded(false);
            }
        }
    };

    const deleteImage = (): void => {
        handleSettingChange({ name: LOGO, value: '' });
    };

    const handleChangeSwitch = (): void => {
        handleSettingChange({ name: 'includeContactButton', value: !selectedElement?.setting?.includeContactButton });
    };

    return (
        <div className="footer-editor">
            {optionsWithImage.some(element => selectedElement?.option === element) && (
                <>
                    <p className="text-tiny text-blue font-allerbold pl-1.5">Logo de la empresa:</p>
                    <ImageInput
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-composite-element-footer-image-logo`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.UPL,
                        })}
                        classesWrapper="footer-editor__image"
                        placeholder="Subir archivo jpg, jpeg, png"
                        customHandleChangeImage={handleImageChange}
                        image={{ src: selectedElement?.setting?.logo }}
                        name="src"
                        sizeImage={MAXIMUM_IMAGE_SIZE}
                        cleanImage={deleteImage}
                    />
                    {isSizeExceeded && <p className="text-purple text-tiny w-41">{IMAGE_WEIGHT_ERROR}</p>}
                </>
            )}
            <TextFields
                item="description"
                labelText="Descripción (Se aconseja escribir información general de la empresa):"
                wrapperClassName="mt-4.5"
            />
            <TextArea
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-footer-description`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                classesWrapper="text-area mt-2 mb-5"
                value={selectedElement?.setting?.description}
                onChange={({ target: { value } }): void => handleSettingChange({ name: 'description', value })}
                placeholder="..."
                rows={3}
            />
            {(selectedElement?.option === ElementOption.One || selectedElement?.option === ElementOption.Five) && (
                <TextFields item="title" labelText="Título de las páginas" wrapperClassName="mb-2 mt-3" />
            )}

            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-footer-background`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                labelText="Color fondo"
                handleChange={(value): void => handleStyleChange({ item: 'bgColor', name: 'background', value })}
                value={selectedElement?.style?.bgColor?.background}
            />
            <AddSocialNetwork />
            {selectedElement?.option === ElementOption.Five ? (
                <>
                    <input
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-composite-element-footer-btn-text`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        value={selectedElement?.setting?.buttonPlaceholderText}
                        onChange={(e): void => handleChange(e, 'buttonPlaceholderText')}
                        placeholder="Titulo placeholder:"
                        className="footer-editor__email"
                    />
                    <p className="cursor-pointer w-45 h-8 mt-0.5 p-1.5 justify-between flex text-gray-dark bg-gray-light rounded-md text-sm">
                        Correo electrónico <Icon name="arrowDownGray" />
                    </p>
                    <h3 className="composite-editor__title mt-4.5 mb-2">Botón de acción</h3>
                    <ColorPicker
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-composite-element-footer-btn-background-color`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        labelText="Fondo botón"
                        handleChange={(value): void => handleStyleChange({ item: 'buttonAction', name: 'background', value })}
                        value={selectedElement?.style?.buttonAction?.background ?? Color.Primary}
                    />
                    <TextFields item="buttonAction" labelText="Texto botón:" wrapperClassName="mt-4.5" />
                    <TextArea
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-composite-element-footer-btn-action`,
                            action: ActionElementType.INPUT,
                            elementType: ElementType.TXT,
                        })}
                        classesWrapper="text-area mt-2"
                        value={selectedElement?.setting?.buttonActionText}
                        onChange={({ target: { value } }): void => handleSettingChange({ name: 'buttonActionText', value })}
                        placeholder="..."
                        rows={3}
                    />
                </>
            ) : (
                <>
                    <p className="text-blue font-allerbold mt-4.5 mb-2">Formulario</p>
                    <Switch
                        checked={selectedElement?.setting?.includeContactButton}
                        handleChange={handleChangeSwitch}
                        labelText="¿Agregar formulario en botón?"
                    />
                </>
            )}
            {selectedElement?.setting?.includeContactButton && (
                <>
                    <Form>
                        <EditInput
                            value={selectedElement?.setting?.formButtonText}
                            handleChange={(e): void => handleChange(e, 'formButtonText')}
                            placeholder="Contáctenos"
                            wrapperClassName="mt-2"
                            iconName="editBlue"
                            handleClickIcon={toggleModal}
                        />
                    </Form>
                    <ModalForm handleClose={toggleModal} open={openModal} />
                </>
            )}
        </div>
    );
};
