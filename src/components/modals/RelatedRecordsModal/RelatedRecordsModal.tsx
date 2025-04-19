
import React, { useEffect, useState } from 'react';
import Modal from '../../Modal/Modal';
import DynamicList from '../../DynamicList/DynamicList';
import { themeColors } from '../../../config';
import Header from '../../Header/Header';
import { Slot } from '../../DynamicList/DynamicListSlot.types';


interface RelatedRecordsModalProps {
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
    title: string;
    subtitle?: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    data?: any[] | null;
    noContentText?: string;
    noContentIcon?: string;
    startSlots?: Slot[];
    endSlots?: Slot[];
    searchPlaceholder?: string;
    fetchPath?: string; // Path para obtener datos iniciales
    submitPath?: string; // Path para enviar datos
}

const RelatedRecordsModal: React.FC<RelatedRecordsModalProps> = ({
    // Props de Modal
    title,
    //subtitle,
    data,
    isOpen,
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
    startSlots = [],
    endSlots = [],
    noContentText = 'No content available',
    noContentIcon = 'records',
    fetchPath,
    //submitPath,
    apiBaseUrl,
    useAuthToken,

}) => {
    const [showDynamicList, setShowDynamicList] = useState(false);
    const [items, setItems] = useState(null as any);
    useEffect(() => {
        setShowDynamicList(!isOpen)
        if (isOpen) {
            setItems(data);
        } else {
            setItems([]);
        }
    }, [isOpen]);
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdropStyle={backdropStyle}
            windowStyle={{
                // display: 'flex',
                // justifyContent: 'center',
                backgroundColor: themeColors.light,
                ...windowStyle
            }}
            closeButtonStyle={closeButtonStyle}
            closeIcon={closeIcon}
            closeIconPaths={closeIconPaths}
            closeIconSize={closeIconSize}
            zIndex={zIndex}
            id={id}
            fullScreen={fullScreen}
            showCloseButton={false}
            onAnimationComplete={() => {
                console.log('Animation complete')
                setShowDynamicList(true);
            }}
        >
            <div
                style={{
                    width: '100%',
                }}
            >
                <Header
                    startSlots={[
                        {
                            type: "title",
                            config: {
                                text: title,
                                style: {

                                    paddingLeft: 10
                                },
                            },
                        },
                    ]}
                    centerSlots={[

                    ]}
                    endSlots={[
                        {
                            type: "iconButton",
                            config: {
                                onClick: onClose,
                                icon: "close",
                                style: {},
                                color: themeColors.text,
                                size: 'md'
                            },
                        },
                    ]}
                    containerStyle={{
                    }}
                    className="app-header"
                />
                <main style={{
                    padding: "0 10px",

                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    {
                        (isOpen && showDynamicList) ?
                            <>
                                <DynamicList
                                    startSlots={startSlots}
                                    endSlots={endSlots}
                                    apiBaseUrl={apiBaseUrl}
                                    listPath={fetchPath}
                                    useAuthToken={useAuthToken}
                                    noContentIcon={noContentIcon}
                                    noContentText={noContentText}
                                    itemStyle={{}}
                                    data={items}
                                    isItemClickable={true}
                                    onItemClick={() => {

                                    }}
                                    containerStyle={{
                                        width: "100%",
                                        maxWidth: 500
                                    }}

                                />
                            </>
                            : <></>
                    }
                </main>
            </div >
        </Modal >
    );
};

export default RelatedRecordsModal;