import React from 'react';
import { Switch } from '@components/switch';
import { ChangeEvent } from '@components/radiobutton';

export const ToggleSwitch: React.FC<{ checked: boolean; handleChange: (e: ChangeEvent) => void }> = ({
    checked,
    handleChange,
}) => (
    <div className="toggle-switch">
        <p>Pago semestral</p>
        <Switch checked={checked} handleChange={handleChange} includeOptions={false} />
        <p>Pago anual</p>
    </div>
);
