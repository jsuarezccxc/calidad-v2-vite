import React, { useEffect, useState } from 'react';
import { Icon } from '@components/icon';
import { IGenericRecord } from '@models/GenericRecord';
import { FIRST_STEP, IPaginatorStepsProps } from '.';
import './PaginatorSteps.scss';

export const PaginatorSteps: React.FC<IPaginatorStepsProps> = ({
    data,
    currentPage = 1,
    setCurrentPage = (): void => {},
    wrapperClassName,
}) => {
    const [numberPages, setNumberPages] = useState<number>(0);

    useEffect(() => {
        handleNumberPages();
    }, [data]);

    const handleNumberPages = (): void => {
        data?.length && setNumberPages(data.length);
    };

    const handleBack = (): void => {
        if (currentPage > 1) {
            const backPage = currentPage - 1;
            return setCurrentPage(backPage);
        }
    };

    const handleNext = (): void => {
        if (currentPage < numberPages) {
            const nextPage = currentPage + 1;
            return setCurrentPage(nextPage);
        }
    };

    return (
        <div className={`paginator-steps ${wrapperClassName}`}>
            <div className="paginator-steps__button-left" onClick={(): void => handleBack()}>
                <Icon name={currentPage === FIRST_STEP ? 'arrowLeftGray' : 'arrowLeftGreen'} className="icon--styles" />
            </div>
            <div className="paginator-steps__page">
                <div className="number--page">{currentPage}</div>
                de
                <div className="number--page">{numberPages}</div>
            </div>
            <div className="paginator-steps__button-right" onClick={(): void => handleNext()}>
                <Icon name={currentPage === data?.length ? 'arrowRightGray' : 'arrowRightGreen'} className="icon--styles" />
            </div>
        </div>
    );
};

export const StaticPager: React.FC<{ data: IGenericRecord[] }> = ({ data }) => (
    <div className="flex-col lg:flex-row text-gray-dark mt-4.5 mb-5 flex items-center">
        En la parte inferior del recuadro encuentra la herramienta &nbsp;
        <PaginatorSteps data={data} />
        &nbsp; que le permite avanzar y retroceder en las instrucciones.
    </div>
);
