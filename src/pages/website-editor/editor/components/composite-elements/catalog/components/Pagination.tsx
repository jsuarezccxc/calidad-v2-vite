import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ONE } from '@constants/Numbers';
import { createArray } from '@utils/Array';
import { getPaginationText, RightArrow, IPaginationProps } from '.';

export const Pagination: React.FC<IPaginationProps> = ({
    activePage,
    data = [],
    isInferior = false,
    itemsPerPage = 9,
    updatePaginatedData,
    updateActivePage,
    isOrder,
}) => {
    const [pages, setPages] = useState<number[]>([]);
    const pagesNumber = useMemo(() => Math.ceil(data.length / itemsPerPage), [data, itemsPerPage]);

    const getPageRange = useCallback(() => {
        const finalPage = activePage * itemsPerPage;
        return { finalPage, initialPage: finalPage - itemsPerPage };
    }, [activePage, itemsPerPage]);

    const { finalPage, initialPage } = useMemo(() => getPageRange(), [getPageRange]);

    const paginateData = (): void => {
        updatePaginatedData([...data].slice(initialPage, finalPage));
    };

    useEffect(() => {
        paginateData();
    }, [data, activePage, isOrder]);

    useEffect(() => {
        getPages(createArray(pagesNumber));
    }, [pagesNumber, activePage]);

    const showPagination = useMemo(() => data.length > itemsPerPage, [data, itemsPerPage]);

    const text = getPaginationText({ activePage, data, finalPage, initialPage, isInferior, pagesNumber });

    const getPages = (totalPages: number[]): void => {
        const listPage = totalPages.filter(item => item >= activePage && item <= activePage + 2);
        setPages(totalPages.length < 4 ? totalPages : listPage);
    };

    return showPagination ? (
        <div className={`paginator paginator--${isInferior ? 'bottom' : ''}`}>
            {isInferior && <span className="text-primary">{text.result}</span>}
            <section className="flex items-center">
                <p className="mr-5 text-gray-dark">
                    Página <span>{text.pages}</span>
                </p>
                <section className="flex items-center">
                    {activePage > ONE && (
                        <RightArrow classArrow="arrow-active" onClick={(): void => updateActivePage(activePage - ONE)} />
                    )}
                    {pages.map(page => (
                        <span
                            key={page}
                            className={`paginator__page ${page === activePage ? 'paginator__page--active' : ''} `}
                            onClick={(): void => updateActivePage(page)}
                        >
                            {page}
                        </span>
                    ))}
                </section>
                {activePage < pagesNumber && <RightArrow onClick={(): void => updateActivePage(activePage + ONE)} />}
            </section>
        </div>
    ) : null;
};
