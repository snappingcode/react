
import React, { useEffect } from 'react'
import Modal from '../../Modal/Modal';
// interface Slot {
//     type: string;
//     name: string;
//     label: string;
//     config?: Record<string, any>;
// }
interface TableModalProps {
    isOpen: boolean;
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

const TableModal: React.FC<TableModalProps> = ({
    // Props de Modal
    isOpen,
    onClose,
    backdropStyle,
    windowStyle,
    closeButtonStyle,
    closeIcon,
    // closeIconPaths,
    // closeIconSize,
    // zIndex = 99999,
    // id,
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
            // closeIconPaths={closeIconPaths}
            // closeIconSize={closeIconSize}
            // zIndex={zIndex}
            // id={id}
            fullScreen={fullScreen}

        >
            <>Tabla</>
        </Modal>
    );
};

export default TableModal;