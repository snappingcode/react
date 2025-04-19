
import React, { useEffect } from 'react'
import Modal from '../../Modal/Modal';
import { themeColors } from '../../../config';
import Header from '../../Header/Header';
import TreeBuilder from '../../TreeBuilder/TreeBuilder';
import isEqual from '../../../utils/isEqual';
import FloatingActionButton from '../../buttons/FloatingActionButton/FloatingActionButton';
import { HttpClient, httpClient, securedHttpClient } from '../../../httpClient';
import Toast from '../../Toast/Toast';


interface TreeItem {
    id: string | number;
    label: string;
    children?: TreeItem[];
    [key: string]: any;
}
interface TreeBuilderModalProps {
    isOpen: boolean;
    onClose: (icon?: any) => void;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconPaths?: any[];
    closeIconSize?: number;
    zIndex?: number;
    id?: string;
    fullScreen?: boolean;
    title?: string;
    subtitle?: string;
    data?: TreeItem[];
    labelKey?: string;
    itemFields?: any[];
    itemLabelTemplate?: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    payloadKey?: string;
    fetchPath?: string;
    savePath?: string;
    saveMethod?: 'POST' | 'PUT' | 'PATCH';
    fetchDataKey?: string;
    saveDataKey?: string;

    createFormTitle?: string;
    editFormTitle?: string;

}

const TreeBuilderModal: React.FC<TreeBuilderModalProps> = ({
    // Props de Modal
    title = "Armador de arbol",
    //subtitle,
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
    data,
    labelKey,
    itemFields = [],
    itemLabelTemplate,
    apiBaseUrl,
    useAuthToken,
    fetchPath,
    savePath,
    saveMethod = 'POST',
    fetchDataKey,
    saveDataKey,
    //createFormTitle = "Crear item",
    editFormTitle = "Editar item"
}) => {
    const [updatedTree, setUpdatedTree] = React.useState<TreeItem[] | undefined>(data);
    const [tree, setTree] = React.useState<TreeItem[] | undefined>(data);
    const [loading, setLoading] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const isModified = !isEqual(tree, updatedTree);
    const [toastState, setToastState] = React.useState({
        isOpen: false, // Controls visibility
        title: '', // Title of the Toast
        message: '', // Message of the Toast
        color: themeColors.success // Color of the Toast
    });
    // Handle Toast close event
    const handleCloseToast = () => {
        setToastState({ ...toastState, isOpen: false });
    };
    React.useEffect(() => {
        const fetchData = async () => {
            if (!fetchPath) return;

            setLoading(true);

            try {
                const client = useAuthToken ? securedHttpClient : httpClient;
                if (apiBaseUrl) client.setBaseURL(apiBaseUrl);

                // const response = await client.get(fetchPath);
                // setTree(response.data);
                const response = await client.get(fetchPath);
                const fetched = fetchDataKey ? response.data[fetchDataKey] : response.data;
                setTree(fetched);
                setUpdatedTree(fetched);
            } catch (error) {
                console.error("Error fetching tree:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchPath, apiBaseUrl, useAuthToken]);
    useEffect(() => {
        const dataCopy = JSON.parse(JSON.stringify(data));
        setTree(dataCopy);
        setUpdatedTree(dataCopy)
    }, [data])
    useEffect(() => {
        console.log('tree', tree)
        console.log('updatedTree', updatedTree)
    }, [updatedTree])
    return (
        <>
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

                }}
            >
                <div
                    style={{
                        //overflowY: "auto",
                        width: '100%',
                        height: '100%',
                        paddingTop: 50
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
                            position: 'fixed',
                            top: '0px',
                            left: '0px',
                            width: '100%',
                            background: '#fff',
                            padding: 0,
                            backgroundColor: themeColors.light
                        }}
                        className="app-header"
                    />
                    <main style={{
                        padding: "0 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        overflowY: "auto",
                        width: '100%',
                        height: '100%',
                    }}>
                        {
                            (isOpen) ?
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            justifyContent: "center",
                                            padding: "10px",
                                            flexWrap: "wrap",
                                            gap: 8,
                                            width: '100%',

                                        }}
                                    >
                                        <TreeBuilder
                                            editFormTitle={editFormTitle}
                                            data={tree}
                                            labelKey={labelKey}
                                            itemFields={itemFields}
                                            itemLabelTemplate={itemLabelTemplate}
                                            onChange={(newData) => {
                                                console.log('data', tree);
                                                console.log('newData', newData);
                                                setUpdatedTree(newData)
                                                //setUpdatedTree(JSON.parse(JSON.stringify(newData)))
                                            }}
                                        />
                                    </div>
                                </>
                                : <></>
                        }
                    </main>

                    <FloatingActionButton
                        icon='check'
                        size='lg'
                        borderRadius={99}
                        disabled={!isModified}
                        onClick={async () => {
                            if (!savePath || !tree) return;

                            setSaving(true);
                            try {
                                const client = useAuthToken ? securedHttpClient : httpClient;
                                if (apiBaseUrl) client.setBaseURL(apiBaseUrl);
                                const method = saveMethod.toLowerCase() as keyof Pick<HttpClient, 'get' | 'post' | 'put' | 'delete'>;
                                const payload = saveDataKey ? { [saveDataKey]: updatedTree } : { tree: updatedTree };
                                await client[method](savePath, payload);
                                setTree(updatedTree);
                                setToastState({
                                    isOpen: true,
                                    title: "",
                                    message: "Datos actualizados con éxito",
                                    color: themeColors.success
                                });
                                //await client.post(savePath, tree); // o PUT según tu backend
                                // Optionally podés cerrar el modal o mostrar toast
                                console.log('Tree saved!');
                            } catch (error: any) {
                                console.error("Error saving tree:", error);
                                setToastState({
                                    isOpen: true,
                                    title: "Error",
                                    message: error.message,
                                    color: themeColors.danger
                                });
                            } finally {
                                setSaving(false);
                            }
                        }}

                    />
                </div>
            </Modal>
            <Toast
                isOpen={toastState.isOpen}
                title={toastState.title}
                message={toastState.message}
                color={toastState.color}
                onClose={handleCloseToast}
                duration={4000}
                containerStyle={{}}
                titleStyle={{ fontWeight: "bold" }}
                messageStyle={{ fontSize: "14px" }}

            />
        </>

    );
};

export default TreeBuilderModal;