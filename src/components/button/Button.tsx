import React, { useState } from 'react';
import { Link as LinkComponent } from 'react-router-dom';
import usePopper from '@hooks/usePopper';
import { IGenericRecord } from '@models/GenericRecord';
import { Icon, IconsNames } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import {
    IButtonProps,
    ILinkProps,
    IDoubleLineProps,
    LinkColor,
    IOutsideloadIconsProps,
    ButtonType,
    ISimpleButtonProps,
    IButtonWithIconProps,
    TypeIcon,
} from '.';
import './Button.scss';

export const Button: React.FC<IButtonProps> = ({
    id = generateId({
        module: ModuleApp.BUTTONS,
        submodule: 'default-id',
        action: ActionElementType.CUSTOM_ACTION,
        elementType: ElementType.BTN,
    }),
    linesNumber = 1,
    background = 'blue',
    text,
    onClick,
    classes = '',
    disabled = false,
    type = ButtonType.Button,
    style,
    reference,
    tooltip,
}: IButtonProps) => {
    const { anchorEl, mouseProps } = usePopper();
    const { Blue, Green } = TypeIcon;
    const isGreen = background === LinkColor.GREEN;
    const [name, setName] = useState<IconsNames>(isGreen ? Blue : Green);
    const words = text?.split('/n');
    const textColor = disabled
        ? background === LinkColor.GRAY
            ? LinkColor.WHITE
            : LinkColor.GRAY
        : background === LinkColor.BLUE || background === LinkColor.GRAY || background === LinkColor.GREEN
        ? LinkColor.WHITE
        : LinkColor.BLUE;
    const backgroundDisabled = disabled ? (background ? background : 'gray-light') : background;

    const handleOverAndLeave = (): void =>
        setName(prev => {
            if (prev === Blue) return isGreen ? Blue : Green;
            return Blue;
        });

    return (
        <button
            ref={reference}
            id={id}
            className={`${classes.includes('btn-bin-table') ? '' : 'btn'} bg-${backgroundDisabled} ${
                disabled ? 'cursor-default' : 'cursor-pointer hover:bg-green hover:text-white'
            } focus:bg-${background} focus:text-${textColor} text-${textColor} ${classes} select-none font-allerbold`}
            onClick={onClick}
            disabled={disabled}
            type={type}
            style={style}
            onMouseOver={handleOverAndLeave}
            onMouseLeave={handleOverAndLeave}
        >
            {tooltip && (
                <div {...mouseProps}>
                    <Icon
                        id={generateId({
                            module: ModuleApp.BUTTONS,
                            submodule: id,
                            action: ActionElementType.INFO,
                            elementType: ElementType.ICO,
                        })}
                        name={name}
                    />
                    <Tooltip
                        id={generateId({
                            module: ModuleApp.BUTTONS,
                            submodule: id,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TOOL,
                        })}
                        {...tooltip}
                        placement="bottom-start"
                        anchorEl={anchorEl}
                        iconName="infoBlue"
                        wrapperClassName="rounded"
                    />
                </div>
            )}
            {words?.length > 1 && linesNumber > 1 ? <DoubleLine words={words} /> : text}
        </button>
    );
};

const DoubleLine: React.FC<IDoubleLineProps> = ({ words }: IDoubleLineProps) => {
    return (
        <div className="flex flex-col items-center">
            {words.map((word: string) => (
                <span className="p-0 m-0" key={word}>
                    {word}
                </span>
            ))}
        </div>
    );
};

export const Link: React.FC<ILinkProps> = ({
    id = generateId({
        module: ModuleApp.BUTTONS,
        submodule: 'default-id',
        action: ActionElementType.REDIRECT,
        elementType: ElementType.LNK,
    }),
    text,
    href,
    linkColor = LinkColor.GREEN,
    classes = '',
    target = '_self',
    onClick = (): void => {},
    download = false,
    disabled = false,
    hover = true,
}: ILinkProps) => {
    const linkText = text?.includes('\n') ? text.split('\n') : [text];
    const getPadding = (index: number): string => (index ? 'pl-0' : '');

    return (
        <>
            {download ? (
                <a
                    id={id}
                    href={href}
                    download
                    className={`text-${linkColor} ${classes} ${hover && 'hover:text-blue'}`}
                    target={target}
                    onClick={onClick}
                >
                    {text}
                </a>
            ) : !disabled ? (
                <LinkComponent
                    id={id}
                    to={href}
                    className={`link ${hover && 'hover:text-blue'} text-${linkColor} ${classes}`}
                    target={target}
                    onClick={onClick}
                >
                    {linkText.map((line: string, index: number) => (
                        <span key={line} className={getPadding(index)}>
                            {line}
                        </span>
                    ))}
                </LinkComponent>
            ) : (
                <span id={id} className={`text-sm underline cursor-default text-gray ${classes}`}>
                    {text}
                </span>
            )}
        </>
    );
};

export const LinkAdd: React.FC<IGenericRecord> = ({
    id = generateId({
        module: ModuleApp.BUTTONS,
        submodule: 'default-id',
        action: ActionElementType.REDIRECT,
        elementType: ElementType.LNK,
    }),
    text,
    linkColor = LinkColor.GREEN,
    classes = '',
    onClick = (): void => {},
    disabled = false,
    textBaseXs = false,
}: IGenericRecord) => {
    return (
        <>
            {disabled ? (
                <span className={`${classes} text-sm underline cursor-default text-gray`}>{text}</span>
            ) : (
                <span
                    id={id}
                    className={`${classes} link text-sm ${
                        textBaseXs ? 'xs:text-base' : 'xs:text-tiny'
                    } underline cursor-pointer text-${linkColor}`}
                    onClick={onClick}
                >
                    {text}
                </span>
            )}
        </>
    );
};

export const LinkIcons: React.FC<IOutsideloadIconsProps> = ({
    id,
    className = '',
    href,
    nameIcon,
    classIcon,
    target = '_self',
}) => {
    return (
        <div id={id} className={className}>
            <a href={href} target={target}>
                <Icon
                    id={generateId({
                        module: ModuleApp.BUTTONS,
                        submodule: `${id}-link`,
                        action: ActionElementType.REDIRECT,
                        elementType: ElementType.ICO,
                    })}
                    name={nameIcon}
                    className={`cursor-pointer ${classIcon}`}
                />
            </a>
        </div>
    );
};

export const SimpleButton: React.FC<ISimpleButtonProps> = ({
    id = generateId({
        module: ModuleApp.BUTTONS,
        submodule: 'default-id',
        action: ActionElementType.CUSTOM_ACTION,
        elementType: ElementType.BTN,
    }),
    children,
    className,
    onClick = (): void => {},
    onMouseLeave = (): void => {},
    onMouseOver = (): void => {},
    style,
    disabled = false,
}) => (
    <button
        id={id}
        className={className}
        disabled={disabled}
        style={style}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        type="button"
    >
        {children}
    </button>
);

export const ButtonWithIcon: React.FC<IButtonWithIconProps> = ({
    id = generateId({
        module: ModuleApp.BUTTONS,
        submodule: 'default-id',
        action: ActionElementType.REDIRECT,
        elementType: ElementType.LNK,
    }),
    children,
    className,
    onClick = (): void => {},
    onMouseLeave = (): void => {},
    onMouseOver = (): void => {},
    style,
    disabled = false,
    nameIcon,
    classIcon,
}) => (
    <button
        id={id}
        className={`flex flex-row text-sm font-allerbold rounded-md shadow-lg items-center justify-center ${className}`}
        disabled={disabled}
        style={style}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        type="button"
    >
        {nameIcon && (
            <Icon
                id={generateId({
                    module: ModuleApp.BUTTONS,
                    submodule: id,
                    action: ActionElementType.INFO,
                    elementType: ElementType.ICO,
                })}
                name={nameIcon}
                className={`cursor-pointer mr-2 ${classIcon}`}
            />
        )}
        {children}
    </button>
);
