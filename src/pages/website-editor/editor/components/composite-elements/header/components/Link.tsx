import React, { useEffect, useState } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { IHeaderLink, LETTER_LIMIT, LIMIT_LINKS } from '.';

export const Link: React.FC<IHeaderLink> = ({ links }) => {
    const [sliceLinks, setSliceLinks] = useState<IGenericRecord[]>(links);

    useEffect(() => {
        const fullTextLinks = links?.map(item => ({
            ...item,
            text: `${item?.text.split('').slice(0, LETTER_LIMIT).join('')}${item?.text?.length > LETTER_LIMIT ? '...' : ''}`,
            fullText: item?.text?.length > LETTER_LIMIT ? item?.text : '',
        }));
        if (fullTextLinks?.length > LIMIT_LINKS) {
            setSliceLinks(fullTextLinks?.slice(0, LIMIT_LINKS));
            return;
        }
        setSliceLinks(fullTextLinks);
    }, [links]);

    return (
        <>
            {sliceLinks?.map((link, index) => (
                <div className="flex flex-col relative w-full" key={index}>
                    <p className="header__link-item">{link?.text}</p>
                    {link?.fullText && <p className="header__link-tooltip-item">{link?.fullText}</p>}
                </div>
            ))}
        </>
    );
};
