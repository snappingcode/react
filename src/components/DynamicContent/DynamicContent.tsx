
import React, { useState } from 'react';
import Paper from '../Paper/Paper';
import DynamicForm from '../DynamicForm/DynamicForm';
import DynamicList from '../DynamicList/DynamicList';
import DigitalArchive from '../DigitalArchive/DigitalArchive';

import FormModal from '../modals/FormModal/FormModal';
import MultiStepContent from '../MultiStepContent/MultiStepContent';



interface DynamicContentProps {
    type: string;
    name?: string;
    displayName?: string;
    apiBaseUrl?: string;
    config?: Record<string, any>;
}

const DynamicContent: React.FC<DynamicContentProps & {
    onSubmit?: (data: any) => void;
    onSuccess?: (data: any, successMessage: string) => void;
    onItemChangeSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    onItemChangeError?: (error: any) => void;
    //onEvent?: Record<string, (data: any) => void>;
}> = ({
    type,
    name,
    displayName,
    apiBaseUrl,
    config,
    onSubmit,
    onSuccess,
    onItemChangeSuccess,
    onError,
    onItemChangeError,
    //onEvent = {}
}) => {
        const [formModalIsOpen, setFormModalIsOpen] = useState(false);

        const resolveContent = (type: string) => {
            switch (type) {
                case 'form':
                    return (
                        <Paper style={{
                            width: '100%',
                            maxWidth: config?.formWidth || 700
                        }}>
                            <DynamicForm
                                fields={config?.fields || []}
                                title={config?.formTitle}
                                sendButtonIcon={config?.sendButtonIcon}
                                sendButtonTitle={config?.sendButtonTitle}
                                mode={config?.mode}
                                fetchEndpoint={config?.fetchEndpoint}
                                submitEndpoint={config?.submitEndpoint}
                                apiBaseUrl={apiBaseUrl}
                                useSecureConnection={config?.submitEndpoint || true}
                                renderRadioOption={(option, index, isActive) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '5px 10px',
                                            borderRadius: '8px',
                                            border: isActive
                                                ? `2px solid blue`
                                                : `1px solid gray`,
                                            backgroundColor: isActive ? 'blue' : 'white',
                                            color: isActive ? 'white' : 'black',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span style={{ marginRight: '8px' }}>🎨</span>
                                        <span>{option.label}</span>
                                    </div>
                                )}
                                renderCheckboxOption={(option, index, isChecked) => (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '5px 10px',
                                            borderRadius: '8px',
                                            border: isChecked
                                                ? `2px solid green`
                                                : `1px solid gray`,
                                            backgroundColor: isChecked ? 'green' : 'white',
                                            color: isChecked ? 'white' : 'black',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <span style={{ marginRight: '8px' }}>✔️</span>
                                        <span>{option.label}</span>
                                    </div>
                                )}
                                containerStyle={{
                                    ...config?.containerStyle
                                }}
                                onSubmit={(formData) => {
                                    console.log('submit', formData);
                                    onSubmit?.(formData); // Prop específica
                                    //onEvent?.onSubmit?.(formData); // En `onEvent`
                                }}
                                onError={(error) => {
                                    //alert(error);
                                    onError?.(error); //
                                }}
                                onSuccess={(formData) => {
                                    console.log('success', formData);
                                    onSuccess?.(formData, config?.successMessage); // Prop específica
                                    //onEvent?.onSuccess?.(formData); // En `onEvent`
                                }}
                            />
                        </Paper>
                    );
                case 'list':
                    return (
                        <DynamicList
                            startSlots={config?.startSlots || []}
                            endSlots={config?.endSlots || []}
                            apiBaseUrl={apiBaseUrl}
                            endpoint={config?.endpoint}
                            useSecureConnection={config?.useSecureConnection}
                            onItemChangeSuccess={(item) => {
                                console.log('Item changed successfully:', item);
                                onItemChangeSuccess?.(item);
                                //onEvent?.onItemChangeSuccess?.(item); // En `onEvent`
                            }}
                            onItemChangeError={(error) => {
                                onItemChangeError?.(error);
                            }}
                            onActionClick={(actionData, itemData) => {
                                console.log('actionData', actionData)
                                console.log('itemData', itemData)
                                setFormModalIsOpen(true);
                            }}
                            itemStyle={{
                                border: 'none',
                                boxShadow: "0px 1.5px 0px rgba(0, 0, 0, 0.15)",
                                marginBottom: 10
                            }}
                        />
                    );
                case 'digitalArchive':
                    return <DigitalArchive
                        apiBaseUrl={apiBaseUrl}
                        endpoint={config?.endpoint}
                        useSecureConnection={true}

                    />;
                case 'multiStepContent':
                    return <MultiStepContent
                        containerStyle={config?.containerStyle}
                        steps={config?.steps}
                    />;
                default:
                    return null; // Manejo de casos desconocidos
            }
        };

        return (
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    {resolveContent(type)}
                </div>
                {formModalIsOpen && (
                    <FormModal
                        isOpen={formModalIsOpen}
                        fullScreen
                        fields={[
                            {
                                type: 'text',
                                name: 'name',
                                label: 'Nombre del usuario',
                                value: '',
                                size: 12,
                            },
                        ]}
                        mode="create"
                        onClose={() => {
                            setFormModalIsOpen(false);
                        }}
                    />
                )}
            </div>
        );
    };

export default DynamicContent;
