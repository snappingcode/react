
import React, { useEffect } from 'react'
import Modal from '../../Modal/Modal';

interface ImportManyModalProps {
    isOpen: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconPaths?: any[];
    closeIconSize?: number;
    zIndex?: number;
    id?: string;
    fullScreen?: boolean;



}

const ImportManyModal: React.FC<ImportManyModalProps> = ({
    // Props de Modal
    isOpen,
    title,
    subtitle,
    onClose,
    backdropStyle,
    windowStyle,
    closeButtonStyle,
    closeIcon,
    closeIconPaths,
    closeIconSize,
    zIndex = 99999,
    id,
    fullScreen,


}) => {
    useEffect(() => {
        console.log(isOpen)
    }, [isOpen])
    return (
        <Modal

            isOpen={isOpen}
            onClose={onClose}
            backdropStyle={backdropStyle}
            windowStyle={{
                display: 'flex',
                justifyContent: 'center',
                ...windowStyle
            }}
            closeButtonStyle={closeButtonStyle}
            closeIcon={closeIcon}
            closeIconPaths={closeIconPaths}
            closeIconSize={closeIconSize}
            zIndex={zIndex}
            id={id}
            fullScreen={fullScreen}

        >
            <>ImportManyModal</>
        </Modal>
    );
};

export default ImportManyModal;