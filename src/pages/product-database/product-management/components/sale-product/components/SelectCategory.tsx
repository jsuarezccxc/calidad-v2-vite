import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '@components/icon';
import { Form } from '@components/form';
import { IOptionSelect, TextInput, WrapperInput } from '@components/input';
import usePermissions from '@hooks/usePermissions';
import { lowerCase, removeAccents } from '@utils/Text';
import { IGenericRecord } from '@models/GenericRecord';
import { SHOW_DROPDOWN_OPTIONS } from '@constants/Options';
import { ONE, ZERO } from '@constants/Numbers';
import { ARROW_DOWN_KEY, ARROW_UP_KEY, ENTER_KEY, ESCAPE_KEY } from '@constants/Keys';

export const SelectCategory: React.FC<IGenericRecord> = props => {
    const { disabledInputs } = usePermissions();

    const {
        disabled,
        id = '',
        onClickSelect = (): void => {},
        wrapperSelect,
        value,
        selectIconType,
        options = [],
        onClickValue = (): void => {},
        isNewSelect,
        classesInput,
        wrapperClass,
        addCategory,
        totalCategories,
    } = props;

    const [showAddInput, setShowAddInput] = useState({ add: false, update: false });
    const [showOptions, setShowOptions] = useState(false);
    const [newCategory, setNewCategory] = useState('');
    const [rotate, setRotate] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [optionsFilter, setOptionsFilter] = useState<IOptionSelect[]>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
        setSearchValue(value);
    }, [value]);

    useEffect(() => {
        filterData();
    }, [searchValue]);

    useEffect(() => {
        if (highlightedIndex >= ZERO && optionRefs.current[highlightedIndex]) {
            optionRefs.current[highlightedIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [highlightedIndex]);

    const filterData = (): void => {
        const filtered = searchValue
            ? options.filter((option: IOptionSelect) =>
                  removeAccents(lowerCase(option.name)).includes(removeAccents(lowerCase(searchValue)))
              )
            : options;

        setOptionsFilter(filtered);
        setHighlightedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (!showOptions) return;

        if (e.key === ARROW_DOWN_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev < optionsFilter.length - ONE ? prev + ONE : ZERO));
        } else if (e.key === ARROW_UP_KEY) {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > ZERO ? prev - ONE : optionsFilter.length - ONE));
        } else if (e.key === ENTER_KEY) {
            e.preventDefault();
            if (highlightedIndex >= ZERO) {
                const option = optionsFilter[highlightedIndex];
                setShowOptions(false);
                setRotate(false);
                onClickValue(option);
            }
        } else if (e.key === ESCAPE_KEY) {
            setShowOptions(false);
            setRotate(false);
        }
    };

    return (
        <div className="flex items-end gap-2">
            <WrapperInput
                {...{
                    ...props,
                    classesWrapper: `${props.classesWrapper}`,
                    classesWrapperInput: `${props.classesWrapperInput} relative ${showOptions ? 'input--options' : ''} ${
                        props.wrapperInputClasses
                    }`,
                }}
            >
                <div className={`flex flex-col w-full ${wrapperClass} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}>
                    <div
                        onClick={
                            disabled
                                ? (): void => {}
                                : (): void => {
                                      setShowOptions(!showOptions);
                                      setRotate(!rotate);
                                      filterData();
                                      onClickSelect();
                                  }
                        }
                        className={`flex flex-row items-center justify-between ${wrapperSelect}`}
                        id={id}
                    >
                        <Form className="flex items-center w-full">
                            <input
                                value={searchValue}
                                onChange={(e): void => {
                                    setSearchValue(e.target.value);
                                    setShowOptions(true);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="..."
                                disabled={disabledInputs}
                                className="w-full px-2 outline-none"
                            />
                            <Icon
                                name="arrowDownGray"
                                className={`w-5.5 h-5.5 transition duration-200 transform ${
                                    !selectIconType && rotate ? 'rotate-180' : 'rotate-0'
                                }`}
                            />
                        </Form>
                    </div>
                    <div
                        className={`${
                            showOptions ? 'block' : 'hidden'
                        } flex flex-col absolute w-full top-8 bg-gray-light items-start rounded-lg`}
                    >
                        {optionsFilter.length > ZERO && (
                            <ul
                                className={`${classesInput} z-20 w-full top-full p-0 ${
                                    optionsFilter.length > SHOW_DROPDOWN_OPTIONS ? 'h-29 overflow-y-scroll' : ''
                                } ${isNewSelect ? 'hidden-scroll-select' : ''}`}
                                id="style-option"
                            >
                                {optionsFilter.map((option, index) => (
                                    <li
                                        ref={(el: HTMLLIElement | null): HTMLLIElement | null => (optionRefs.current[index] = el)}
                                        key={option.id}
                                        className={`flex h-10 ml-2 text-center list-none border-b hover:bg-blue hover:text-white ${
                                            highlightedIndex === index ? 'bg-blue text-white' : ''
                                        }`}
                                    >
                                        <span
                                            className="self-center w-full overflow-hidden text-sm leading-sm"
                                            onClick={(): void => {
                                                setShowOptions(false);
                                                setRotate(false);
                                                onClickValue(option);
                                            }}
                                        >
                                            {option.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {showAddInput.add || (showAddInput.update && !disabledInputs) ? (
                            <>
                                <div className="flex items-center w-full m-2">
                                    <TextInput
                                        placeholder="Nueva categoría"
                                        classesWrapper="select-category__input"
                                        value={newCategory}
                                        onChange={({ target }): void => setNewCategory(target.value)}
                                    />
                                    <Icon
                                        name="checkBlue"
                                        hoverIcon="checkGreen"
                                        className="w-5.5 h-5.5 ml-2"
                                        onClick={(): void => {
                                            addCategory(newCategory);
                                            setShowAddInput({ add: false, update: false });
                                            setNewCategory('');
                                            setShowOptions(false);
                                        }}
                                    />
                                    <Icon
                                        name="closeBlue"
                                        hoverIcon="closeGreen"
                                        className="w-4.5 h-4.5 mt-0.5 ml-2"
                                        onClick={(): void => {
                                            setShowAddInput({ add: false, update: false });
                                            setNewCategory('');
                                        }}
                                    />
                                </div>
                                {totalCategories.includes(removeAccents(lowerCase(newCategory))) && (
                                    <span className="mt-2 ml-3 text-sm text-purple text-start">
                                        *Nombre de categoría ya agregado
                                    </span>
                                )}
                            </>
                        ) : (
                            <span
                                className="mx-auto h-4.25 mt-2 overflow-hidden text-sm underline leading-sm text-green"
                                onClick={(): void => setShowAddInput({ add: true, update: false })}
                            >
                                + Agregar categoría
                            </span>
                        )}
                    </div>
                </div>
            </WrapperInput>
        </div>
    );
};
