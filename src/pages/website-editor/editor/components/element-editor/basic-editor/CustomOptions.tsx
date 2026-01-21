import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { KEEP_OPEN } from '@hooks/useToggleRendering';
import usePopper from '@hooks/usePopper';
import { IGenericRecord } from '@models/GenericRecord';
import { ChangeEvent } from '@components/input';
import { Slider } from '@components/slider';
import { Tooltip } from '@components/tooltip';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ICustomListProps, ICustomOption } from '../select';
import { CUSTOM_OPTIONS_CLASSES } from '.';
import './BasicEditor.scss';

export const LinksOption: React.FC<IGenericRecord> = ({ handleStyleChange, style, togglePopper }) => {
    const { selectedWebsite } = useSelector(({ websiteNode }: RootState) => websiteNode);
    const [isUrl, setIsUrl] = useState(false);
    const [linkValue, setLinkValue] = useState(style.link ?? '');
    const [isValidExternalUrl, setIsValidExternalUrl] = useState(false);

    useEffect(() => {
        setIsValidExternalUrl(isExternalUrl(linkValue));
    }, [linkValue]);

    const isExternalUrl = (url: string): boolean => {
        const regex = /^(http|https):\/\/[^ "]+$/;

        return regex.test(url);
    };

    return (
        <div className="link-option">
            {isUrl ? (
                <div className="flex mx-4">
                    <div>
                        <input
                            value={linkValue}
                            onChange={(e): void => {
                                setLinkValue(e.target.value);
                            }}
                            type="text"
                            className="link-option__input"
                        />
                        {!isValidExternalUrl && <p className="text-purple text-tiny">*La url no es valida</p>}
                    </div>

                    <Icon
                        name="checkBlue"
                        onClick={(): void => {
                            if (isValidExternalUrl) {
                                handleStyleChange({ name: 'link', value: linkValue });
                                setIsUrl(false);
                            }
                        }}
                        className="cursor-pointer"
                    />
                    <Icon
                        name="cancelBlue"
                        onClick={(): void => {
                            setIsUrl(false);
                            handleStyleChange({ name: 'link', value: '' });
                            setLinkValue('');
                        }}
                        className="cursor-pointer"
                    />
                </div>
            ) : (
                <div className="flex items-center h-8 mx-4 border-b border-black">
                    <p
                        onClick={(): void => {
                            if (linkValue) {
                                handleStyleChange({ name: 'link', value: linkValue });
                                togglePopper();
                            }
                        }}
                        className={`w-full text-center overflow-hidden whitespace-nowrap overflow-ellipsis ${
                            linkValue ? 'text-green underline cursor-pointer' : ''
                        }`}
                    >
                        {linkValue || 'URL'}
                    </p>
                    <Icon name="editBlue" className="cursor-pointer" onClick={(): void => setIsUrl(true)} />
                </div>
            )}

            {selectedWebsite.pages
                .filter(item => item.is_enable)
                .map((page, index) => (
                    <div
                        onClick={(): void => {
                            handleStyleChange({ name: 'link', value: page.tab_name, pageIdLink: page.id });
                            togglePopper();
                        }}
                        key={page.id}
                        className="w-full h-8 cursor-pointer hover:text-white hover:bg-blue"
                    >
                        <p className={`link-option__name ${selectedWebsite.pages.length - 1 === index ? 'border-none' : ''}`}>
                            {page.tab_name}
                        </p>
                    </div>
                ))}
        </div>
    );
};

export const SelectLink: React.FC<IGenericRecord> = ({ handleStyleChange, style }) => {
    const { anchorEl, togglePopper, mouseProps: mousePropsAddElements } = usePopper();
    return (
        <div onMouseLeave={mousePropsAddElements.onMouseLeave}>
            <div className="select-link" onClick={togglePopper}>
                <p className="select-link--text">{style?.link || 'Vincular a'}</p>
                <Icon name="arrowDownBlack" className="cursor-pointer arrow-icon--link" />
            </div>
            <Tooltip
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-action-custom-options-select-link`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.TOOL,
                })}
                wrapperClassName="w-44 h-45 overflow-y-auto bg-green-scrollbar shadow-templateDesign rounded-lg bg-white"
                anchorEl={anchorEl}
                isCustom
                element={<LinksOption handleStyleChange={handleStyleChange} style={style} togglePopper={togglePopper} />}
            />
        </div>
    );
};

export const BorderOption: React.FC<ICustomOption> = ({ index, onClick, option }) => (
    <p className="select__option" onClick={onClick}>
        {index ? (
            <button className={`basic-editor__border basic-editor__border--${CUSTOM_OPTIONS_CLASSES.BORDER[index]}`}>
                {option}
            </button>
        ) : (
            option
        )}
    </p>
);

export const SizeOptions: React.FC<ICustomListProps> = ({ handleStyleChange, style }) => {
    const handleChange = ({ target: { name, value } }: ChangeEvent): void => handleStyleChange({ name, value: Number(value) });
    return (
        <Form className="flex gap-4.5 w-full p-2.5 shadow-card bg-white">
            <div className="flex flex-col flex-1 gap-1">
                <label className="text-xtiny text-gray-dark">Ancho</label>
                <input
                    className={`basic-editor__size-box ${KEEP_OPEN}`}
                    name="width"
                    onChange={handleChange}
                    value={style?.width}
                />
            </div>
            <div className="flex flex-col flex-1 gap-1">
                <label className="text-xtiny text-gray-dark">Alto</label>
                <input
                    className={`basic-editor__size-box ${KEEP_OPEN}`}
                    name="height"
                    onChange={handleChange}
                    value={style?.height}
                />
            </div>
        </Form>
    );
};

export const LinkOption: React.FC<ICustomOption> = ({ index, onClick, option }) => {
    const [openInput, setOpenInput] = useState<boolean>(false);

    const toggleInput = (): void => setOpenInput(!openInput);

    return (
        <ol className={`select__option select__option--${openInput ? 'white' : ''}`} onClick={onClick}>
            {index ? (
                <span>{option}</span>
            ) : openInput ? (
                <EditLink />
            ) : (
                <div className={`flex items-center justify-center gap-2 text-sm ${KEEP_OPEN}`}>
                    <p className={KEEP_OPEN}>URL</p>
                    <svg
                        className={`${KEEP_OPEN} absolute right-10`}
                        width="17"
                        height="17"
                        viewBox="0 0 22 22"
                        fill="none"
                        onClick={toggleInput}
                    >
                        <path
                            d="M15.5132 7.35407L12.6459 4.48684L5 12.1328V15H7.86723L15.5132 7.35407ZM17.7764 5.09087C18.0745 4.79268 18.0745 4.31098 17.7764 4.01279L15.9872 2.22364C15.689 1.92545 15.2073 1.92545 14.9091 2.22364L13.4105 3.72225L16.2778 6.58947L17.7764 5.09087Z"
                            fill="#0B2C4C"
                            className={KEEP_OPEN}
                        />
                        <path
                            d="M2 18.5C2 17.6716 2.67157 17 3.49999 17H18.5C19.3284 17 20 17.6716 20 18.5C20 19.3284 19.3284 20 18.5 20H3.49999C2.67157 20 2 19.3284 2 18.5Z"
                            fill="#0B2C4C"
                            className={KEEP_OPEN}
                        />
                    </svg>
                </div>
            )}
        </ol>
    );
};

const EditLink: React.FC = () => <div className={`${KEEP_OPEN} bg-white`}>editLink</div>;

export const SpinOption: React.FC<ICustomOption> = ({ index, onClick, option }) => (
    <p className="flex items-center justify-center gap-4 select__option" onClick={onClick}>
        <span className="w-25">{option}</span>
        <svg
            className={`transform ${CUSTOM_OPTIONS_CLASSES.ARROW[index]}`}
            width="19"
            height="13"
            viewBox="0 0 19 13"
            fill="none"
        >
            <path
                d="M1.47023e-06 5.5L14.9572 5.5L11.1783 1.91L12.6667 0.499999L19 6.5L12.6667 12.5L11.1783 11.09L14.9572 7.5L1.29539e-06 7.5L1.47023e-06 5.5Z"
                fill="#0B2C4C"
            />
        </svg>
    </p>
);

export const BorderThicknessOption: React.FC<ICustomListProps> = ({ handleStyleChange, value = 1 }) => (
    <div className={`basic-editor__custom-list ${KEEP_OPEN}`}>
        <Slider
            className="basic-editor__slider"
            handleChange={(value): void => handleStyleChange({ name: 'borderWidth', value })}
            limits={{ min: 1, max: 15 }}
            unit="px"
            value={value}
        />
    </div>
);
