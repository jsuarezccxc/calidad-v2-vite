import React, { useEffect, useRef, useState } from 'react';
import { CLICK } from '@constants/HtmlEvents';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { InvoiceCardAvailable } from '@components/electronic-documents/cards';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IInformationBulb, IInformationElectronicDocumentsProps, IInformationProps } from '.';
import './Information.scss';

export const Information: React.FC<IInformationProps> = ({
    id = generateId({
        module: ModuleApp.OTHERS,
        submodule: 'information',
        action: ActionElementType.INFO,
        elementType: ElementType.TXT,
    }),
    title,
    description,
    color = 'gray-dark',
    customText,
    isList = false,
    onClickIcon,
    hoverIcon = null,
    editIcon = false,
    separator = false,
    classNameIcon = '',
    classNameContainer = '',
    classNameSubContainer = '',
    classNameTitle = '',
    classNameSeparator = 'xs:hidden',
    classNameDescription = '',
}) => {
    return (
        <div id={id} className={`information ${classNameContainer}`}>
            <div className={`flex information__icon w-auto ${classNameSubContainer}`}>
                {(onClickIcon || hoverIcon) && (
                    <div {...hoverIcon?.mouseProps}>
                        <Icon
                            id={`${id}-info-icon`}
                            alt="Información"
                            name="infoGreen"
                            className={`w-5.5 h-5.5 mr-1 cursor-pointer ${classNameIcon}`}
                            hoverIcon="infoBlue"
                            onClick={onClickIcon ?? ((): void => {})}
                        />
                    </div>
                )}
                <h4 className={`text-${color} text-lg cursor-default ${classNameTitle}`}>{title}</h4>
                {editIcon && <Icon id={`${id}-edit-icon`} name="editBlue" className="ml-1" />}
                {separator && <div className={`flex-1 mt-3.5 ml-3 -mb-1 border-t border-gray ${classNameSeparator}`} />}
                {hoverIcon && (
                    <Tooltip
                        id={`${id}-info-tool`}
                        anchorEl={hoverIcon?.anchorElTitle ?? null}
                        iconName="infoBlue"
                        title={hoverIcon?.title}
                        description={hoverIcon?.description}
                        placement="bottom-start"
                    />
                )}
            </div>
            {isList ? customText : <div className={`information__description ${classNameDescription}`}>{description}</div>}
        </div>
    );
};

export const InformationElectronicDocument: React.FC<IInformationElectronicDocumentsProps> = ({
    id = generateId({
        module: ModuleApp.OTHERS,
        submodule: 'information-electronic-document',
        action: ActionElementType.INFO,
        elementType: ElementType.TXT,
    }),
    title,
    description,
    lightBulb,
    question,
    quantityInvoices,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<HTMLElement | null>(null);

    const handleOutFocus = (e: MouseEvent): void => {
        if (ref.current && !ref.current.contains(e.target as Node)) setTooltip(null);
    };

    useEffect(() => {
        document.body.addEventListener(CLICK, handleOutFocus);
        return (): void => {
            document.body.addEventListener(CLICK, handleOutFocus);
        };
    }, []);

    return (
        <div id={id} className="information-electronic-document">
            <div className="information-electronic-document__content-title">
                <h1>{title}</h1>
                {question && lightBulb && (
                    <div ref={ref} className="flex cursor-pointer gap-x-2" onClick={(e): void => setTooltip(e.currentTarget)}>
                        <Icon id={`${id}-info-icon`} name="lightPurple" classIcon="w-5.5 h-5.5" />
                        <span className="text-base underline text-purple">{question}</span>
                        <Tooltip
                            id={`${id}-info-tool`}
                            wrapperClassName="information-electronic-document__tooltip"
                            placement="bottom-start"
                            description={lightBulb}
                            iconName="lightBlue"
                            anchorEl={tooltip}
                        />
                    </div>
                )}
            </div>
            {quantityInvoices && <InvoiceCardAvailable quantityInvoices={quantityInvoices} />}
            <div className="w-full text-base text-gray-dark">{description}</div>
        </div>
    );
};

export const InformationBulb: React.FC<IInformationBulb> = ({
    id = generateId({
        module: ModuleApp.OTHERS,
        submodule: 'information-bulb',
        action: ActionElementType.INFO,
        elementType: ElementType.TXT,
    }),
    text,
    textDescription,
    wrapperClass,
    tooltipClass,
    descriptionClass,
    buttonClass = 'my-4.5',
}) => {
    const [showInformationBulb, setShowInformationBulb] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            const target = event.target as Node;
            if (
                buttonRef.current &&
                !buttonRef.current.contains(target) &&
                tooltipRef.current &&
                !tooltipRef.current.contains(target)
            ) {
                setShowInformationBulb(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div id={id} className={wrapperClass}>
            <button
                ref={buttonRef}
                className={`relative flex items-center gap-2 ${buttonClass}`}
                onClick={(): void => setShowInformationBulb(prev => !prev)}
                onMouseEnter={(): void => setShowInformationBulb(true)}
                onMouseLeave={(): void => setShowInformationBulb(false)}
            >
                <Icon id={`${id}-info-ico`} name="lightPurple" className="w-5.5 h-5.5" />
                <p className="underline text-purple">{text}</p>
            </button>
            {showInformationBulb && (
                <div
                    ref={tooltipRef}
                    className={`absolute flex information-tooltip shadow-templateDesign gap-2.5 items-start p-2 z-1 ${tooltipClass}`}
                >
                    <Icon id={`${id}-info-ico`} name="lightBlue" classIcon="w-5.5 h-5.5" />
                    <p className={`text-sm text-blue leading-tight font-aller ${descriptionClass}`}>{textDescription}</p>
                </div>
            )}
        </div>
    );
};
