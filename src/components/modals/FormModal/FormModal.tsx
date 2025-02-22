import React from "react";
import Modal from "../../Modal/Modal";
import DynamicForm from "../../DynamicForm/DynamicForm";
import Paper from "../../Paper/Paper";
interface FieldData {
    type: string;
    label?: string;
    description?: string;
    placeholder?: string;
    name: string;
    value?: string | boolean | number;
    size?: number;
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    [key: string]: any;
}

interface FormModalProps {

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
    formTitle?: string;
    fields: FieldData[];
    data?: Record<string, any>;
    fetchEndpoint?: string;
    submitEndpoint?: string;
    onSubmit?: (formData: Record<string, any>) => void;
    onSuccess?: (formData: Record<string, any>) => void;
    onError?: (error: any) => void;
    extraData?: Record<string, any>;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    formTitleStyle?: React.CSSProperties;
    fieldContainerStyle?: React.CSSProperties;
    fieldLabelStyle?: React.CSSProperties;
    fieldDescriptionStyle?: React.CSSProperties;
    fieldHeaderStyle?: React.CSSProperties;
    fieldBodyStyle?: React.CSSProperties;
    className?: string;
    mode?: "create" | "edit" | "globalEdit" | "readOnly" | "submit";
    apiBaseUrl?: string;
    useSecureConnection?: boolean;
    sendButtonType?: "clear" | "outline" | "solid";
    sendButtonSize?: "xs" | "sm" | "md" | "lg" | "xl";
    sendButtonColor?: string;
    sendButtonTitle?: string;
    sendButtonIcon?: string;
    sendButtonIconPaths?: any[];
    sendButtonIconSize?: number;
    sendButtonStyle?: React.CSSProperties;
    sendButtonTitleStyle?: React.CSSProperties;
}

const FormModal: React.FC<FormModalProps> = ({
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
    fullScreen,

    // Props de DynamicForm
    formTitle,
    fields,
    data,
    fetchEndpoint,
    submitEndpoint,
    onSubmit,
    onSuccess,
    onError,
    containerStyle,
    headerStyle,
    bodyStyle,
    formTitleStyle,
    fieldContainerStyle,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldHeaderStyle,
    fieldBodyStyle,
    className,
    mode,
    apiBaseUrl,
    extraData,
    useSecureConnection,
    sendButtonType,
    sendButtonSize,
    sendButtonColor,
    sendButtonTitle,
    sendButtonIcon,
    sendButtonIconPaths,
    sendButtonIconSize,
    sendButtonStyle,
    sendButtonTitleStyle,
}) => {
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
            <Paper
                style={{
                    width: '100%',
                    maxWidth: 500,

                }}
            >
                <DynamicForm
                    title={formTitle}
                    fields={fields}
                    data={data}
                    fetchEndpoint={fetchEndpoint}
                    submitEndpoint={submitEndpoint}
                    onSubmit={onSubmit}
                    onSuccess={onSuccess}
                    onError={onError}
                    containerStyle={containerStyle}
                    headerStyle={headerStyle}
                    bodyStyle={bodyStyle}
                    titleStyle={formTitleStyle}
                    fieldContainerStyle={fieldContainerStyle}
                    fieldLabelStyle={fieldLabelStyle}
                    fieldDescriptionStyle={fieldDescriptionStyle}
                    fieldHeaderStyle={fieldHeaderStyle}
                    fieldBodyStyle={fieldBodyStyle}
                    className={className}
                    mode={mode}
                    apiBaseUrl={apiBaseUrl}
                    extraData={extraData}
                    useSecureConnection={useSecureConnection}
                    sendButtonType={sendButtonType}
                    sendButtonSize={sendButtonSize}
                    sendButtonColor={sendButtonColor}
                    sendButtonTitle={sendButtonTitle}
                    sendButtonIcon={sendButtonIcon}
                    sendButtonIconPaths={sendButtonIconPaths}
                    sendButtonIconSize={sendButtonIconSize}
                    sendButtonStyle={sendButtonStyle}
                    sendButtonTitleStyle={sendButtonTitleStyle}
                />
            </Paper>
        </Modal>
    );
};

export default FormModal;
