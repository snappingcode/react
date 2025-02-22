import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
}

const Portal: React.FC<PortalProps> = ({ children }) => {
    const el = document.createElement('div'); // Creamos un nodo div para el portal

    useEffect(() => {
        document.body.appendChild(el); // Agrega el nodo al body al montar el componente
        return () => {
            document.body.removeChild(el); // Limpia el DOM al desmontar el componente
        };
    }, [el]);

    return ReactDOM.createPortal(children, el);
};

export default Portal;
