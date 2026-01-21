import { useState, useEffect } from 'react';

/**
 * This interface describe the basic table props
 *
 * @typeParam width: number - width size of the window
 * @typeParam height: number - height size of the window
 */
interface IWindowSize {
    width: number;
    height: number;
}

/**
 * Custom hook that returns the window size
 * @returns IWindowSize
 */
const useWindowSize = (): IWindowSize => {
    const [windowSize, setWindowSize] = useState<IWindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = ():void => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        return ():void => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); 

    return windowSize;
};

export default useWindowSize;
