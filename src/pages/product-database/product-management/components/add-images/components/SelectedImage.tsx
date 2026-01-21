import React from 'react';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import { Tooltip } from '@components/tooltip';
import usePopper from '@hooks/usePopper';

export const SelectedImage: React.FC<IGenericRecord> = React.memo(
    ({
        productImage: { name, url },
        deleteImage = (): void => {},
        editImage = (): void => {},
        previewImage = (): void => {},
    }) => {
        const { anchorEl: anchorElInformation, mouseProps } = usePopper();
        return (
            <div className="flex items-center">
                <div>
                    <div>
                        <span {...mouseProps}>
                            <p className="text-center truncate text-gray-dark text-tiny w-30">{name}</p>
                        </span>
                        <Tooltip
                            anchorEl={anchorElInformation}
                            description={name}
                            placement="bottom-start"
                            wrapperClassName="rounded"
                        />
                    </div>
                    <div
                        className="relative items-center inline-block w-10 h-10 gap-1 product-management__render-image"
                        style={{ backgroundImage: `url(${url})` }}
                    >
                        {/* <input type="file" className="hidden input--file__input" id={name} name={name} onChange={onChange} /> */}
                        <div className="product-management__hover-image" onClick={previewImage}>
                            <Icon name="searchWhite" classIcon="cursor-pointer" className="w-7 h-7" />
                            <label className="text-sm font-normal text-white underline cursor-pointer font-aller">
                                previsualizar
                            </label>
                        </div>
                    </div>
                    <div className="flex justify-center gap-2">
                        <label htmlFor={name}>
                            <Icon
                                name="editBlue"
                                className="w-5.5 h-5.5 cursor-pointer"
                                hoverIcon="editGreen"
                                onClick={editImage}
                            />
                        </label>
                        <Icon
                            name="trashBlue"
                            className="w-5.5 h-5.5 cursor-pointer"
                            onClick={deleteImage}
                            hoverIcon="trashGreen"
                        />
                    </div>
                </div>
                <div />
            </div>
        );
    },
);

SelectedImage.displayName = 'SelectedImage';
