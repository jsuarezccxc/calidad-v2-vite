/**
 * This interface is to return hook
 *
 * @typeParam scrollToInput: () => void - Scroll to input error
 */
interface IScrollToError {
    scrollToInput: (className?: string) => void;
}

/**
 * This hook is scroll in page error
 *
 * @returns IScrollToError
 */
const useScrollToError = (): IScrollToError => {
    const scrollToInput = (className = '.input--required'): void => {
        setTimeout(() => {
            const body = document.querySelector('#bodyApp');
            const input = document.querySelector(className);
            if (body && input) {
                const { top } = input.getBoundingClientRect();
                body.scrollTo({
                    top: (top - 140) + body.scrollTop,
                    behavior: 'smooth',
                });
            }
        }, 100);
    };

    return {
        scrollToInput,
    };
};

export default useScrollToError;
