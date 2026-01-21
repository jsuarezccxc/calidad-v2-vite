import React, { useEffect, useRef, useState } from 'react';
import { ILazyIconProps } from '.';
import './LazyIcon.scss';

export const LazyIcon: React.FC<ILazyIconProps> = ({ content }) => {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && spanRef.current) {
                        // Show content when visible in window
                        setIsVisible(true);
                        spanRef.current.textContent = content;
                        observer.unobserve(spanRef.current);
                    }
                });
            },
            { threshold: 0.5 } // visibility threshold
        );

        if (spanRef.current) {
            observer.observe(spanRef.current);
        }

        return (): void => {
            if (observer && observer.unobserve && spanRef.current) {
                observer.unobserve(spanRef.current);
            }
        };
    }, [content]);

    return (
        <span ref={spanRef} className={`material-symbols-outlined mb-2 cursor-pointer lazy-icon ${isVisible ? 'active' : ''}`} />
    );
};
