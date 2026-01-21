import React, { Fragment, useMemo } from 'react';
import { Input } from '../components';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption, StyleKey } from '@models/WebsiteNode';
import { IElementProps } from '@pages/website-editor/editor/components/drag-and-drop';
import { AppointmentForm, PARAGRAPH, Wrapper, Button } from '.';
import './Form.scss';

export const Form: React.FC<IElementProps> = ({ data, styleKey, isPreview }) => {
    const { option, style, setting } = data;
    const { One, Two, Four, Five, Three } = ElementOption;

    const isMobile = styleKey === StyleKey.MobileStyle;

    const getSettings = (): IGenericRecord => {
        return {
            buttonText: setting?.buttonText,
            textKey: option === One || option === Four ? 'labelText' : 'placeholder',
            isThree: option === Three,
            showButton: setting?.addDisplay,
        };
    };

    const { buttonText, isThree, showButton, textKey } = useMemo(() => getSettings(), [setting, option]);

    return showButton ? (
        <div className="flex items-center justify-center w-full h-full" style={{ ...style }}>
            <Button className="form__button" style={style.button} type="button">
                {buttonText}
            </Button>
        </div>
    ) : (
        <Wrapper
            className={`form form--${option} form--${option}-${isMobile ? 'mobile' : 'desktop'}`}
            style={{ ...style, placeholder: option === Two || option === Three }}
        >
            {option === Five ? (
                <AppointmentForm buttonText={buttonText} isMobile={isMobile} />
            ) : (
                <>
                    <div
                        className={`${option === 'four' ? 'flex flex-col' : 'grid grid-cols-2'} gap-4.5 ${
                            option === 'three' ? 'flex ' : ''
                        }`}
                    >
                        {setting?.fields?.map(({ name, type, id }: IGenericRecord) => {
                            const textProp = { [textKey]: name };
                            const isParagraph = type === PARAGRAPH;
                            return (
                                <Fragment key={id}>
                                    {isThree ? (
                                        <div className={`flex ${isMobile ? 'flex-col w-max items-center gap-7' : ''}`}>
                                            <Input
                                                disabled={!isPreview}
                                                inputClassName={`${isMobile ? 'input__box-mobile' : ''} rounded-none`}
                                                wrapperClassName="form__input--three"
                                                {...textProp}
                                            />
                                            <button
                                                className="overflow-hidden rounded-none form__button whitespace-nowrap overflow-ellipsis"
                                                disabled
                                            >
                                                {buttonText}
                                            </button>
                                        </div>
                                    ) : (
                                        <Input
                                            {...textProp}
                                            required
                                            inputClassName={`${isMobile ? 'input__box-mobile' : ''}`}
                                            wrapperClassName={`justify-between overflow-hidden ${
                                                isParagraph ? 'col-span-2' : ''
                                            } ${isMobile ? 'col-span-2' : 'col-span-1'} ${
                                                isMobile && isParagraph ? `input--${option}-mobile` : ''
                                            }`}
                                            disabled={!isPreview}
                                        />
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                    {!isThree && (
                        <button className="form__button mt-7" disabled>
                            {buttonText}
                        </button>
                    )}
                </>
            )}
        </Wrapper>
    );
};
