import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import { removeAccents } from '@utils/Text';
import { ONE, ZERO } from '@constants/Numbers';
import { ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY, ESCAPE_KEY } from '@constants/Keys';
import './SearchDropdownPaginate.scss';

export const SearchDropdownPaginate: React.FC<IGenericRecord> = ({
    valueSelected = '',
    onChangeSelected = (): void => {},
    title = 'Unidad de medida:',
    placeHolder = 'Seleccionar',
    options = [],
    disabled = false,
    classesContainer = '',
    required = false,
    classesInput = '',
    name = '',
    firstView = [],
    id,
}) => {
    const [value, setValue] = useState({ value: '', id: '' });
    const [formatData, setFormatData] = useState<IGenericRecord>([]);
    const [showDrop, setShowDrop] = useState(false);
    const [seeMore, setSeeMore] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const onFormatData = (data: IGenericRecord, seeMore: boolean): IGenericRecord =>
        !seeMore
            ? firstView?.sort((a: IGenericRecord, b: IGenericRecord) =>
                  removeAccents(a?.name)?.toLowerCase().localeCompare(removeAccents(b?.name)?.toLowerCase())
              ) || []
            : data?.sort((a: IGenericRecord, b: IGenericRecord) =>
                  removeAccents(a?.name)?.toLowerCase().localeCompare(removeAccents(b?.name)?.toLowerCase())
              ) || [];

    useEffect(() => setFormatData(onFormatData(options, seeMore)), [seeMore, options]);

    useEffect(() => getInitialValue(), [valueSelected, options]);

    useEffect(() => onChangeSelected(value, name), [value]);

    useEffect(() => {
        if (!showDrop) setHighlightedIndex(-1);
    }, [showDrop]);

    useEffect(() => setHighlightedIndex(-1), [formatData]);

    useEffect(() => {
        const optionEl = optionRefs.current[highlightedIndex];
        if (optionEl) {
            optionEl.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [highlightedIndex]);

    const getInitialValue = (): void => {
        if (!valueSelected) {
            setValue({ value: '', id: '' });
        } else {
            const option = options?.find((option: IGenericRecord) => option.value === valueSelected);
            if (option) setValue({ value: option.name, id: option.value });
        }
    };

    const onChange = (value: string): void => {
        setValue({ id: '', value });
        setFormatData(onSearch(value));
    };

    const onClickOption = ({ name: value, id, value: key }: IGenericRecord): void => {
        setValue({ id: id || key, value });
        setShowDrop(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!showDrop) return;

        if (e.key === ARROW_DOWN_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev < formatData.length - ONE ? prev + ONE : ZERO));
        } else if (e.key === ARROW_UP_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > ZERO ? prev - ONE : formatData.length - ONE));
        } else if (e.key === ENTER_KEY) {
            e.preventDefault();
            if (highlightedIndex >= ZERO && highlightedIndex < formatData.length) {
                onClickOption(formatData[highlightedIndex]);
            }
        } else if (e.key === ESCAPE_KEY) {
            setShowDrop(false);
            setHighlightedIndex(-ONE);
        }
    };

    const onSearch = (e: string): IGenericRecord => {
        if (e.length) {
            setIsSearch(true);
            return options.filter((item: IGenericRecord) =>
                removeAccents(item?.name)?.toLowerCase()?.includes(removeAccents(e).toLowerCase())
            );
        }
        setIsSearch(false);
        return onFormatData(options, seeMore);
    };

    return (
        <div id={id} className="relative">
            <div className="mb-1 ml-2 font-allerbold text-blue text-tiny">{title}</div>
            <div
                className={`w-full lg:w-73 border-1 bg-white ${
                    disabled ? 'bg-gray-light' : ''
                } rounded-md h-8 flex align-middle flex-row justify-between ${
                    required ? 'border-purple' : showDrop ? 'border-green' : 'border-gray'
                } ${classesContainer}`}
                onFocus={(): void => {
                    !disabled && setShowDrop(true);
                }}
            >
                <input
                    id={id}
                    disabled={disabled}
                    autoComplete="new-password"
                    type="text"
                    value={value.value}
                    placeholder={placeHolder}
                    className={`w-4/5 h-full ml-2 text-sm border-none outline-none ${
                        disabled ? 'bg-gray-light' : ''
                    } font-aller text-gray-dark ${classesInput}`}
                    onChange={(e): void => {
                        !disabled && onChange(e.target.value);
                    }}
                    ref={inputRef}
                    onKeyDown={handleKeyDown}
                />
                <div className="flex justify-center h-full">
                    <Icon
                        onClick={(): void => {
                            !disabled && setShowDrop(!showDrop);
                        }}
                        name="arrowDownGray"
                        className={`transition duration-200 transform h-6 mt-1 ${showDrop ? 'rotate-180' : 'rotate-0'}`}
                    />
                </div>
            </div>
            <div
                className={`max-h-34 z-10 ${
                    !showDrop ? 'hidden' : ''
                } bg-gray-light absolute overflow-y-scroll bg-green-scrollbar w-full lg:w-73 rounded-md shadow-template text-center font-aller text-sm text-gray-dark`}
            >
                {formatData?.map((item: IGenericRecord, index: number) => (
                    <div
                        key={item.name}
                        ref={(el: HTMLDivElement | null): HTMLDivElement | null => (optionRefs.current[index] = el)}
                        className={`flex min-h-8.4 justify-center align-middle text-center hover:bg-blue hover:text-white ${
                            highlightedIndex === index ? 'bg-blue text-white' : ''
                        }`}
                        onClick={(): void => onClickOption(item)}
                    >
                        <div
                            className={`w-4/5 flex items-center justify-center ${
                                index !== ZERO ? 'border-t-1' : ''
                            } SearchDropDownPaginate__options`}
                        >
                            <span>{item?.name}</span>
                        </div>
                    </div>
                ))}

                <div
                    onClick={(): void => setSeeMore(true)}
                    className={`flex justify-center text-center min-h-8.4 hover:bg-blue hover:text-white ${
                        seeMore || isSearch ? 'hidden' : ''
                    }`}
                >
                    <div className="w-4/5 border-t-1 SearchDropDownPaginate__options">
                        <span className="underline text-green-light"> ver más</span>
                    </div>
                </div>
            </div>
            {required && <p className="text-tiny text-purple mr-1.5 text-right mt-1">*Campo obligatorio</p>}
        </div>
    );
};
