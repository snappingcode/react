
import React, { useEffect, useState } from 'react'
import Modal from '../../Modal/Modal';
import DynamicList from '../../DynamicList/DynamicList';
import Header from '../../Header/Header';
import { themeColors } from '../../../config';
import MultiSelectModal from '../MultiSelectModal/MultiSelectModal';
import RelatedRecordsModal from '../RelatedRecordsModal/RelatedRecordsModal';
import interpolateString from '../../../utils/interpolateString';
import FormModal from '../FormModal/FormModal';
import FloatingActionButton from '../../buttons/FloatingActionButton/FloatingActionButton';
import { Action as HeaderAction } from '../../Header/Header';
import ExportManyModal from '../ExportManyModal/ExportManyModal';
import ImportManyModal from '../ImportManyModal/ImportManyModal';
import ImportOneModal from '../ImportOneModal/ImportOneModal';
import { Slot as ItemSlot } from '../../DynamicList/DynamicListSlot.types';

// interface ItemSlot {
//     type: string;
//     name: string;
//     label: string;
//     config?: any;
// }
interface ListModalProps {
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
    title: string;
    subtitle?: string;
    fullScreen?: boolean;
    itemStyle?: React.CSSProperties;
    startSlots?: ItemSlot[];
    endSlots?: ItemSlot[];
    data?: any[] | null;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    listPath?: string;
    reorderPath?: string;
    displayMode?: 'row' | 'grid';
    noContentText?: string;
    noContentIcon?: string;
    forceRefresh?: boolean;
    isSortable?: boolean;
    isItemClickable?: boolean;
    canCreate?: boolean;
    createFormConfig?: {
        title?: string;
        fields: any[];
        useAuthToken?: boolean;
        submitPath?: string;
    };
    showSearchBar?: boolean;
    searchBarConfig?: any;
    headerActions?: HeaderAction[];
    moreHeaderActions?: HeaderAction[];
    renderItem?: (item: any, index: number) => React.ReactNode;
    onOrderChange?: (newOrder: any[]) => void;
    onItemActionClick?: (actionData: any, itemData: any) => void;
    onItemChangeSuccess?: (item: any, fieldName: string, newValue: boolean) => void;
    onItemChangeError?: (item: any, fieldName: string, error: any) => void;
    onItemClick?: (item: any, index: number) => void;
    onItemSlotClick?: (stot: any, item: any) => void;
}

const ListModal: React.FC<ListModalProps> = ({
    // Props de Modal
    isOpen,
    onClose,
    backdropStyle,
    windowStyle,
    closeButtonStyle,
    closeIcon,
    closeIconPaths,
    closeIconSize,
    zIndex,
    id,
    fullScreen = true,
    itemStyle,
    startSlots = [],
    endSlots = [],
    data = null,
    apiBaseUrl,
    useAuthToken = true,
    noContentText = 'No content available',
    noContentIcon = 'records',
    listPath,
    reorderPath,
    isSortable = false,
    isItemClickable = false,
    title,
    subtitle,
    canCreate = false,
    createFormConfig,
    showSearchBar,
    searchBarConfig,
    headerActions,
    moreHeaderActions,
    renderItem,
    onOrderChange,
    onItemActionClick,
    onItemChangeSuccess,
    onItemChangeError,
    onItemClick,
    onItemSlotClick
}) => {
    const [reloadTrigger, setReloadTrigger] = React.useState(0);

    const [multiSelectModal, setMultiSelectModal] = useState<{
        isOpen: boolean;
        title: string;
        noContentText?: string;
        noContentIcon?: string;
        data?: any;
        fullScreen?: boolean;
        searchPath: string;
        searchPlaceholder?: string;
        searchLabelKey: string;
        searchDescriptionKey?: string;
        searchImageKey?: string;
        startSlots?: any;
        endSlots?: any;
    }>({
        isOpen: false,
        title: "",
        noContentText: "",
        noContentIcon: "",
        data,
        fullScreen: true,
        searchPath: "",
        searchPlaceholder: "",
        searchLabelKey: "",
        searchDescriptionKey: "",
        searchImageKey: "",
        startSlots: [],
        endSlots: []
    });

    const [relatedRecordsModal, setRelatedRecordsModal] = useState<{
        isOpen: boolean;
        title: string;
        noContentText?: string;
        noContentIcon?: string;
        data?: any;
        fullScreen?: boolean;
        startSlots?: any;
        endSlots?: any;
    }>({
        isOpen: false,
        title: "",
        noContentText: "",
        noContentIcon: "",
        data,
        fullScreen: true,
        startSlots,
        endSlots
    });

    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        formTitle: string;
        noContentText?: string;
        noContentIcon?: string;
        data?: any;
        fullScreen?: boolean;
        fields?: any;
        mode?: "create" | "edit" | "globalEdit" | "readOnly" | "submit";
        useAuthToken?: boolean;
        submitPath?: string;
        fetchPath?: string;
    }>({
        isOpen: false,
        formTitle: "",
        noContentText: "",
        noContentIcon: "",
        data,
        fullScreen: true,
        fields: [],
        mode: "create",
        useAuthToken: true,
        submitPath: "",
        fetchPath: ""
    });

    const [exportManyModal, setExportManyModal] = useState<{
        isOpen: boolean;
        title: string;
        apiBaseUrl?: string;
        exportPath?: string;
        columns?: { label: string; value: string }[];
        format?: "excel" | "pdf" | "json";
    }>(() => ({
        isOpen: false,
        title: "",
        apiBaseUrl: "",
        exportPath: "",
        columns: [],
        format: "excel"
    }));

    const [importManyModal, setImportManyModal] = useState<{
        isOpen: boolean;
        title: string;
        apiBaseUrl?: string;
        importPath?: string;
        acceptFileTypes?: string[]; // ej: ["xlsx", "csv"]
        //sampleFileUrl?: string;     // para permitir descarga de ejemplo
    }>({
        isOpen: false,
        title: "",
        apiBaseUrl: "",
        importPath: "",
        acceptFileTypes: ["xlsx", "csv"],
        //sampleFileUrl: ""
    });

    const [importOneModal, setImportOneModal] = useState<{
        isOpen: boolean;
        title: string;
        apiBaseUrl?: string;
        importPath?: string;
        useAuthToken?: boolean;


    }>({
        isOpen: false,
        title: "",
        apiBaseUrl: "",
        importPath: "",
        useAuthToken: true
    });


    const [showDynamicList, setShowDynamicList] = useState(false);
    useEffect(() => {
        setShowDynamicList(!isOpen)
    }, [isOpen])
    useEffect(() => {
        console.log('isOpen', isOpen, 'showDynamicList', showDynamicList)
    }, [isOpen, showDynamicList])

    // const handleItemSlotClick = (slot: ItemSlot, item: any) => {
    //     if (onItemSlotClick) onItemSlotClick(slot, item);

    //     if (slot.config?.actionName === "openMultiSelectModal") {
    //         setMultiSelectModal((prev) => ({
    //             ...prev,
    //             isOpen: true,
    //             data: JSON.parse(interpolateString(item, slot.config.actionConfig.data)),
    //             title: slot.config.actionConfig.title,
    //             startSlots: slot.config.actionConfig.startSlots,
    //             endSlots: slot.config.actionConfig.endSlots,
    //             searchPath: slot.config.actionConfig.searchPath,
    //             fullScreen: slot.config.actionConfig.fullScreen,
    //             noContentText: slot.config.actionConfig.noContentText,
    //             noContentIcon: slot.config.actionConfig.noContentIcon,
    //             searchPlaceholder: slot.config.actionConfig.searchPlaceholder,
    //             searchLabelKey: slot.config.actionConfig.searchLabelKey,
    //             searchDescriptionKey: slot.config.actionConfig.searchDescriptionKey,
    //             searchImageKey: slot.config.actionConfig.searchImageKey,
    //             //...slot.config.actionConfig // Aplica configuración específica
    //         }));
    //     }

    //     if (slot.config?.actionName === "openRelatedRecordsModal") {
    //         setRelatedRecordsModal((prev) => ({
    //             ...prev,
    //             isOpen: true,
    //             //...slot.config.actionConfig
    //         }));
    //     }

    //     if (slot.config?.actionName === "edit") {
    //         setFormModal((prev) => ({
    //             ...prev,
    //             isOpen: true,
    //             mode: slot.config.actionConfig?.mode || 'edit', // edit or globalEdit
    //             fields: slot.config.actionConfig?.fields || [],
    //             fetchPath: slot.config.actionConfig?.fetchPath,
    //             savePath: slot.config.actionConfig?.savePath,
    //             apiBaseUrl: apiBaseUrl,
    //             useAuthToken: slot.config.actionConfig?.useAuthToken,
    //             formTitle: slot.config.actionConfig?.formTitle || "Edit Record",
    //             data: item
    //             //...slot.config.actionConfig
    //         }));
    //     }
    //     if (slot.config?.actionName === "export") {

    //         const interpolatedPath = interpolateString(item, slot.config.actionConfig.exportPath);
    //         console.log("export", interpolatedPath)
    //     }
    //     if (slot.config?.actionName === "delete") {
    //         console.log("delete")
    //     }
    // };

    // const handleItemSlotClick = (slot: ItemSlot, item: any) => {
    //     if (onItemSlotClick) onItemSlotClick(slot, item);

    //     const actionName = (slot.config as any)?.actionName;
    //     const actionConfig = (slot.config as any)?.actionConfig;

    //     if (actionName === "openMultiSelectModal") {
    //         setMultiSelectModal((prev) => ({
    //             ...prev,
    //             isOpen: true,
    //             data: JSON.parse(interpolateString(item, actionConfig.data)),
    //             title: actionConfig.title,
    //             startSlots: actionConfig.startSlots,
    //             endSlots: actionConfig.endSlots,
    //             searchPath: actionConfig.searchPath,
    //             fullScreen: actionConfig.fullScreen,
    //             noContentText: actionConfig.noContentText,
    //             noContentIcon: actionConfig.noContentIcon,
    //             searchPlaceholder: actionConfig.searchPlaceholder,
    //             searchLabelKey: actionConfig.searchLabelKey,
    //             searchDescriptionKey: actionConfig.searchDescriptionKey,
    //             searchImageKey: actionConfig.searchImageKey,
    //         }));
    //     }

    //     if (actionName === "openRelatedRecordsModal") {
    //         setRelatedRecordsModal((prev) => ({
    //             ...prev,
    //             isOpen: true,
    //         }));
    //     }

    //     if (actionName === "edit") {
    //         setFormModal((prev) => ({
    //             ...prev,
    //             isOpen: true,
    //             mode: actionConfig?.mode || 'edit',
    //             fields: actionConfig?.fields || [],
    //             fetchPath: actionConfig?.fetchPath,
    //             savePath: actionConfig?.savePath,
    //             apiBaseUrl: apiBaseUrl,
    //             useAuthToken: actionConfig?.useAuthToken,
    //             formTitle: actionConfig?.formTitle || "Edit Record",
    //             data: item
    //         }));
    //     }

    //     if (actionName === "export") {
    //         const interpolatedPath = interpolateString(item, actionConfig.exportPath);
    //         console.log("export", interpolatedPath);
    //     }

    //     if (actionName === "delete") {
    //         console.log("delete");
    //     }
    // };
    const handleItemSlotClick = (slot: ItemSlot, item: any) => {
        if (onItemSlotClick) onItemSlotClick(slot, item);

        const clickable = (slot.config as any)?.clickableAction;
        if (!clickable) return;

        const { name: actionName, config: actionConfig } = clickable;

        if (actionName === "openMultiSelectModal") {
            setMultiSelectModal((prev) => ({
                ...prev,
                isOpen: true,
                data: JSON.parse(interpolateString(item, actionConfig.data)),
                title: actionConfig.title,
                startSlots: actionConfig.startSlots,
                endSlots: actionConfig.endSlots,
                searchPath: actionConfig.searchPath,
                fullScreen: actionConfig.fullScreen,
                noContentText: actionConfig.noContentText,
                noContentIcon: actionConfig.noContentIcon,
                searchPlaceholder: actionConfig.searchPlaceholder,
                searchLabelKey: actionConfig.searchLabelKey,
                searchDescriptionKey: actionConfig.searchDescriptionKey,
                searchImageKey: actionConfig.searchImageKey,
            }));
        }

        if (actionName === "openRelatedRecordsModal") {
            setRelatedRecordsModal((prev) => ({
                ...prev,
                isOpen: true,
            }));
        }

        if (actionName === "edit") {
            setFormModal((prev) => ({
                ...prev,
                isOpen: true,
                mode: actionConfig?.mode || 'edit',
                fields: actionConfig?.fields || [],
                fetchPath: actionConfig?.fetchPath,
                savePath: actionConfig?.savePath,
                apiBaseUrl: apiBaseUrl,
                useAuthToken: actionConfig?.useAuthToken,
                formTitle: actionConfig?.formTitle || "Edit Record",
                data: item
            }));
        }

        if (actionName === "export") {
            const interpolatedPath = interpolateString(item, actionConfig.exportPath);
            console.log("export", interpolatedPath);
        }

        if (actionName === "delete") {
            console.log("delete");
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                backdropStyle={backdropStyle}
                windowStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: themeColors.light,
                    ...windowStyle
                }}
                closeButtonStyle={closeButtonStyle}
                closeIcon={closeIcon}
                fullScreen={fullScreen}
                showCloseButton={false}
                closeIconPaths={closeIconPaths}
                closeIconSize={closeIconSize}
                zIndex={zIndex}
                id={id}
                onAnimationComplete={() => {
                    console.log('Animation complete')
                    setShowDynamicList(true);
                }}
            >
                <div
                    style={{
                        width: '100%',
                        overflow: 'auto',
                        //position: 'absolute',
                    }}
                >
                    <Header
                        startSlots={[
                            {
                                type: "custom",
                                config: {
                                    content: `<div style="padding-left: 10px">
                                    <h2 class="modal-title" style="margin: 0; font-size: 20px">${title}</h2>
                                    ${subtitle ? `<span class="modal-subtitle" style="font-size: 14px;">${subtitle}</span>` : ""}
                                  </div>`,
                                    containerStyle: {
                                        padding: "5px",
                                    },
                                    className: "custom-slot"
                                },
                            }
                        ]}
                        centerSlots={[

                        ]}

                        endSlots={[
                            ...(headerActions?.length
                                ? ([{
                                    type: "actionsGroup",
                                    config: {
                                        items: headerActions,
                                        onItemSelect: (actionName: string) => {
                                            console.log(actionName)
                                            const action = headerActions.find(a => a.name === actionName);
                                            action?.config?.onClick(action?.type, action?.name);
                                            if (action?.type === 'exportMany') {
                                                setExportManyModal((prev) => ({
                                                    ...prev,
                                                    isOpen: true
                                                }));
                                            }
                                            if (action?.type === 'importMany') {
                                                setImportManyModal((prev) => ({
                                                    ...prev,
                                                    isOpen: true
                                                }));
                                            }
                                        }
                                    }
                                }]) as any : []),

                            ...(moreHeaderActions?.length
                                ? ([{
                                    type: "actionsMenuButton",
                                    config: {
                                        menuItems: moreHeaderActions,
                                        onItemSelect: (actionName: string) => {
                                            console.log(actionName)
                                            const action = moreHeaderActions.find(a => a.name === actionName);
                                            action?.config?.onClick(action?.type, action?.name);
                                            if (action?.type === 'exportMany') {
                                                setExportManyModal((prev) => ({
                                                    ...prev,
                                                    isOpen: true
                                                }));
                                            }
                                            if (action?.type === 'importMany') {
                                                setImportManyModal((prev) => ({
                                                    ...prev,
                                                    isOpen: true
                                                }));
                                            }
                                            if (action?.type === 'importOne') {
                                                setImportOneModal((prev) => ({
                                                    ...prev,
                                                    title: action.label,
                                                    useAuthToken: action?.config?.useAuthToken,
                                                    importPath: action?.config?.importPath,
                                                    isOpen: true
                                                }));
                                            }
                                        }
                                    }
                                }]) as any : []),

                            {
                                type: "iconButton",
                                config: {
                                    onClick: onClose,
                                    icon: "close",
                                    style: {},
                                    color: themeColors.text,
                                    size: 'md',
                                    iconSize: 20
                                },
                            },
                        ]}


                        containerStyle={{
                        }}
                        className="modal-header"
                        showSearchBar={showSearchBar}
                        searchBarConfig={searchBarConfig}
                    />
                    <main style={{
                        padding: "16px",
                        display: "flex",
                        justifyContent: "center",
                        paddingBottom: canCreate ? 70 : "auto",
                    }}>
                        {
                            (isOpen && showDynamicList) ?

                                <>
                                    <DynamicList
                                        startSlots={startSlots}
                                        endSlots={endSlots}
                                        apiBaseUrl={apiBaseUrl}
                                        listPath={listPath}
                                        noContentIcon={noContentIcon}
                                        noContentText={noContentText}
                                        useAuthToken={useAuthToken}
                                        itemStyle={itemStyle}
                                        data={data}
                                        onItemSlotClick={handleItemSlotClick}
                                        isSortable={isSortable}
                                        reorderPath={reorderPath}
                                        isItemClickable={isItemClickable}
                                        renderItem={renderItem}
                                        onOrderChange={onOrderChange}
                                        onItemActionClick={onItemActionClick}
                                        // onActionClick={(actionName: string, itemData: any) => {
                                        //     console.log(actionName, itemData)
                                        // }}
                                        onItemChangeSuccess={onItemChangeSuccess}
                                        onItemChangeError={onItemChangeError}
                                        onItemClick={onItemClick}
                                        reloadTrigger={reloadTrigger}

                                    />

                                </>

                                : <></>
                        }


                    </main>
                    {
                        canCreate ?
                            <FloatingActionButton
                                icon='add'
                                size='lg'
                                borderRadius={99}
                                zIndex={zIndex}
                                onClick={() => {
                                    setFormModal((prev) => ({
                                        ...prev,
                                        isOpen: true,
                                        formTitle: createFormConfig?.title || "New Record",
                                        fields: createFormConfig?.fields || [],
                                        submitPath: createFormConfig?.submitPath,
                                        useAuthToken: createFormConfig?.useAuthToken,
                                        apiBaseUrl: apiBaseUrl,
                                        mode: "create",
                                        data: {}
                                    }));
                                }}
                                style={{
                                    bottom: 20,
                                    right: 30,
                                }}
                            /> : null
                    }
                </div>
            </Modal>
            <MultiSelectModal
                id="multi-select-modal"
                title={multiSelectModal.title}
                isOpen={multiSelectModal.isOpen}
                onClose={() => {
                    setMultiSelectModal((prev) => ({
                        ...prev,
                        isOpen: false
                    }));
                }}
                data={multiSelectModal.data}
                fullScreen={multiSelectModal.fullScreen}
                searchPath={multiSelectModal.searchPath || ""}
                searchPlaceholder={multiSelectModal.searchPlaceholder}
                searchLabelKey={multiSelectModal.searchLabelKey}
                searchDescriptionKey={multiSelectModal.searchDescriptionKey}
                searchImageKey={multiSelectModal.searchImageKey}
                startSlots={multiSelectModal.startSlots}
                endSlots={multiSelectModal.endSlots}
                noContentText={multiSelectModal.noContentText}
                noContentIcon={multiSelectModal.noContentIcon}
            />
            <RelatedRecordsModal
                id="related-records-modal"
                title={relatedRecordsModal.title}
                isOpen={relatedRecordsModal.isOpen}
                onClose={() => {
                    setRelatedRecordsModal((prev) => ({
                        ...prev,
                        isOpen: false
                    }));
                }}
                data={relatedRecordsModal.data}
                fullScreen={relatedRecordsModal.fullScreen}
                startSlots={relatedRecordsModal.startSlots}
                endSlots={relatedRecordsModal.endSlots}
                noContentText={relatedRecordsModal.noContentText}
                noContentIcon={relatedRecordsModal.noContentIcon}
            />
            <FormModal
                id="form-modal"
                isOpen={formModal.isOpen}
                onClose={(reason) => {
                    if (reason == 'success') setReloadTrigger((prev) => prev + 1);

                    console.log('reason', reason);
                    setFormModal((prev) => ({
                        ...prev,
                        isOpen: false
                    }));
                }}
                data={formModal.data}
                fullScreen={formModal.fullScreen}
                fields={formModal.fields}
                mode={formModal.mode}
                apiBaseUrl={apiBaseUrl}
                useAuthToken={formModal.useAuthToken}
                submitPath={formModal.submitPath}
                formTitle={formModal.formTitle}
                onCreateSuccess={() => {

                }}
            />

            <ExportManyModal
                id="export-many-modal"
                title={exportManyModal.title}
                isOpen={exportManyModal.isOpen}
                onClose={() => {
                    setExportManyModal((prev) => ({
                        ...prev,
                        isOpen: false
                    }));
                }}

            />

            <ImportManyModal
                id="import-many-modal"
                title={importManyModal.title}
                isOpen={importManyModal.isOpen}
                onClose={() => {
                    setImportManyModal((prev) => ({
                        ...prev,
                        isOpen: false
                    }));
                }}

            />
            <ImportOneModal
                id="import-one-modal"
                title={importOneModal.title}
                isOpen={importOneModal.isOpen}
                apiBaseUrl={apiBaseUrl || ''}
                useAuthToken={importOneModal.useAuthToken}
                importPath={importOneModal.importPath || ''}
                onClose={() => {
                    setImportOneModal((prev) => ({
                        ...prev,
                        isOpen: false
                    }));
                }}

            />


        </>

    );
};

export default ListModal;
