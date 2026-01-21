import React, { useMemo } from 'react';
import { v4 } from 'uuid';
import { ColorPicker as ColorPalette, useColor } from 'react-color-palette';
import { ENTER } from '@components/form';
import bottomArrow from '@assets/images/arrow-down-blue.svg';
import useToggleRendering from '@hooks/useToggleRendering';
import { remToPx } from '@utils/Size';
import { IColorPickerProps, INITIAL_COLOR } from '.';
import './ColorPicker.scss';

export const ColorPicker: React.FC<IColorPickerProps> = ({
    id,
    labelText,
    handleChange = (): void => {},
    value = INITIAL_COLOR,
    wrapperClassName = '',
}) => {
    const arrowId = v4();
    const [color, setColor] = useColor('hex', INITIAL_COLOR);
    const { parentRef, renderElement } = useToggleRendering(arrowId);

    const handleChangeColor = (): void => {
        if (color.hex !== INITIAL_COLOR) handleChange(color.hex);
    };

    const handleChangeEnter = (event: React.KeyboardEvent<HTMLFormElement>): void => {
        if (event.key === ENTER) {
            event.preventDefault();
            handleChangeColor();
        }
    };

    const [desktopView, height] = useMemo(() => {
        return [remToPx(17.813), remToPx(17.938)];
    }, []);

    return (
        <div id={id} className={`color-picker ${wrapperClassName}`}>
            {labelText && <label className="color-picker__label">{labelText}</label>}
            <div className="color-picker__box" ref={parentRef}>
                <span
                    className={`color-picker__selected-color ${value === '#FFFFFF' ? 'border' : ''}`}
                    style={{ background: value || color.hex }}
                />
                <span className="color-picker__value">{value || color.hex}</span>
                <img
                    src={bottomArrow}
                    alt="Select color"
                    className={`w-5.5 h-5.5 cursor-pointer transform transition-all rotate-${renderElement ? '180' : '0'}`}
                    id={arrowId}
                />
                {renderElement && (
                    <form
                        onMouseUp={handleChangeColor}
                        onKeyDown={handleChangeEnter}
                        autoComplete="off"
                        className="color-picker__palette-container"
                    >
                        <ColorPalette
                            width={screen.width > 767 ? desktopView : screen.width - 44}
                            height={height}
                            color={color}
                            onChange={setColor}
                            hideHSV
                        />
                    </form>
                )}
            </div>
        </div>
    );
};
