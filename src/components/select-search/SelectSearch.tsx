/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement, useState, useEffect, useMemo } from 'react';
import { Autocomplete, AutocompleteRenderInputParams, TextField } from '@mui/material';
import { v4 as uuid } from 'uuid';
import { Icon } from '@components/icon';
import { ChangeEvent } from '@components/input';
import { cutString } from '@utils/Text';
import { ISelectSearchProps, IOption, defaultOption } from '.';
import './SelectSearch.scss';

export const SelectSearch: React.FC<ISelectSearchProps> = ({
    id = '',
    options = [],
    onChange = (): void => {},
    value = '',
    disabled = false,
    allOptions,
    showList,
    toggleSelectSearch = (): void => {},
    onKeyPress = (): void => {},
    name = '',
    inputClass = '',
    className = '',
    selectIconType = 'arrowDownGray',
    disableSearch = false,
    placeholder = 'Seleccionar',
}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [option, setOption] = useState<IOption>(defaultOption);
    const [optionReference, setOptionReference] = useState<IOption>(defaultOption);
    const [loading, setLoading] = useState<boolean>(false);
    const showOptions = useMemo(() => (showList ? !!showList[name] : false), [showList]);

    useEffect(() => {
        setInitialOption();
    }, [value, options]);

    useEffect(() => {
        if (!showOptions) {
            setPreviousState();
            removeFocusFromInputs();
        } else {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return (): void => clearTimeout(timer);
        }
    }, [showOptions]);

    const setInitialOption = (): void => {
        if (!String(value)) return setOption(defaultOption);

        if (options?.length || allOptions?.length) {
            const option = [...(allOptions || options)].find(option => {
                return option.value === value;
            });
            if (option) setOption(option);
        }
    };

    const closeOptions = (): void => {
        removeFocusFromInputs();
        toggleSelectSearch(false, name);
    };

    const handleOptionChange = (_: any, newOption: any): void => {
        if (newOption) {
            setOption(newOption);
            return onChange(newOption, name);
        }
        if (optionReference.name) return setOption(optionReference);
        setOptionReference(option);
    };

    const handleChangeValue = ({ target: { value } }: ChangeEvent): void => {
        setSearchValue(value);
        if (!value) setOption(defaultOption);
    };

    const handleInputBlur = (): void => {
        toggleSelectSearch(false, name);
        setPreviousState();
    };

    const handleInputFocus = (option: IOption): void => {
        if (option.value) {
            setOption(defaultOption);
            setOptionReference(option);
        }
        toggleSelectSearch(true, name);
    };

    const removeFocusFromInputs = (): void => {
        const inputs: NodeListOf<HTMLElement> = document.querySelectorAll('.MuiInputBase-input');
        inputs.forEach(item => item.blur());
    };

    const selectOption = (option: any): void => {
        handleOptionChange('', option);
        closeOptions();
    };

    const setPreviousState = (): void => {
        if (option?.value) return;
        if (optionReference.value) {
            setOption(optionReference);
            setOptionReference(defaultOption);
        }
    };

    return (
        <Autocomplete
            classes={{ input: inputClass }}
            className={className}
            id={id}
            disabled={disabled || loading}
            fullWidth
            getOptionLabel={(option: IOption): string => option.name}
            noOptionsText="No hay resultados para esta busqueda."
            onChange={handleOptionChange}
            onClose={closeOptions}
            onOpen={(e): void => (disabled ? e.preventDefault() : toggleSelectSearch(true, name))}
            options={options}
            popupIcon={
                <div className="flex">
                    {loading && <Icon name="loader" classIcon="w-5.5 h-5.5 mr-1" />}
                    <Icon name={selectIconType} classIcon="w-5.5 h-5.5" />
                </div>
            }
            renderInput={(params: AutocompleteRenderInputParams): ReactElement => (
                <TextField
                    {...params}
                    placeholder={placeholder}
                    variant="standard"
                    onChange={handleChangeValue}
                    multiline
                    value={searchValue}
                    onFocus={(): void => handleInputFocus(option)}
                    onBlur={handleInputBlur}
                    InputProps={{
                        ...params.InputProps,
                        sx: {
                            display: 'flex',
                            alignItems: 'center',
                            margin: 0,
                        },
                    }}
                    inputProps={{
                        ...params.inputProps,
                        style: {
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxHeight: '2em !important',
                            whiteSpace: 'normal',
                            margin: 0,
                        },
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            display: 'flex',
                            alignItems: 'center',
                            boxSizing: 'border-box',
                        },
                        '& .MuiInputBase-input': {
                            display: '-webkit-box',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxHeight: '2em !important',
                            margin: 0,
                            textAlign: 'center',
                        },
                    }}
                />
            )}
            onKeyPress={onKeyPress}
            value={option}
            renderOption={(props, item): ReactElement => {
                return (
                    <li {...props} className="MuiAutocomplete-option" key={uuid()} onClick={(): void => selectOption(item)}>
                        {item.name}
                    </li>
                );
            }}
            {...(disableSearch ? { onKeyDown: (e): void => e.preventDefault() } : showList && { open: showOptions })}
        />
    );
};

export const SelectSearchMultiple: React.FC<ISelectSearchProps> = ({
    id = '',
    options = [],
    onChange = (): void => {},
    deleteTag = (): void => {},
    value = '',
    disabled = false,
    allOptions,
    showList,
    toggleSelectSearch = (): void => {},
    name = '',
    inputClass = '',
    className = '',
    selectIconType = 'arrowDownGray',
    disableSearch = false,
}) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);

    const showOptions = useMemo(() => (showList ? !!showList[name] : false), [showList]);

    useEffect(() => {
        setInitialOptions();
    }, [value, options]);

    useEffect(() => {
        if (!showOptions) {
            removeFocusFromInputs();
        }
    }, [showOptions]);

    const setInitialOptions = (): void => {
        if (options?.length || allOptions?.length) {
            const initialOptions = [...(allOptions || options)].filter(option => value.includes(option.value));
            setSelectedOptions(initialOptions);
        }
    };

    const closeOptions = (): void => {
        removeFocusFromInputs();
        toggleSelectSearch(false, name);
    };

    const handleOptionChange = (_: any, newOptions: IOption[]): void => {
        setSelectedOptions(newOptions);
        onChange(newOptions[newOptions.length - 1]?.value, name);
    };

    const handleChangeValue = ({ target: { value } }: ChangeEvent): void => {
        setSearchValue(value);
    };

    const handleInputBlur = (): void => {
        toggleSelectSearch(false, name);
    };

    const handleInputFocus = (): void => {
        toggleSelectSearch(true, name);
    };

    const removeFocusFromInputs = (): void => {
        const inputs: NodeListOf<HTMLElement> = document.querySelectorAll('.MuiInputBase-input');
        inputs.forEach(item => item.blur());
    };

    return (
        <Autocomplete
            multiple
            classes={{ input: inputClass }}
            className={className}
            id={id}
            disabled={disabled}
            fullWidth
            getOptionLabel={(option: IOption): string => option.name}
            noOptionsText="No hay resultados para esta búsqueda."
            onChange={handleOptionChange}
            onClose={closeOptions}
            onOpen={(): void => toggleSelectSearch(true, name)}
            options={options}
            popupIcon={<Icon name={selectIconType} classIcon="w-5.5 h-5.5" />}
            filterSelectedOptions
            renderInput={(params: AutocompleteRenderInputParams): ReactElement => (
                <TextField
                    {...params}
                    placeholder="Seleccionar"
                    variant="standard"
                    onChange={handleChangeValue}
                    multiline
                    value={searchValue}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
            )}
            value={selectedOptions}
            renderOption={(props, item): ReactElement => (
                <li {...props} className="MuiAutocomplete-option" key={uuid()}>
                    {item.name}
                </li>
            )}
            renderTags={(tagValue, getTagProps): React.ReactNode =>
                tagValue.map((option, index) => (
                    <div
                        {...getTagProps({ index })}
                        key={uuid()}
                        className="flex gap-2 px-1 mx-1 mt-1 rounded-lg bg-green-extraLight"
                    >
                        <span className="text-sm font-aller">{cutString(option.name)}</span>
                        <Icon
                            name="closeSlimBlue"
                            classIcon="w-3 cursor-pointer"
                            onClick={(): void => {
                                deleteTag(option, name);
                                setTimeout(() => {
                                    toggleSelectSearch(false, name);
                                }, 1);
                            }}
                        />
                    </div>
                ))
            }
            {...(disableSearch && { onKeyDown: (e): void => e.preventDefault() })}
            {...(showList && { open: showOptions })}
        />
    );
};
