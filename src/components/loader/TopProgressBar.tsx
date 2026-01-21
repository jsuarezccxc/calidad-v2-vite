import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { hideLoader } from '@redux/loader/actions';
import {
    COMPLETE_HIDE_DELAY_MS,
    FORCE_HIDE_TIMEOUT_MS,
    INCREMENT_STEP,
    INTERVAL_DELAY_MS,
    MAX_PROGRESS_BEFORE_COMPLETION,
} from '.';
import './TopProgressBar.scss';

export const TopProgressBar: React.FC = () => {
    const { loader } = useSelector((state: RootState) => state.loader);
    const dispatch = useDispatch();

    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        let timeoutForceHide: NodeJS.Timeout | null = null;

        if (loader) {
            setVisible(true);
            setProgress(0);

            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= MAX_PROGRESS_BEFORE_COMPLETION) return prev;
                    const next = prev + INCREMENT_STEP;
                    return next > MAX_PROGRESS_BEFORE_COMPLETION ? MAX_PROGRESS_BEFORE_COMPLETION : next;
                });
            }, INTERVAL_DELAY_MS);

            timeoutForceHide = setTimeout(() => {
                dispatch(hideLoader());
                setVisible(false);
                setProgress(0);
            }, FORCE_HIDE_TIMEOUT_MS);
        } else {
            if (interval) clearInterval(interval);
            if (timeoutForceHide) clearTimeout(timeoutForceHide);

            setProgress(100);
            const timeout = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, COMPLETE_HIDE_DELAY_MS);

            return (): void => clearTimeout(timeout);
        }

        return (): void => {
            if (interval) clearInterval(interval);
            if (timeoutForceHide) clearTimeout(timeoutForceHide);
            dispatch(hideLoader());
        };
    }, [loader]);

    return visible ? (
        <div className="progress">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
    ) : null;
};
