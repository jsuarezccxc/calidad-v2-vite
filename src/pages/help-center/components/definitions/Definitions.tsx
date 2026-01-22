//--- Libraries ---//
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
//--- Constants ---//
import { NAME } from '@constants/BuildProduct';
//--- Components---//
import { Icon } from '@components/icon';
import { ENTER, Form } from '@components/form';
import { Button } from '@components/button';
import AlphabetFilter from './components/alphabet-filter';
import { IOptionSelect, SearchInput, SelectSearchInput } from '@components/input';
//--- Information texts ---//
import { EASY_MANAGEMENT } from '@information-texts/EasyManagement';
//--- Codels ---//
import { Help } from '@models/HelpCenter';
import { IGenericRecord } from '@models/GenericRecord';
//--- Utils ---//
import { buildOptions } from '@utils/Company';
import { removeAccents } from '@utils/Text';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
//--- Pages ---//
import { WORDS } from '@pages/help-center';
//--- Root ---//
import { DEFAULT_SEARCH_INPUTS, DEFINITIONS, ELECTRONIC_DOCUMENTS, searchInputsName } from '.';
//--- Styles ---//
import './Definitions.scss';

export const Definitions: React.FC<IGenericRecord> = ({ words }) => {
    const history = useHistory();

    const [DE] = EASY_MANAGEMENT.HELP_TROPICS;
    const [selectedModule, setSelectedModule] = useState(DE.id);
    const [contentCard, setContentCard] = useState<IGenericRecord[]>([]);
    const [filterHelpTropics, setFilterHelpTropics] = useState<IGenericRecord[]>([]);
    const [filterDefinitions, setFilterDefinitions] = useState<IGenericRecord[]>([]);
    const [searchInput, setSearchInput] = useState<IGenericRecord>(DEFAULT_SEARCH_INPUTS);
    const { card, definition } = searchInputsName;

    useEffect(() => {
        if (words) {
            const electronicDocuments = EASY_MANAGEMENT.HELP_TROPICS.find(item => item.id === ELECTRONIC_DOCUMENTS)?.items;
            const shortDefinitions = electronicDocuments?.[DEFINITIONS].content as IGenericRecord[];
            electronicDocuments && setContentCard(shortDefinitions);
        }
    }, [words]);

    useEffect(() => {
        if (lengthGreaterThanZero(contentCard)) setFilterDefinitions(contentCard);
    }, [contentCard]);

    useEffect(() => {
        if (!searchInput[card]) {
            setFilterHelpTropics(EASY_MANAGEMENT.HELP_TROPICS.find(module => module.id === selectedModule)?.items ?? []);
        }
        handleFilterHelpTropics(searchInput[card]);
        if (!searchInput[definition]) {
            setFilterDefinitions(contentCard);
        }
        handleFilterDefinitions(searchInput[definition]);
    }, [selectedModule]);

    const handleChangeModule = (option: IOptionSelect): void => {
        setSelectedModule(option?.id ?? '');
    };

    const handleContentCard = (content: IGenericRecord[]): void => {
        history.push(`?${NAME}=${Help.Definitions}&${WORDS}=${true}`);
        setContentCard(content);
    };

    const handleLetterClick = (letter: string): void => {
        setFilterDefinitions(
            contentCard.filter(definition => String(definition.name).toLowerCase().startsWith(letter.toLowerCase()))
        );
    };

    const redirect = (route: string): void => {
        history.push(route);
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setSearchInput({
            ...searchInput,
            [name]: value,
        });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === ENTER) handleFilterHelpTropics(searchInput[card]);
    };

    const handleFilterHelpTropics = (value: string): void => {
        const normalizedSearchTerm = removeAccents(value.toLowerCase());

        const filterCardsByText =
            EASY_MANAGEMENT.HELP_TROPICS.find(module => module.id === selectedModule)?.items.filter(item =>
                removeAccents(item.textTitle.toLowerCase()).includes(normalizedSearchTerm)
            ) ?? [];

        setFilterHelpTropics(filterCardsByText);
    };

    const handleFilterDefinitions = (value: string): void => {
        setFilterDefinitions(
            contentCard.filter(definition => String(definition.name).toLowerCase().includes(value.toLowerCase()))
        );
    };

    const goBack = (): void => {
        setSearchInput(DEFAULT_SEARCH_INPUTS);
        if (!lengthEqualToZero(contentCard)) {
            history.goBack();
            setContentCard([]);
            return;
        }
        history.goBack();
    };

    const helpTropicsOptionsRender = buildOptions(EASY_MANAGEMENT.HELP_TROPICS).map(item => ({
        ...item,
        name: item.value,
    }));

    return (
        <>
            <Form sendWithEnter>
                {lengthEqualToZero(contentCard) ? (
                    <>
                        <div className="search_container">
                            <SearchInput
                                placeholder="Escriba la palabra que quiere encontrar"
                                classesWrapperInput="w-73"
                                classesInput="padding-right-none text-sm"
                                iconClassName="search_icon"
                                isNew
                                name={card}
                                onChange={handleSearchInput}
                                handleKeyChange={handleKeyDown}
                                value={searchInput[card]}
                            />
                        </div>
                        <div>
                            <SelectSearchInput
                                labelText="Módulo:"
                                classesWrapperInput="w-73"
                                selectIconType="arrowDownGreen"
                                placeholder="Seleccionar"
                                optionSelect={helpTropicsOptionsRender}
                                onChangeSelect={(_, e): void => handleChangeModule(e)}
                            />
                        </div>
                    </>
                ) : (
                    <div className="search_container">
                        <SearchInput
                            placeholder="Escriba la palabra que quiere encontrar"
                            classesWrapperInput="w-73"
                            classesInput="padding-right-none text-sm"
                            iconClassName="search_icon"
                            isNew
                            name={definition}
                            onChange={handleSearchInput}
                            handleKeyChange={handleKeyDown}
                            value={searchInput[definition]}
                        />
                    </div>
                )}
            </Form>

            <div className="mr-7 w-full bg-white flex flex-row flex-wrap gap-4.5 px-7 py-7.3 mt-7 rounded font">
                {!lengthEqualToZero(contentCard) ? (
                    <>
                        <AlphabetFilter onLetterClick={handleLetterClick} />
                        <ul className="list-disc mt-2.5 mx-7">
                            {lengthEqualToZero(filterDefinitions) && (
                                <li className="text-base leading-5 font-aller text-gray-dark">
                                    No existen definiciones por la letra seleccionada.
                                </li>
                            )}
                            {filterDefinitions.map((definition, index) => (
                                <li className="text-base leading-5 font-aller text-gray-dark" key={`definition-${index}`}>
                                    <span className="font-allerbold">{definition.name}:</span> {definition.description}
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    filterHelpTropics.map((item, index) => (
                        <div
                            key={`${index}-item-help`}
                            className="flex flex-row gap-2 px-1.875 py-5 items-center justify-center w-68 max-h-23.2 shadow-templateDesign rounded-lg cursor-pointer "
                            onClick={(): void => (item.content ? handleContentCard(item.content) : redirect(item.url ?? ''))}
                        >
                            <Icon name="fileCheckGreen" classIcon="icon-file cursor-inherit" />
                            <Icon name="separatorPurple" classIcon="icon-line cursor-inherit" />
                            {item.title}
                        </div>
                    ))
                )}
            </div>
            <div className="flex items-end justify-end w-full mt-7">
                <Button
                    classes="text-blue shadow-templateDesign"
                    background="white"
                    text="Atrás"
                    onClick={(): void => goBack()}
                />
            </div>
        </>
    );
};
