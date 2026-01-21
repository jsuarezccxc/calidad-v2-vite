import React, { useState, useEffect } from 'react';
import StarBlue from '@assets/images/star-blue.svg';
import StarGray from '@assets/images/star-gray.svg';
import { IRatingProps, getQualification, initialState, RATING_ACTION } from '.';
import './Rating.scss';

export const Rating: React.FC<IRatingProps> = ({
    qualification = 1,
    rating = {},
    setRating = (): void => {},
    name = '',
    reload = false,
}) => {
    const [stars, setStars] = useState<boolean[]>([]);
    const [current, setCurrent] = useState<number>(6);
    const [last, setLast] = useState<number>(qualification - 1);
    const [action, setAction] = useState<string>('');

    useEffect(() => getQualification(qualification - 1, initialState, setStars), [reload]);

    useEffect(() => setRating({ ...rating, [name]: stars.filter(star => star)?.length }), [stars]);

    const changeQualification = (qualification: number): void => {
        setAction(RATING_ACTION.RESET);
        setCurrent(qualification);
        getQualification(qualification, stars, setStars);
    };

    const resetQualify = (): void => {
        if (action === RATING_ACTION.RESET) {
            setCurrent(6);
            getQualification(last, initialState, setStars);
        }
    };

    const setQualify = (): void => {
        setAction(RATING_ACTION.SET);
        setLast(current);
        setCurrent(6);
    };

    return (
        <div className="rating">
            {stars?.map((item: boolean, index: number) => (
                <img
                    key={`img-${index}`}
                    src={item ? StarBlue : StarGray}
                    alt="star icon"
                    className={`rating__star-icon ${current === index ? 'big-star' : ''}`}
                    onMouseOver={(): void => changeQualification(index)}
                    onMouseLeave={resetQualify}
                    onClick={setQualify}
                />
            ))}
        </div>
    );
};
