import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { HttpMethod } from '@models/Request';
import { Icon } from '@components/icon';
import { PageNumber } from '@components/paginator/Paginator';
import { IGenericRecord } from '@models/GenericRecord';
import { LANGUAGE_KEY } from '@constants/Translate';
import { ZERO } from '@constants/UtilsConstants';
import { ONE } from '@constants/Numbers';
import { getPaginationUrl } from '@redux/utils/actions';
import { ILinksInterface, IPaginatorBackend } from '.';
import './PaginatorBackend.scss';

export const PaginatorBackend: React.FC<IPaginatorBackend<IGenericRecord>> = request => {
    const dispatch = useDispatch();
    const [translate] = useTranslation(LANGUAGE_KEY);
    const { meta, links, wrapperClassName, setData, method = HttpMethod.POST, params = {} } = request;
    const [currentPage, setCurrentPage] = useState(0);
    const [numberPages, setNumberPages] = useState<number[]>([]);
    const [groupPages, setGroupPages] = useState<IGenericRecord>({ start: 0, finish: 0 });
    const [linksFormatted, setLinksFormatted] = useState<ILinksInterface>(links);

    useEffect(() => {
        getPaginator();
        validateGroupPages();
    }, [request, currentPage]);

    const searchGetLinks = (): ILinksInterface => {
        if (method === HttpMethod.GET && params?.search) {
            let newLinks = { ...links };
            Object?.keys(links)?.forEach((key: string) => {
                if (links[key as keyof typeof links]) {
                    newLinks = { ...newLinks, [key]: `${links[key as keyof typeof links]}&search=${params?.search}` };
                }
            });
            return newLinks;
        }
        return links;
    };

    const requestData = (
        url: string
    ): { url: string; setData: Dispatch<SetStateAction<IGenericRecord>>; type?: HttpMethod; dataPost?: IGenericRecord } => ({
        url: url,
        setData: setData as Dispatch<SetStateAction<IGenericRecord>>,
        type: method,
        dataPost: ((item: IGenericRecord): IGenericRecord => {
            delete item?.page;
            return item;
        })({ ...params }),
    });

    useEffect(() => {
        if (meta?.current_page) setCurrentPage(Number(meta?.current_page) - ONE);
        setLinksFormatted(searchGetLinks());
    }, [request]);

    const handleBack = (): void => {
        if (linksFormatted.prev) {
            dispatch(getPaginationUrl(requestData(linksFormatted?.prev)));
        } else if (setData && currentPage > 0) {
            setData(currentPage - 1);
        }
    };

    const handleNext = (): void => {
        if (linksFormatted.next) {
            dispatch(getPaginationUrl(requestData(linksFormatted?.next)));
        } else if (setData && currentPage < (meta?.last_page || 1) - 1) {
            setData(currentPage + 1);
        }
    };

    const getPaginator = (): void => {
        const numberPages = [];
        for (let i = 0; i < meta?.last_page; i++) {
            numberPages.push(i);
        }
        setNumberPages(numberPages);
    };
    const finishCurrentPage = (): number => {
        const optionsPage = [1, 2, 3];
        const results = optionsPage?.filter((item: number) => currentPage + item <= numberPages?.length);
        return results?.length + currentPage;
    };

    const validateGroupPages = (): void => {
        const start = currentPage || ZERO;
        const finish = finishCurrentPage();
        setGroupPages({ start, finish });
    };

    const disabledClass = (page: number): string => (currentPage === page ? 'bg-transparent opacity-60' : '');

    const handleClickNumber = (page: number): void => {
        if (linksFormatted.first) {
            const [url] = linksFormatted.first.split('?page') || [''];
            const searchParam = params?.search ? `&search=${params.search}` : '';
            dispatch(getPaginationUrl(requestData(`${url}?page=${Number(page + ONE)}${searchParam}`)));
        } else if (setData) {
            setData(page);
        }
    };
    return (
        <div className={`flex items-center justify-end xs:pt-0 border-gray-dark ${wrapperClassName} margin-paginator`}>
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
                    name="arrowLeftDGray"
                    className={`bg-transparent w-5.5 h-5.5 cursor-pointer ${disabledClass(meta?.last_page)}`}
                    onClick={handleBack}
                />
            )}
            {numberPages.slice(groupPages?.start, groupPages?.finish).map((page: number) => (
                <PageNumber key={page} number={page} current={currentPage} onClick={(): void => handleClickNumber(page)} />
            ))}
            {currentPage + 1 === numberPages.length && <div className="h-5.5 w-5.5" />}
            {currentPage + 1 !== numberPages.length && (
                <Icon
                    name="arrowRightDGray"
                    className={`bg-transparent w-5.5 h-5.5 cursor-pointer ${disabledClass(meta?.last_page)}`}
                    onClick={handleNext}
                />
            )}
        </div>
    );
};
