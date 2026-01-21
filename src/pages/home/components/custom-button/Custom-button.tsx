import { IGenericRecord } from '@models/GenericRecord';
import React from 'react';

const CustomButton: React.FC<IGenericRecord> = ({ classesDiv, classesText, href, text, haveMembership }) => {
    return (
        <>
            <a className={classesDiv} href={haveMembership ? '#' : href} target="_blank" rel="noreferrer">
                <span className={classesText}>{text}</span>
            </a>
        </>
    );
};

export default CustomButton;
