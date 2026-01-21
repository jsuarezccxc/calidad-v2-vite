import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal } from '@components/modal';
import { Button } from '@components/button';
import { Slider } from '@mui/material';
import { dataURLtoFile } from '@utils/Input';
import { generateId, ModuleApp, ActionElementType, ElementType } from '@utils/GenerateId';
import { ICropperProps, DEFAULT_SIZE_CONTAINER, AWS } from '.';
import './Cropper.scss';

export const Cropper: React.FC<ICropperProps> = ({
    url = '',
    openModal = false,
    handleModal = (): void => {},
    getImageCropped,
    name = '',
    cropWidth = 274,
    cropHeight = 310,
    borderRadius,
}) => {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const cropperRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLImageElement | null>(null);
    const prevMousePosition = useRef<{ x: number; y: number } | null>(null);
    const [zoomValue, setZoomValue] = useState<number>(50);
    const [cropperPosition, setCropperPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDraggingCropper, setIsDraggingCropper] = useState<boolean>(false);
    const [croppedImage, setCroppedImage] = useState<string>('');
    const imageScale = 1 + (zoomValue - 50) / 100;

    useEffect(() => {
        const containerWidth = containerRef?.current?.clientWidth ?? DEFAULT_SIZE_CONTAINER.WIDTH;
        const containerHeight = containerRef?.current?.clientHeight ?? DEFAULT_SIZE_CONTAINER.HEIGHT;

        const initialX = (containerWidth - cropWidth) / 2;
        const initialY = (containerHeight - cropHeight) / 2;
        setCropperPosition({ x: initialX, y: initialY });
    }, [url, containerRef, croppedImage]);

    const handleCalculateClipPath = useCallback((): string => {
        const containerWidth = containerRef?.current?.clientWidth ?? DEFAULT_SIZE_CONTAINER.WIDTH;
        const containerHeight = containerRef?.current?.clientHeight ?? DEFAULT_SIZE_CONTAINER.HEIGHT;
        const cropperWidth = cropWidth;
        const cropperHeight = cropHeight;
        const cropperX = cropperPosition.x;
        const cropperY = cropperPosition.y;

        return `polygon(
            0% 0%,
            0% 100%,
            ${(cropperX / containerWidth) * 100}% 100%,
            ${(cropperX / containerWidth) * 100}% ${(cropperY / containerHeight) * 100}%,
            ${((cropperX + cropperWidth) / containerWidth) * 100}% ${(cropperY / containerHeight) * 100}%,
            ${((cropperX + cropperWidth) / containerWidth) * 100}% ${((cropperY + cropperHeight) / containerHeight) * 100}%,
            ${(cropperX / containerWidth) * 100}% ${((cropperY + cropperHeight) / containerHeight) * 100}%,
            ${(cropperX / containerWidth) * 100}% 100%,
            100% 100%,
            100% 0%
        )`;
    }, [containerRef, cropWidth, cropHeight, cropperPosition.x, cropperPosition.y]);

    const labelText = (value: number): string => {
        const thumb = document.querySelector('.MuiSlider-thumb');
        if (thumb) {
            thumb.setAttribute('aria-label', `${value} %`);
        }
        return '';
    };

    const handleChangeZoom = (value: number): void => {
        setZoomValue(value);
    };

    const handleMouseDownCropper = (e: React.MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        setIsDraggingCropper(true);
        prevMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMoveCropper = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!isDraggingCropper) return;
        const { clientX, clientY } = e;

        if (prevMousePosition.current !== null) {
            const dx = clientX - prevMousePosition.current.x;
            const dy = clientY - prevMousePosition.current.y;

            const newCropperX = cropperPosition.x + dx;
            const newCropperY = cropperPosition.y + dy;

            const containerWidth = containerRef.current?.clientWidth ?? 0;
            const containerHeight = containerRef.current?.clientHeight ?? 0;
            const cropperWidth = cropperRef.current?.clientWidth ?? 0;
            const cropperHeight = cropperRef.current?.clientHeight ?? 0;

            const maxX = containerWidth - cropperWidth;
            const maxY = containerHeight - cropperHeight;

            const boundedX = Math.max(0, Math.min(maxX, newCropperX));
            const boundedY = Math.max(0, Math.min(maxY, newCropperY));

            setCropperPosition({ x: boundedX, y: boundedY });
            prevMousePosition.current = { x: clientX, y: clientY };
        }
    };

    const handleMouseUpCropper = (): void => {
        setIsDraggingCropper(false);
        prevMousePosition.current = null;
    };

    const handleSaveClick = (): void => {
        if (!cropperRef.current || !imageRef.current) return;

        const cropperRect = cropperRef.current.getBoundingClientRect();
        const imageRect = imageRef.current.getBoundingClientRect();

        const imageScaleX = imageRef.current.naturalWidth / imageRect.width;
        const imageScaleY = imageRef.current.naturalHeight / imageRect.height;

        const x = (cropperRect.left - imageRect.left) * imageScaleX;
        const y = (cropperRect.top - imageRect.top) * imageScaleY;
        const width = cropperRect.width * imageScaleX;
        const height = cropperRect.height * imageScaleY;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = width;
        canvas.height = height;

        const rand = `?${Math.random()}`;
        const currentUrl = url || croppedImage;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = currentUrl.includes(AWS) ? `${currentUrl}${rand}` : currentUrl;

        img.onload = (): void => {
            ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
            try {
                const croppedImageUrl = canvas.toDataURL('image/png');
                if (croppedImageUrl) {
                    const file = dataURLtoFile(croppedImageUrl, `Copia-${name}`);
                    if (file) {
                        getImageCropped(file);
                    }
                    setCroppedImage(croppedImageUrl);
                    return handleModal();
                }
            } catch (err) {
                console.error('Error to crop image:', err);
            }
        };
    };

    const clipPath = handleCalculateClipPath();

    return (
        <Modal
            id={generateId({
                module: ModuleApp.MODALS,
                submodule: 'cropper-editor-image',
                action: ActionElementType.ACTION,
                elementType: ElementType.MDL,
            })}
            handleClose={handleModal}
            open={openModal}
        >
            <div className="cropper">
                <div className="cropper__header">
                    <h3 className="title">Editor de imagen</h3>
                </div>
                <div className="cropper--description">Seleccione en la imagen el área que desea visualizar</div>
                <div className="cropper__body">
                    <div className="image__container">
                        <div
                            className="image-workspace"
                            ref={containerRef}
                            onMouseMove={handleMouseMoveCropper}
                            onMouseUp={handleMouseUpCropper}
                        >
                            <div
                                className="crop-area-mask"
                                style={{
                                    clipPath: clipPath,
                                }}
                            />
                            <img
                                ref={imageRef}
                                src={url || croppedImage}
                                style={{
                                    transform: `scale(${imageScale})`,
                                }}
                                alt="crop"
                            />
                            <div
                                ref={cropperRef}
                                id="crop-box"
                                className="cropper--area"
                                style={{
                                    width: `${cropWidth}px`,
                                    height: `${cropHeight}px`,
                                    top: `${cropperPosition.y}px`,
                                    left: `${cropperPosition.x}px`,
                                    ...(borderRadius && { borderRadius }),
                                }}
                                onMouseDown={handleMouseDownCropper}
                            >
                                {[...Array(3)].map((_, rowIndex) => (
                                    <React.Fragment key={Symbol(rowIndex).toString()}>
                                        {[...Array(3)].map((_, colIndex) => (
                                            <div
                                                key={Symbol(colIndex).toString()}
                                                style={{
                                                    position: 'absolute',
                                                    top: `${(100 / 3) * rowIndex}%`,
                                                    left: `${(100 / 3) * colIndex}%`,
                                                    width: `${100 / 3}%`,
                                                    height: `${100 / 3}%`,
                                                    borderRight: rowIndex < 3 ? '0.0625rem solid #fff' : 'none',
                                                    borderBottom: colIndex < 3 ? '0.0625rem solid #fff' : 'none',
                                                }}
                                            />
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="zoom__container">
                        <label htmlFor="zoom" className="title">
                            Zoom
                        </label>
                        <div className="slider--container">
                            <Slider
                                id="zoom"
                                aria-label={`${zoomValue}%`}
                                size="medium"
                                value={zoomValue}
                                min={0}
                                max={100}
                                onChange={(e_, value): void => handleChangeZoom(value as number)}
                                className="zoom--slider"
                                getAriaValueText={labelText}
                            />
                        </div>
                    </div>
                    <div className="button__container">
                        <Button
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: 'cropper-editor-image-omit',
                                action: ActionElementType.ACTION,
                                elementType: ElementType.BTN,
                            })}
                            text="Omitir edición"
                            onClick={handleModal}
                            classes="mr-2.5"
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.MODALS,
                                submodule: 'cropper-editor-image',
                                action: ActionElementType.SAVE,
                                elementType: ElementType.BTN,
                            })}
                            background="white"
                            text="Guardar"
                            onClick={handleSaveClick}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};
