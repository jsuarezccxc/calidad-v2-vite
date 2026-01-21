import React, { useEffect, useState } from 'react';
import { IGenericRecord } from '@models/GenericRecord';
import { Icon } from '@components/icon';

const CollapseJsx: React.FC<IGenericRecord> = ({ data = <></>, startsOpen = false, title = '', wrapperClass = '' }) => {
    const [showCollapse, setShowCollapse] = useState(startsOpen);

    useEffect(() => {
        setShowCollapse(startsOpen);
    }, [startsOpen]);

    return (
        <>
            <div
                className={`mb-5 flex items-center justify-between h-9.75 rounded-lg lg:w-153 bg-gray-light  pl-2.5 cursor-pointer ${wrapperClass}`}
                onClick={(): void => setShowCollapse(!showCollapse)}
            >
                <p className="font-allerbold text-green">{title}</p>
                <Icon className="w-3 h-2 mr-4.5" name={showCollapse ? 'arrowUpGreen' : 'trueArrowDownGreen'} />
            </div>
            <div className={`flex flex-col ${!showCollapse && 'hidden'}`}>{data}</div>
        </>
    );
};

export default CollapseJsx;
