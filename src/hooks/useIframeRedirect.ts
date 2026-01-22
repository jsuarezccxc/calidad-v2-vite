import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { BACK, REDIRECT } from '@constants/Crm';

/**
 * Custom hook that listens for messages sent from an iframe (child app)
 * and handles redirection in the parent app using react-router-dom
 */
const useIframeRedirect = (): void => {
    const history = useHistory();

    useEffect(() => {
        const handler = (event: MessageEvent): void => {
            const allowedOrigin = new URL(process.env.REACT_APP_CRM_URL || '').origin;
            if (event.origin !== allowedOrigin) return;
            
            if (event.data?.type === REDIRECT) {
                const path = event.data.path;
                if (path !== BACK) {
                    history.push(path);
                } else {
                    history.goBack();
                }
            }
        };

        window.addEventListener('message', handler);
        return (): void => window.removeEventListener('message', handler);
    }, [history]);
};

export default useIframeRedirect;
