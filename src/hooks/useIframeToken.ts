import { RefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';

/**
 * This interface describes the object return by this hook
 * @Param IUseIframeTokenReturn: RefObject<HTMLIFrameElement> - Ref of the iframe
 */
export interface IUseIframeTokenReturn {
    iframeRef: RefObject<HTMLIFrameElement>;
}

/**
 * Custom hook that returns the props of the modals
 *
 * @typeParam url:string - The URL of the iframe.
 * @returns IUseIframeTokenReturn
 */
const useIframeToken = (url: string): IUseIframeTokenReturn => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const getToken = localStorage.getItem('USER_TOKEN');

    const {
        session: { user },
    } = useSelector(({ session }: RootState) => ({
        session,
    }));

    useEffect(() => {
        if (!url) return;

        const handleLoad = (): void => {
            const token = getToken;
            if (iframeRef.current?.contentWindow && token) {
                iframeRef.current.contentWindow.postMessage(
                    {
                        type: 'AUTH_TOKEN',
                        token,
                        userId: user?.id ?? '',
                        companyId: user?.company_id ?? '',
                        userName: user?.name ?? '',
                    },
                    url
                );
            }
        };

        const iframeEl = iframeRef.current;
        iframeEl?.addEventListener('load', handleLoad);
        return (): void => {
            iframeEl?.removeEventListener('load', handleLoad);
        };
    }, [url, getToken]);

    return { iframeRef };
};

export default useIframeToken;
