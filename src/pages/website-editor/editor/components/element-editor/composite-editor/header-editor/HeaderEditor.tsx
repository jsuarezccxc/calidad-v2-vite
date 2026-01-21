import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IMAGE_WEIGHT_ERROR, MAXIMUM_IMAGE_SIZE } from '@constants/WebsiteNode';
import { ColorPicker } from '@components/color-picker';
import { ChangeEvent, ImageInput } from '@components/input';
import { Switch } from '@components/switch';
import { Form } from '@components/form';
import { ElementOption } from '@models/WebsiteNode';
import { ElementsContext, ScreensContext } from '@pages/website-editor/editor/context';
import { uploadImage } from '@redux/website-node/actions';
import { debounce } from '@utils/Debounce';
import { onlyNumbersPreventDeadKeys } from '@utils/Validation';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { DefaultSizeLogo } from '../../../composite-elements/header';
import { EditInput, ModalForm, AddSocialNetwork, TextFields } from '../components';
import { LOGO } from '../..';
import {
    DEBOUNCE_DELAY,
    DimensionInput,
    ICalculateDimentionsProps,
    INewDimensions,
    INITIAL_DIMENSIONS,
    INITIAL_MAX_DIMENSIONS,
    LOGO_SIZES,
} from '.';
import './HeaderEditor.scss';

export const HeaderEditor: React.FC = () => {
    const dispatch = useDispatch();
    const { styleKey } = useContext(ScreensContext);
    const { selectedElement, handleSettingChange, handleStyleChange, handleHeaderStyle, logoSize, setLogoSize } = useContext(
        ElementsContext
    );
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [isSizeExceeded, setIsSizeExceeded] = useState<boolean>(false);
    const [validateSizeLogo, setValidateSizeLogo] = useState(false);

    const style = selectedElement?.[styleKey];

    const [originalLogoSize, setOriginalLogoSize] = useState(INITIAL_DIMENSIONS);
    const [inputWidth, setInputWidth] = useState(logoSize?.width?.toString() ?? '');
    const [inputHeight, setInputHeight] = useState(logoSize?.height?.toString() ?? '');
    const [calculatedMaxDimensions, setCalculatedMaxDimensions] = useState(INITIAL_MAX_DIMENSIONS);

    useEffect(() => {
        setInputWidth(logoSize?.width?.toString() ?? '');
        setInputHeight(logoSize?.height?.toString() ?? '');
    }, [logoSize]);

    const changeButtonValue = (e: ChangeEvent): void => {
        handleSettingChange({ name: 'formButtonText', value: e.target.value });
    };

    const toggleModal = (): void => {
        setOpenModal(!openModal);
    };

    const getOrientation = (width: number, height: number): ICalculateDimentionsProps => {
        const isVertical = height > width;
        const orientation = isVertical ? DimensionInput.HEIGHT : DimensionInput.WIDTH;
        const numericValue = isVertical ? height : width;
        const aspectRatio = width / height;
        return { name: orientation, numericValue, aspectRatio };
    };

    const handleImageChange = async ({ target }: ChangeEvent): Promise<void> => {
        if (target.files) {
            const file = target.files[0];
            if (file.size > MAXIMUM_IMAGE_SIZE) {
                setIsSizeExceeded(true);
                return;
            }

            const img = new Image();
            const objectURL = URL.createObjectURL(file);

            img.onload = async (): Promise<void> => {
                const originalWidth = img.naturalWidth;
                const originalHeight = img.naturalHeight;
                setOriginalLogoSize({ width: originalWidth, height: originalHeight });
                calculateMaxDimensions(originalWidth, originalHeight);
                const { newWidth, newHeight } = calculateNewDimensions(getOrientation(originalWidth, originalHeight));

                const src = String(await dispatch(uploadImage(file)));
                if (src) {
                    handleSettingChange({ name: LOGO, value: src });
                    setIsSizeExceeded(false);
                }

                setLogoSize({ width: newWidth.toString(), height: newHeight.toString() });

                URL.revokeObjectURL(objectURL);
            };

            img.src = objectURL;
        }
    };

    const deleteImage = (): void => {
        handleSettingChange({ name: LOGO, value: '' });
        setLogoSize({ height: DefaultSizeLogo.Height, width: DefaultSizeLogo.Width });
    };

    const handleChangeSwitch = (): void => {
        handleSettingChange({ name: 'includeContactButton', value: !selectedElement?.setting?.includeContactButton });
    };

    const handleDimensionChange = (type: DimensionInput) => (e: ChangeEvent): void => {
        const { value } = e.target;

        type === DimensionInput.WIDTH ? setInputWidth(value) : setInputHeight(value);
        handleChangeSizeLogoDebounced(type, value);
    };

    const calculateNewDimensions = ({ name, numericValue, aspectRatio }: ICalculateDimentionsProps): INewDimensions => {
        let newWidth = 0;
        let newHeight = 0;

        const isWidth = name === DimensionInput.WIDTH;
        const maxSize = isWidth ? LOGO_SIZES.MAX_WIDTH : LOGO_SIZES.MAX_HEIGHT;

        if (isWidth) {
            newWidth = Math.min(numericValue, maxSize);
            newHeight = newWidth / aspectRatio;

            if (newHeight > LOGO_SIZES.MAX_HEIGHT) {
                newHeight = LOGO_SIZES.MAX_HEIGHT;
                newWidth = newHeight * aspectRatio;
            }
        } else {
            newHeight = Math.min(numericValue, maxSize);
            newWidth = newHeight * aspectRatio;

            if (newWidth > LOGO_SIZES.MAX_WIDTH) {
                newWidth = LOGO_SIZES.MAX_WIDTH;
                newHeight = newWidth / aspectRatio;
            }
        }

        return {
            newWidth: Math.round(Math.min(newWidth, LOGO_SIZES.MAX_WIDTH)),
            newHeight: Math.round(Math.min(newHeight, LOGO_SIZES.MAX_HEIGHT)),
        };
    };

    const calculateMaxDimensions = (originalWidth: number, originalHeight: number): void => {
        const aspectRatio = originalWidth / originalHeight;
        const maxAspectRatio = LOGO_SIZES.MAX_WIDTH / LOGO_SIZES.MAX_HEIGHT;

        let maxWidth = LOGO_SIZES.MAX_WIDTH;
        let maxHeight = LOGO_SIZES.MAX_HEIGHT;

        if (aspectRatio >= maxAspectRatio) {
            maxHeight = Math.round(LOGO_SIZES.MAX_WIDTH / aspectRatio);
        } else {
            maxWidth = Math.round(LOGO_SIZES.MAX_HEIGHT * aspectRatio);
        }

        setCalculatedMaxDimensions({ width: maxWidth, height: maxHeight });
    };

    const handleChangeSizeLogoDebounced = useCallback(
        debounce((name: string, value: string) => {
            const numericValue = Number(value);

            let aspectRatio: number | undefined;

            if (originalLogoSize.width && originalLogoSize.height) {
                aspectRatio = originalLogoSize.width / originalLogoSize.height;
            } else if (selectedElement?.setting?.width && selectedElement?.setting?.height) {
                aspectRatio = selectedElement.setting.width / selectedElement.setting.height;
            }

            if (!aspectRatio) return;

            const { newWidth, newHeight } = calculateNewDimensions({ name, numericValue, aspectRatio });

            const hasDefaultSize = !newWidth && !newHeight;
            const finalWidth = hasDefaultSize
                ? Math.min(Math.round(LOGO_SIZES.DEFAULT_HEIGHT * aspectRatio), LOGO_SIZES.MAX_WIDTH)
                : newWidth;

            const finalHeight = hasDefaultSize ? LOGO_SIZES.DEFAULT_HEIGHT : newHeight;

            setLogoSize({ width: finalWidth, height: finalHeight });
            setValidateSizeLogo(numericValue > (name === DimensionInput.WIDTH ? LOGO_SIZES.MAX_WIDTH : LOGO_SIZES.MAX_HEIGHT));
        }, DEBOUNCE_DELAY),
        [originalLogoSize]
    );

    useEffect(() => {
        if (selectedElement?.setting?.logo && logoSize.height && logoSize.width)
            handleHeaderStyle({ height: Number(logoSize.height), width: Number(logoSize.width) });
    }, [logoSize.height, logoSize.width]);

    useEffect(() => {
        if (
            selectedElement?.setting?.logo &&
            !selectedElement?.setting?.width &&
            !selectedElement?.setting?.height &&
            logoSize.width &&
            logoSize.height
        ) {
            handleHeaderStyle({ height: Number(logoSize.height), width: Number(logoSize.width) });
        }
    }, [selectedElement?.setting?.logo]);

    return (
        <div className="header-editor">
            <p className="text-tiny text-blue font-allerbold pl-1.5">Logo de la empresa:</p>
            <ImageInput
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-header-logo`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.UPL,
                })}
                placeholder="Subir archivo jpg, jpeg, png"
                customHandleChangeImage={handleImageChange}
                image={{ src: selectedElement?.setting?.logo }}
                name="src"
                cleanImage={deleteImage}
            />
            {selectedElement?.setting?.logo && (
                <>
                    <p className="mt-2 font-aller text-xtiny text-gray-dark">
                        *Ajuste las dimensiones de su logo. Recuerde que el ancho máximo es &nbsp;
                        <span className="font-allerbold">{calculatedMaxDimensions.width} px</span> y alto es &nbsp;
                        <span className="font-allerbold">{calculatedMaxDimensions.height} px</span>.
                    </p>
                    <form className="dimensions-input" autoComplete="off">
                        <div className="dimensions-input__group">
                            <label htmlFor="logo_width" className="dimensions-input__label">
                                Ancho:
                            </label>
                            <div className="dimensions-input__box">
                                <input
                                    maxLength={3}
                                    id="logo_width"
                                    name="width"
                                    value={inputWidth}
                                    onChange={handleDimensionChange(DimensionInput.WIDTH)}
                                    onInput={onlyNumbersPreventDeadKeys}
                                />
                                <span className="dimensions-input__size">px</span>
                            </div>
                        </div>
                        <div className="dimensions-input__group">
                            <label htmlFor="logo_height" className="dimensions-input__label">
                                Alto:
                            </label>
                            <div className="dimensions-input__box">
                                <input
                                    maxLength={3}
                                    id="logo_height"
                                    name="height"
                                    value={inputHeight}
                                    onChange={handleDimensionChange(DimensionInput.HEIGHT)}
                                    onInput={onlyNumbersPreventDeadKeys}
                                />
                                <span className="dimensions-input__size">px</span>
                            </div>
                        </div>
                    </form>
                    {validateSizeLogo && (
                        <span className="block pl-2 mt-2 text-tiny text-purple">*Ha superado la medidas permitidas del logo</span>
                    )}
                </>
            )}

            {isSizeExceeded && <p className="text-purple text-tiny w-41">{IMAGE_WEIGHT_ERROR}</p>}

            <TextFields item="title" labelText="Título de las páginas" wrapperClassName="mb-2 mt-3" />
            <p className="text-tiny text-blue font-allerbold">Color fondo</p>
            <ColorPicker
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-composite-element-header-background-color`,
                    action: ActionElementType.INPUT,
                    elementType: ElementType.TXT,
                })}
                handleChange={(value): void => handleStyleChange({ item: 'bgColor', name: 'background', value })}
                value={style?.bgColor?.background}
            />
            {(selectedElement?.option === ElementOption.Three || selectedElement?.option === ElementOption.Four) && (
                <AddSocialNetwork />
            )}
            {(selectedElement?.option === ElementOption.One || selectedElement?.option === ElementOption.Two) && (
                <>
                    <p className="text-blue font-allerbold mt-4.5 mb-2">Formulario</p>
                    <Switch
                        checked={selectedElement?.setting?.includeContactButton}
                        handleChange={handleChangeSwitch}
                        labelText="¿Agregar formulario en botón?"
                    />
                    {selectedElement?.setting?.includeContactButton && (
                        <>
                            <Form>
                                <EditInput
                                    value={selectedElement?.setting?.formButtonText}
                                    handleChange={changeButtonValue}
                                    placeholder="Contáctenos"
                                    wrapperClassName="mt-2"
                                    iconName="editBlue"
                                    handleClickIcon={toggleModal}
                                />
                            </Form>
                            <ModalForm handleClose={toggleModal} open={openModal} />
                        </>
                    )}
                </>
            )}
        </div>
    );
};
