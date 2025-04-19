
import React, { useEffect, useRef, useState } from 'react'
import Modal from '../../Modal/Modal';
import DynamicList from '../../DynamicList/DynamicList';

import { themeColors } from '../../../config';
import Header from '../../Header/Header';
import Autocomplete from '../../Autocomplete/Autocomplete';
import FloatingActionButton from '../../buttons/FloatingActionButton/FloatingActionButton';
import { Slot } from '../../DynamicList/DynamicListSlot.types';


// interface Slot {
//     type: string;
//     name: string;
//     label: string;
//     config?: Record<string, any>;
// }
interface MultiSelectModalProps {
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
    searchPath: string;
    searchLabelKey?: string;
    searchDescriptionKey?: string;
    searchImageKey?: string;
    fetchPath?: string; // Path para obtener datos iniciales
    submitPath?: string; // Path para enviar datos

    searchBarWidth?: number | string;
    listWidth?: number | string;
    readonly?: boolean;
}

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({
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
    searchPath,
    searchPlaceholder = "Buscar...",
    searchLabelKey,
    searchDescriptionKey,
    searchImageKey,
    fetchPath,
    //submitPath,
    apiBaseUrl,
    useAuthToken,
    searchBarWidth = 400,
    listWidth = 500,
    readonly
}) => {
    const [showDynamicList, setShowDynamicList] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [items, setItems] = useState(null as any);
    const itemsRef = useRef(null as any);
    const deleteItem = (idToDelete: number) => {
        const newItems = items.filter((item: any) => item.id !== idToDelete);
        setItems(newItems);
    };
    const handleSelect = (data: any) => {

        if (data) {
            // Search for a item in the array that matches the id of the item to add
            const existingItem = items.find((item: any) => item.id === data.id);
            // If the item doesn't exist, add it to the array
            if (!existingItem) {
                console.log('no existe')
                const newItems = [...items, data];
                setItems(newItems);
            } else {
                console.log('existe')
            }
        }
    };

    useEffect(() => {
        setShowDynamicList(!isOpen)
        if (isOpen) {
            console.log(data)
            setItems(data);
        } else {
            setItems([]);
        }
    }, [isOpen]);
    useEffect(() => {
        if (JSON.stringify(itemsRef.current) !== JSON.stringify(items)) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [items]);
    useEffect(() => {
        setItems(data)
        itemsRef.current = data;
    }, [data])
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdropStyle={backdropStyle}
            windowStyle={{
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
                    {!readonly ?
                        <Autocomplete
                            apiBaseUrl={apiBaseUrl}
                            path={searchPath}
                            useAuthToken
                            itemLabelKey={searchLabelKey}
                            itemDescriptionKey={searchDescriptionKey}
                            itemImageKey={searchImageKey}
                            placeholder={searchPlaceholder}
                            noResultsText="Sin resultado"
                            loadingText="Buscando..."
                            onSelect={handleSelect}
                            minSearchLength={2}
                            debounceTime={300}
                            containerStyle={{ maxWidth: searchBarWidth, margin: '0 auto 20px auto' }}
                            searchInputStyle={{

                            }}
                            popoverStyle={{

                            }}
                        /> : null}
                    {
                        (isOpen && showDynamicList) ?
                            <>

                                <DynamicList
                                    startSlots={startSlots}
                                    endSlots={[
                                        ...endSlots,
                                        {
                                            type: "action",
                                            name: "removeItem",
                                            label: "Quitar item",
                                            config: {
                                                icon: "close",
                                                mode: 'local',
                                                variant: 'icon',
                                                color: themeColors.danger,
                                                size: 'sm',
                                            }
                                        }]}
                                    apiBaseUrl={apiBaseUrl}
                                    listPath={fetchPath}
                                    useAuthToken={useAuthToken}
                                    noContentIcon={noContentIcon}
                                    noContentText={noContentText}
                                    itemStyle={{}}
                                    data={items}
                                    isItemClickable={false}
                                    onItemActionClick={(actionName: string, itemData: any) => {
                                        if (actionName == "removeItem") deleteItem(itemData.id);
                                    }}
                                    containerStyle={{
                                        width: "100%",
                                        maxWidth: listWidth
                                    }}

                                />
                            </>
                            : <></>
                    }
                </main>
                {
                    !readonly ?
                        <FloatingActionButton
                            disabled={isDisabled}
                            icon='check'
                            size='lg'
                            borderRadius={99}
                            onClick={() => {

                            }}
                        /> : null}
            </div >
        </Modal >
    );
};

export default MultiSelectModal;