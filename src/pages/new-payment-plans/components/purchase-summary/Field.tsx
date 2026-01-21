import React from 'react';

export const Field: React.FC<{ label: string; value: string; small?: boolean; fullSize?: boolean }> = ({
    label,
    small = false,
    fullSize = false,
    value,
}) => (
    <div className={`purchase-summary__field purchase-summary__field--${fullSize ? 'auto' : small ? 'small' : 'long'}`}>
        <h2 className="text-base text-blue font-allerbold">{label}</h2>
        <p className="mt-2 truncate text-tiny text-gray" title={value}>
            {value}
        </p>
        <hr />
    </div>
);
