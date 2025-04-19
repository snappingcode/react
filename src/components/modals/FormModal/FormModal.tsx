import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import Paper from "../../Paper/Paper";
import { themeColors } from "../../../config";
import DynamicForm from "../../DynamicForm/DynamicForm";

import Toast from "../../Toast/Toast";
import Icon from "../../Icon/Icon";

interface Field {
    type: string;
    label?: string;
    name: string;
    config?: Record<string, any>;
    value?: any;
}

interface FormModalProps {
    isOpen: boolean;
    onClose: (reason: 'cancel' | 'success' | 'error' | 'custom') => void;
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
    fields: Field[];
    //fields: any[];
    data?: Record<string, any>;
    fetchPath?: string;
    submitPath?: string;
    onSubmit?: (formData: Record<string, any>) => void;
    onCreateSuccess?: (formData: Record<string, any>) => void;
    onCreateError?: (error: any) => void;
    onEditSuccess?: (formData: Record<string, any>) => void;
    onEditError?: (error: any) => void;
    onFieldEditSuccess?: (field: any, fieldValue: any, formData: Record<string, any>) => void;
    onFieldEditError?: (field: any, error: any) => void;
    // onSuccess?: (formData: Record<string, any>) => void;
    // onError?: (error: any) => void;
    extraData?: Record<string, any>;
    formContainerStyle?: React.CSSProperties;
    formWidth?: number | string | undefined;
    formHeaderStyle?: React.CSSProperties;
    formBodyStyle?: React.CSSProperties;
    formTitleStyle?: React.CSSProperties;
    fieldContainerStyle?: React.CSSProperties;
    fieldLabelStyle?: React.CSSProperties;
    fieldDescriptionStyle?: React.CSSProperties;
    fieldHeaderStyle?: React.CSSProperties;
    fieldBodyStyle?: React.CSSProperties;
    className?: string;
    mode?: "create" | "edit" | "globalEdit" | "readOnly" | "submit";
    apiBaseUrl?: string;
    useAuthToken?: boolean;
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
    fetchPath,
    submitPath,
    onSubmit,
    onCreateSuccess,
    onCreateError,
    onEditSuccess,
    onEditError,
    onFieldEditSuccess,
    onFieldEditError,
    // onSuccess,
    // onError,
    formContainerStyle,
    formWidth = 700,
    formHeaderStyle,
    formBodyStyle,
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
    useAuthToken,
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
    const [showDynamicForm, setShowDynamicForm] = useState(false);
    const [closeReason, setCloseReason] = useState('cancel' as 'cancel' | 'success' | 'error' | 'custom');
    useEffect(() => {
        setShowDynamicForm(!isOpen)
        if (isOpen) {
            setCloseReason('cancel');
        }
    }, [isOpen])
    const radioOptionWidth = 100;
    const radioOptionHeight = 100;
    const [toastState, setToastState] = useState({
        isOpen: false, // Controls visibility
        title: '', // Title of the Toast
        message: '', // Message of the Toast
        color: themeColors.success // Color of the Toast
    });
    // Handle Toast close event
    const handleCloseToast = () => {
        setToastState({ ...toastState, isOpen: false });
    };
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => onClose(closeReason)}
                backdropStyle={backdropStyle}
                windowStyle={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: themeColors.light,
                    padding: 5,
                    ...windowStyle
                }}
                closeButtonStyle={{
                    right: 15,
                    backgroundColor: themeColors.light,
                    ...closeButtonStyle
                }}
                closeIcon={closeIcon}
                closeIconPaths={closeIconPaths}
                closeIconSize={closeIconSize}

                zIndex={zIndex}
                id={id}
                fullScreen={fullScreen}
                onAnimationComplete={() => {
                    console.log('Animation complete')
                    setShowDynamicForm(true);
                }}

            >
                <div
                    style={{
                        //overflowY: "auto",
                        width: '100%',
                        height: '100%',
                        paddingTop: 0
                    }}
                >
                    <main style={{
                        padding: "0 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        overflowY: "auto",
                        width: '100%',
                        height: '100%',
                        paddingBottom: 30,
                    }}>

                        {
                            (isOpen && showDynamicForm) ?
                                <>
                                    <Paper
                                        style={{
                                            width: '100%',
                                            maxWidth: formWidth,
                                            //maxWidth: 500,
                                            marginTop: 80,
                                            position: 'relative',
                                            paddingTop: 30,
                                            minHeight: "auto"
                                        }}
                                    >
                                        <h2
                                            style={{
                                                position: 'absolute',
                                                top: -20,
                                                right: 10,
                                                fontSize: 24
                                            }}
                                        >{formTitle}</h2>
                                        <DynamicForm
                                            //title={formTitle}
                                            fields={fields}
                                            data={data}
                                            fetchPath={fetchPath}
                                            submitPath={submitPath}
                                            onSubmit={onSubmit}

                                            onCreateSuccess={((formData) => {
                                                onCreateSuccess?.(formData);
                                                //setCloseReason('success');
                                                onClose('success');
                                            })}

                                            onCreateError={(error) => {
                                                setToastState({
                                                    isOpen: true,
                                                    title: "Error",
                                                    message: error.message,
                                                    color: themeColors.danger
                                                });
                                                onCreateError?.(error);
                                            }}
                                            onEditSuccess={((formData) => {
                                                onEditSuccess?.(formData);
                                                setCloseReason('success');

                                            })}

                                            onEditError={(error) => {
                                                setToastState({
                                                    isOpen: true,
                                                    title: "Error",
                                                    message: error.message,
                                                    color: themeColors.danger
                                                });
                                                onEditError?.(error);
                                            }}
                                            onFieldEditSuccess={(field: any, fieldValue: any, formData: Record<string, any>) => {
                                                setToastState({
                                                    isOpen: true,
                                                    title: "",
                                                    message: "Campo editado con éxito",
                                                    color: themeColors.success
                                                });
                                                onFieldEditSuccess?.(field, fieldValue, formData);
                                                setCloseReason('success');
                                            }}
                                            onFieldEditError={(field: any, error: any) => {
                                                setToastState({
                                                    isOpen: true,
                                                    title: "Error",
                                                    message: error.message,
                                                    color: themeColors.danger
                                                });
                                                onFieldEditError?.(field, error);
                                            }}
                                            // onSuccess={((formData) => {
                                            //     onSuccess?.(formData);
                                            //     setCloseReason('success');
                                            // })}
                                            // onError={(error) => {
                                            //     setToastState({
                                            //         isOpen: true,
                                            //         title: "Error",
                                            //         message: error.message,
                                            //         color: themeColors.danger
                                            //     });
                                            //     if (onError) onError(error);
                                            // }}
                                            containerStyle={{
                                                padding: 0,
                                                ...formContainerStyle
                                            }}
                                            headerStyle={formHeaderStyle}
                                            bodyStyle={formBodyStyle}
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
                                            useAuthToken={useAuthToken}
                                            sendButtonType={sendButtonType}
                                            sendButtonSize={sendButtonSize}
                                            sendButtonColor={sendButtonColor}
                                            sendButtonTitle={sendButtonTitle}
                                            sendButtonIcon={sendButtonIcon}
                                            sendButtonIconPaths={sendButtonIconPaths}
                                            sendButtonIconSize={sendButtonIconSize}
                                            sendButtonStyle={sendButtonStyle}
                                            sendButtonTitleStyle={sendButtonTitleStyle}
                                            renderRadioOption={(option, isClickable, _index, isActive) => (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'flex-start',
                                                        padding: '5px 10px',
                                                        borderRadius: '8px',

                                                        backgroundColor: isActive ? themeColors.primaryTint : "#fff",
                                                        cursor: 'pointer',
                                                        flexDirection: 'column',
                                                        width: radioOptionWidth,
                                                        height: isClickable ? radioOptionHeight : radioOptionHeight - 20,
                                                        filter: "drop-shadow(0px 2px 0 #ddd)",
                                                        position: 'relative'
                                                    }}
                                                >

                                                    {
                                                        option?.icon ? <Icon
                                                            name={option?.icon}
                                                            color={themeColors.primary}
                                                            size={33}
                                                        /> : <></>
                                                    }
                                                    <span
                                                        style={{
                                                            fontWeight: 'bold'
                                                        }}
                                                    >{option?.label}</span>
                                                    {
                                                        isClickable ? <div style={{
                                                            position: 'absolute',
                                                            height: 30,
                                                            width: radioOptionWidth,
                                                            bottom: -10,
                                                            left: 0,
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                        }}>
                                                            <div style={{
                                                                position: 'relative',
                                                                height: 30,
                                                                width: 30,
                                                                borderRadius: 99,
                                                                backgroundColor: isActive ? themeColors.primaryTint : "#fff",
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                            }}>
                                                                <Icon name={isActive ? "circle" : "circleOutline"} size={26} color={themeColors.primary} />
                                                            </div>
                                                        </div> : <></>
                                                    }

                                                </div>
                                            )}
                                        />
                                    </Paper>
                                </>
                                : <></>
                        }
                    </main>
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

export default FormModal;
