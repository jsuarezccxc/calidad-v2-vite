import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@components/icon';
import { ELECTRONIC_DOCUMENT_ITEMS, ITEMS_PAGE, INITIAL_PAGE, GROUP_PAGES } from '@constants/Paginator';
import { LANGUAGE_KEY } from '@constants/Translate';
import { IGenericRecord } from '@models/GenericRecord';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { IPageNumber, IPaginatorProps } from '.';

export const Paginator: React.FC<IPaginatorProps> = ({
    data,
    currentPage,
    setCurrentPage,
    limits,
    setLimits,
    wrapperClassName = '',
    electronicDocument = false,
    customItemPage = ITEMS_PAGE,
    reload = false,
    id = generateId({
        module: ModuleApp.PAGINATOR,
        submodule: 'default',
        action: ActionElementType.ACTION,
        elementType: ElementType.PGN,
    }),
}) => {
    const [translate] = useTranslation(LANGUAGE_KEY);

    const initialState = { start: 0, finish: customItemPage };
    const { start, finish } = limits;
    const pages = Math.ceil(data?.length / (electronicDocument ? ELECTRONIC_DOCUMENT_ITEMS : customItemPage));
    const [numberPages, setNumberPages] = useState<number[]>([]);
    const [groupPages, setGroupPages] = useState<IGenericRecord>({ start: 0, finish: 0 });

    useEffect(() => {
        setGroupPages({ start: 0, finish: 0 });
        getPaginator();
        validateGroupPages();
    }, [data, currentPage]);

    useEffect(() => {
        setGroupPages({ start: 0, finish: 0 });
        validateGroupPages();
    }, [data, reload]);

    useEffect(() => {}, [currentPage]);

    const getPaginator = (): void => {
        const numberPages = [];
        for (let i = 0; i < pages; i++) {
            numberPages.push(i);
        }
        setNumberPages(numberPages);
    };

    const nextPage = (): void => {
        if (currentPage + 1 !== pages) {
            setLimits({ start: finish, finish: finish + customItemPage });
            setCurrentPage(currentPage + 1);
        }
    };

    const previousPage = (): void => {
        if (currentPage + 1 > 1) {
            setLimits({ start: start - customItemPage, finish: start });
            setCurrentPage(currentPage - 1);
        }
        setGroupPages({ start: 0, finish: 0 });
    };

    const handleClickNumber = (page: number): void => {
        if (!page) {
            setLimits(initialState);
        } else {
            const start = customItemPage * page;
            setLimits({
                start,
                finish: start + customItemPage,
            });
        }
        setCurrentPage(page);
    };

    const disabledClass = (page: number): string => (currentPage === page ? 'bg-transparent opacity-60' : '');

    const validateGroupPages = (): void => {
        /* If current page is equal or greater than group number pages */
        if (currentPage >= GROUP_PAGES - 1) {
            /* Plus 1 to current page because currentPage starts in 0, then, validate if currentPage is the last pages */
            if (currentPage + 1 === pages) {
                /*
                 * start: Validate that initial range has 3 items less.
                 * finish: Validate that finish range has numberPages length.
                 */
                return setGroupPages({ start: numberPages.length - GROUP_PAGES, finish: numberPages.length });
            }

            /*
             * start: Validate that initial range starts one page before that currentPage.
             * finish: Validate that finish range finish one page after thar currentPage.
             */
            setGroupPages({ start: currentPage - 1, finish: currentPage + GROUP_PAGES - 1 });
        } else {
            /* Validate is pages number is smaller or equal than group pages' number */
            if (GROUP_PAGES >= pages) {
                /*
                 * start: Initial value groupPage start property. Index doesn't change.
                 * finish: Total number pages for finish range.
                 */
                return setGroupPages({ start: currentPage, finish: pages });
            }

            /* Validate if currentPage plus group pages number is greater than pages */
            if (currentPage + GROUP_PAGES > pages) {
                /*
                 * start: Actual groupPage start property, plus one.
                 * finish: numberPages length, because is the last page.
                 */
                return setGroupPages({ start: groupPages.start + 1, finish: numberPages.length });
            }

            /*
             * start: Actual groupPage start property. Index doesn't change.
             * finish: Actual groupPage start property plus group pages number. To have a space of 3 items.
             */
            setGroupPages({ start: groupPages.start, finish: groupPages.start + GROUP_PAGES });
        }
    };

    return (
        <div id={id} className={`flex items-center justify-end xs:pt-0 border-gray-dark ${wrapperClassName} margin-paginator`}>
            <p className={`text-tiny block sm:hidden text-gray-dark ${currentPage ? '' : 'pr-2'} mr-1.5 xs:mr-0`}>
                {translate('generic.page').slice(0, 3)}. <span className="font-semibold">{currentPage + 1}</span>{' '}
                {translate('generic.from')} {numberPages.length}:
            </p>
            <p className={`text-tiny hidden sm:block text-gray-dark ${currentPage ? '' : 'pr-5.5'} mr-1.5 xs:mr-0`}>
                {translate('generic.page')} <span className="font-semibold">{currentPage + 1}</span> {translate('generic.from')}{' '}
                {numberPages.length}:
            </p>
            {Boolean(currentPage) && (
                <Icon
                    id={generateId({
                        module: ModuleApp.PAGINATOR,
                        submodule: `${id}-arrow-left`,
                        action: ActionElementType.PREVIOUS,
                        elementType: ElementType.ICO,
                    })}
                    name="arrowLeftDGray"
                    className={`bg-transparent w-5.5 h-5.5 cursor-pointer ${disabledClass(pages)}`}
                    onClick={previousPage}
                />
            )}
            {numberPages.slice(groupPages.start, groupPages.finish).map((page: number) => (
                <PageNumber key={page} number={page} current={currentPage} onClick={(): void => handleClickNumber(page)} />
            ))}
            {currentPage + 1 === numberPages.length && <div className="h-5.5 w-5.5" />}
            {currentPage + 1 !== numberPages.length && (
                <Icon
                    id={generateId({
                        module: ModuleApp.PAGINATOR,
                        submodule: `${id}-arrow-right`,
                        action: ActionElementType.NEXT,
                        elementType: ElementType.ICO,
                    })}
                    name="arrowRightDGray"
                    className={`bg-transparent w-5.5 h-5.5 cursor-pointer ${disabledClass(pages)}`}
                    onClick={nextPage}
                />
            )}
        </div>
    );
};

export const PageNumber: React.FC<IPageNumber> = ({ number, current, onClick }) => {
    const active = current === number ? 'bg-green rounded-md text-white' : 'text-gray-dark';
    return (
        <span
            id={generateId({
                module: ModuleApp.PAGINATOR,
                submodule: `${number + 1}-page-number`,
                action: ActionElementType.CHANGE,
                elementType: ElementType.ICO,
            })}
            className={`flex text-tiny cursor-pointer ${active} px-1.5 py-0.75`}
            onClick={onClick}
        >
            {number + 1}
        </span>
    );
};

export const CustomPaginator: React.FC<IGenericRecord> = ({ data = [], setData = (): void => {} }) => {
    const [currentPage, setCurrentPage] = useState<number>(INITIAL_PAGE);
    const [pages, setPages] = useState<number[]>([]);
    const [startPage, finishPage] = [INITIAL_PAGE, Math.max(...pages)];

    useEffect(() => getPages(), [data]);

    useEffect(() => changeData(), [currentPage]);

    const getPages = (): void => {
        const pages = [];
        for (let i = 0; i < Math.ceil(data?.length / ITEMS_PAGE); i++) pages.push(i + 1);
        setPages(pages);
    };

    const changeData = (): void => {
        const finishPosition = currentPage * ITEMS_PAGE;
        const startPosition = finishPosition - ITEMS_PAGE;
        setData(data?.slice(startPosition, finishPosition));
    };

    const nextPage = (): void => {
        if (currentPage < finishPage) setCurrentPage(currentPage + 1);
    };

    const previousPage = (): void => {
        if (currentPage > startPage) setCurrentPage(currentPage - 1);
    };

    const changePage = (page: number): void => setCurrentPage(page);

    const disabledClass = (disabled: boolean): string =>
        disabled ? 'bg-transparent opacity-60 text-gray-dark' : 'cursor-pointer';

    const pageClass = (page: number): string =>
        page === currentPage ? 'bg-green text-white ' : 'bg-transparent text-gray-dark cursor-default';

    return (
        <div className="flex items-center justify-end mt-1">
            <span className="text-tiny text-gray-dark">Página</span>
            <Icon
                id={generateId({
                    module: ModuleApp.PAGINATOR,
                    submodule: `${currentPage}-arrow-left`,
                    action: ActionElementType.PREVIOUS,
                    elementType: ElementType.ICO,
                })}
                name="arrowLeftGray"
                className={`bg-transparent w-5.5 h-5.5 ${disabledClass(currentPage === INITIAL_PAGE)}`}
                onClick={previousPage}
            />
            <div className="flex gap-1">
                {pages?.map(page => (
                    <span
                        id={generateId({
                            module: ModuleApp.PAGINATOR,
                            submodule: `${page}-page-number`,
                            action: ActionElementType.CHANGE,
                            elementType: ElementType.ICO,
                        })}
                        key={`page-${page}`}
                        className={`px-1 rounded-md cursor-pointer text-tiny ${pageClass(page)}`}
                        onClick={(): void => changePage(page)}
                    >
                        {page}
                    </span>
                ))}
            </div>
            <Icon
                id={generateId({
                    module: ModuleApp.PAGINATOR,
                    submodule: `${currentPage}-arrow-right`,
                    action: ActionElementType.NEXT,
                    elementType: ElementType.ICO,
                })}
                name="arrowRightGray"
                className={`bg-transparent w-5.5 h-5.5 ${disabledClass(currentPage === pages.length)}`}
                onClick={nextPage}
            />
        </div>
    );
};
