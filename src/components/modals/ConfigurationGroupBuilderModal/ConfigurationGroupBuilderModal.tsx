import React, { useEffect, useState } from 'react'
import Modal from '../../Modal/Modal';
import { themeColors } from '../../../config';
import Header from '../../Header/Header';

import Drawer from '../../Drawer/Drawer';
import ItemSelector from './ItemSelector';
import DynamicList from '../../DynamicList/DynamicList';
import ItemEditorDrawer from './ItemEditorDrawer';
import FloatingActionButton from '../../buttons/FloatingActionButton/FloatingActionButton';
import useIsMobile from '../../../hooks/useIsMobile';
import IconButton from '../../buttons/IconButton/IconButton';

interface ConfigurationGroupBuilderModalProps {
    isOpen: boolean;
    onClose: (newData?: any) => void;
    title: string;
    subtitle?: string;
    data?: any[] | null;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconPaths?: any[];
    closeIconSize?: number;
    zIndex?: number;
    id?: string;
    fullScreen?: boolean;
    configurationGroup: 'fields' | 'slots' | 'filters' | 'headerActions' | 'listActions' | 'dividerGroups' | 'importCols' | 'exportCols';
    apiBaseUrl?: string;
}

const ConfigurationGroupBuilderModal: React.FC<ConfigurationGroupBuilderModalProps> = ({
    // Props de Modal
    isOpen,
    onClose,
    title,
    subtitle,
    backdropStyle,
    windowStyle,
    zIndex = 99999,
    data = [],
    id,
    fullScreen,
    configurationGroup,
    apiBaseUrl
}) => {
    const [itemSelectorDrawerIsOpen, setItemSelectorDrawerIsOpen] = useState(false);
    const [itemEditorDrawerIsOpen, setItemEditorDrawerIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = React.useState(data as any);
    const [currentItem, setCurrentItem] = React.useState({} as any);
    const [currentItemIndex, setCurrentItemIndex] = React.useState(null as any);

    const breakpoint = 996;
    const { isMobile } = useIsMobile(breakpoint);

    const handleSelectItem = (item: any) => {
        let newItem = item?.configurable_attributes || {};
        newItem.icon = item.icon;
        setSelectedItems((prevItems: any) => [...prevItems, newItem]);
    };

    const handleRemoveItem = (index: number) => {
        setSelectedItems((prevItems: any) => prevItems.filter((_: any, idx: number) => idx !== index));

    };

    useEffect(() => {
        console.log('selectedItems', selectedItems);
    }, [selectedItems]);

    useEffect(() => {
        // if (JSON.stringify(data) !== JSON.stringify(selectedItems)) {
        //     setSelectedItems(data);
        // }
        // si descomento esto da error (bucle)
        //setSelectedItems(data);
    }, [data])
    useEffect(() => {

        //setSelectedItems(data);
        //if (data && isOpen) setSelectedItems(data);
        if (isOpen && data) setSelectedItems(data);
    }, [isOpen])

    return (
        <>
            <Modal
                id={id}
                isOpen={isOpen}
                onClose={onClose}
                backdropStyle={backdropStyle}
                windowStyle={{
                    backgroundColor: themeColors.light,
                    display: 'flex',
                    justifyContent: 'center',
                    //backgroundColor: themeColors.light,
                    ...windowStyle
                }}
                showCloseButton={false}
                zIndex={zIndex}
                fullScreen={fullScreen}
            >
                <div
                    style={{
                        width: '100%',
                        overflow: 'auto',
                        //height: '100vh',
                        //overflow: 'auto',
                    }}
                >
                    {
                        isMobile ?
                            <IconButton
                                style={{
                                    position: 'fixed',
                                    top: 5,
                                    left: 5,
                                    zIndex: 1
                                }}
                                type='clear'
                                hasShadow={false}
                                color={themeColors.text}
                                icon='menu' onClick={() => {
                                    setItemSelectorDrawerIsOpen(true);
                                }}
                            /> : <></>
                    }
                    <Header
                        startSlots={[
                            {
                                type: "custom",
                                config: {
                                    content: `<div style="padding-left: ${isMobile ? '50px' : 0}">
                                            <h2 class="modal-title">${title}</h2>
                                            <span class="modal-subtitle">${subtitle}</span>
                                        </div>`,
                                    containerStyle: {
                                        padding: "5px",
                                    },
                                    className: "custom-slot"
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
                            // position: 'fixed',
                            // top: '0px',
                            // left: '0px',
                            // width: '100%',
                            //background: "red",
                            // padding: 0
                        }}
                        className="app-header"
                    />
                    <main style={{
                        // display: "flex",
                        // alignItems: "center",
                        // height: '100vh',
                        // overflow: 'auto',
                        //padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                        paddingBottom: 70,
                    }}>
                        {
                            !isMobile ? <div className='item-selector-wrapper' style={{
                                width: 350,
                                height: '100vh',
                                backgroundColor: themeColors.light,
                                paddingTop: 60,
                            }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    overflowY: 'auto'
                                }}>
                                    <ItemSelector
                                        containerStyle={{
                                            paddingTop: 10,
                                        }}
                                        onItemSelect={handleSelectItem}
                                        configurationGroup={configurationGroup}
                                        apiBaseUrl={apiBaseUrl}
                                    />
                                </div>
                            </div> :
                                <></>
                        }
                        <div className='selected-items-wrapper' style={{
                            width: isMobile ? '100%' : 'calc(100% - 350px)',
                            //height: '100vh',
                            backgroundColor: themeColors.light,
                        }}>
                            <div
                                style={{
                                    //padding: "50px 10px 10px 10px",
                                    padding: "10px 10px 10px 10px",
                                    //height: '100vh',
                                    //paddingBottom: 100
                                }}
                            >
                                <DynamicList
                                    data={selectedItems}
                                    startSlots={[
                                        {
                                            type: "icon",
                                            name: "icon",
                                            label: "Icono",
                                            config: {
                                                color: themeColors.primary,
                                                size: 40
                                            }
                                        },
                                        {
                                            type: "template",
                                            name: "content",
                                            label: "Contenido",
                                            config: {
                                                template: `<div class='m-10'>
                                                    <span class='fw-300 fs-13'>{{label}}</span>
                                                    <strong class='d-block fs-13'>{{name}}</strong>
                                                </div>`
                                            }
                                        },
                                    ]}
                                    endSlots={[
                                        {
                                            type: "action",
                                            name: "editConfig",
                                            label: "Editar config.",
                                            config: {
                                                icon: "pencil",
                                                variant: 'icon',
                                                mode: 'local',
                                                onClick: (_slot: any, itemData: any, itemIndex: number) => {
                                                    setCurrentItem(itemData);
                                                    setItemEditorDrawerIsOpen(true);
                                                    setCurrentItemIndex(itemIndex);
                                                }
                                            }
                                        },
                                        {
                                            type: "action",
                                            name: "deleteItiem",
                                            label: "Eliminar item",
                                            config: {
                                                icon: "delete",
                                                color: themeColors.danger,
                                                variant: 'icon',
                                                mode: 'local',
                                                onClick: (_slot: any, _itemData: any, itemIndex: number) => {
                                                    handleRemoveItem(itemIndex);
                                                }
                                            }
                                        }
                                    ]}
                                    isSortable
                                    onOrderChange={(sortedItems) => {
                                        setSelectedItems(sortedItems);
                                    }}
                                    noContentText='Sin items'
                                />
                            </div>

                        </div>
                    </main>
                    {
                        isOpen ? <FloatingActionButton
                            disabled={selectedItems.length === 0}
                            icon='check'
                            size='lg'
                            borderRadius={99}
                            onClick={() => {
                                onClose(selectedItems);
                            }}
                            style={{

                            }}
                        /> : <></>
                    }
                </div>
            </Modal>
            <Drawer
                isOpen={itemSelectorDrawerIsOpen}
                onClose={() => {
                    setItemSelectorDrawerIsOpen(false);
                }}
                width={350}
                anchor='left'
                drawerStyle={{
                    backgroundColor: themeColors.light
                }}
                zIndex={99999}
            >
                <IconButton
                    style={{
                        position: 'fixed',
                        top: 5,
                        right: 10,
                        zIndex: 1,
                        backgroundColor: themeColors.light
                    }}
                    icon='close' onClick={() => {
                        setItemSelectorDrawerIsOpen(false);
                    }}
                    type='clear'
                    hasShadow={false}
                    color={themeColors.text}
                />
                <div
                    style={{
                        overflowY: 'auto',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    {
                        isOpen ? <ItemSelector
                            containerStyle={{
                                paddingTop: 50,
                            }}
                            onItemSelect={handleSelectItem}
                            configurationGroup={configurationGroup}
                            apiBaseUrl={apiBaseUrl}
                        /> : <></>
                    }
                </div>
            </Drawer>
            <ItemEditorDrawer
                data={currentItem}
                isOpen={itemEditorDrawerIsOpen}
                onClose={(newData) => {
                    if (newData && currentItemIndex !== null) {
                        setSelectedItems((prevItems: any[]) => {
                            const updatedItems = [...prevItems];
                            updatedItems[currentItemIndex] = newData;
                            return updatedItems;
                        });
                    }
                    setItemEditorDrawerIsOpen(false);
                }}
            />
        </>
    );
};

export default ConfigurationGroupBuilderModal;