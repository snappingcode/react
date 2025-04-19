
import React, { useEffect, useState } from 'react'
import Modal from '../../Modal/Modal';
import Header from '../../Header/Header';
import JsonViewer from '../../JsonViewer/JsonViewer';
import FloatingActionButton from '../../buttons/FloatingActionButton/FloatingActionButton';
import FileSelectButton from '../../buttons/FileSelectButton/FileSelectButton';
import { httpClient, HttpClient, securedHttpClient } from '../../../httpClient';

interface ImportOneModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    closeButtonStyle?: React.CSSProperties;
    closeIcon?: string;
    closeIconPaths?: any[];
    closeIconSize?: number;
    zIndex?: number;
    id?: string;
    fullScreen?: boolean;
    apiBaseUrl: string;
    useAuthToken?: boolean;
    importPath: string;
}

const ImportOneModal: React.FC<ImportOneModalProps> = ({
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
    fullScreen = true,
    apiBaseUrl,
    importPath,
    useAuthToken = true
}) => {
    useEffect(() => {
        if (!isOpen) {
            setJsonData(null);
            setIsValidJsonObject(false)
        }
    }, [isOpen])
    const [jsonData, setJsonData] = useState<object | null>(null);
    const [isValidJsonObject, setIsValidJsonObject] = useState(false);
    const client: HttpClient = useAuthToken ? securedHttpClient : httpClient;
    if (apiBaseUrl) client.setBaseURL(apiBaseUrl);


    const handleFileSelect = async (file: File) => {
        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                setJsonData(parsed);
                setIsValidJsonObject(true);
            } else {
                setJsonData(null);
                setIsValidJsonObject(false);
                alert('El archivo JSON debe ser un objeto, no un array.');
            }
        } catch (err) {
            console.error('Error parsing JSON:', err);
            setJsonData(null);
            setIsValidJsonObject(false);
            alert('El archivo no contiene un JSON válido.');
        }
    };

    const handleFileClear = () => {
        setJsonData(null);
        setIsValidJsonObject(false);
    };

    const handleImport = async () => {
        if (!jsonData) return;

        try {
            const response = await client.post(importPath, jsonData);
            console.log('Import response:', response);

            // ✅ Opcional: cerrar modal o mostrar feedback
            alert('Importación exitosa.');
            onClose();

        } catch (error: any) {
            console.error('Error en la importación:', error);
            alert('Error al importar el archivo.');
        }
    };

    // const response = await client.post(importPath, jsonData);

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
                />
                <main style={{
                    padding: "16px",
                }}>
                    <FileSelectButton
                        title="Upload file"
                        accept=".json"
                        onFileSelect={handleFileSelect}
                        onFileClear={handleFileClear}
                        selectedFileContainerStyle={{ backgroundColor: '#f9f9f9' }}
                    />
                    {isValidJsonObject && (
                        <div style={{ marginTop: 16 }}>
                            <JsonViewer data={jsonData} collapsed />
                        </div>
                    )}
                </main>
                {
                    isOpen ? <FloatingActionButton
                        disabled={!isValidJsonObject}
                        icon='import'
                        size='lg'
                        borderRadius={99}
                        onClick={handleImport}
                        style={{

                        }}
                    /> : <></>
                }
            </div>
        </Modal>
    );
};

export default ImportOneModal;