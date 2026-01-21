import React from 'react';
import { Slider } from '@components/slider';
import { KEEP_OPEN } from '@hooks/useToggleRendering';
import useToggleRendering from '@hooks/useToggleRendering';
import { Icon } from '.';

export const Opacity: React.FC<{ handleChange: (value: number | number[]) => void; value: number; id: string }> = ({
    id,
    handleChange,
    value = 100,
}) => {
    const { parentRef, renderElement } = useToggleRendering();
    return (
        <div id={id} className={`relative ${KEEP_OPEN}`} ref={parentRef}>
            <Icon id={`${id}-ico`} name="opacity" className="icon-opacity" />
            {renderElement && (
                <div className={`basic-editor__opacity basic-editor__custom-list ${KEEP_OPEN}`}>
                    <Slider className="basic-editor__slider" handleChange={handleChange} value={value} />
                </div>
            )}
        </div>
    );
};
