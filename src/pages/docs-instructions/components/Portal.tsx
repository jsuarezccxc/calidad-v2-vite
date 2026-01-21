import ReactDOM from 'react-dom';

const Portal: React.FC = ({ children }) => {
    const modalRoot = document.getElementById('instruction-content');
    if (!modalRoot) return null;
    return ReactDOM.createPortal(children, modalRoot);
};

export default Portal;
