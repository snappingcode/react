import React, { useEffect, useState } from "react";
import Modal from "../../Modal/Modal";
import { themeColors } from "../../../config";
import DynamicForm from "../../DynamicForm/DynamicForm";
import Toast from "../../Toast/Toast";
import Icon from "../../Icon/Icon";
import Button from "../../buttons/Button/Button";

interface Field {
    type: string;
    label?: string;
    name: string;
    config?: Record<string, any>;
    value?: any;
}

interface FormDialogProps {
    isOpen: boolean;
    onClose: (reason: 'cancel' | 'success' | 'error' | 'custom') => void;
    backdropStyle?: React.CSSProperties;
    windowStyle?: React.CSSProperties;
    zIndex?: number;
    id?: string;
    formTitle?: string;
    fields: Field[];
    data?: Record<string, any>;
    submitPath?: string;
    onSubmit?: (formData: Record<string, any>) => void;
    onSubmitSuccess?: (formData: Record<string, any>) => void;
    onSubmitError?: (error: any) => void;
    extraData?: Record<string, any>;
    formContainerStyle?: React.CSSProperties;
    formHeaderStyle?: React.CSSProperties;
    formBodyStyle?: React.CSSProperties;
    formTitleStyle?: React.CSSProperties;
    fieldContainerStyle?: React.CSSProperties;
    fieldLabelStyle?: React.CSSProperties;
    fieldDescriptionStyle?: React.CSSProperties;
    fieldHeaderStyle?: React.CSSProperties;
    fieldBodyStyle?: React.CSSProperties;
    className?: string;
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
    cancelButtonType?: "clear" | "outline" | "solid";
    cancelButtonSize?: "xs" | "sm" | "md" | "lg" | "xl";
    cancelButtonColor?: string;
    cancelButtonTitle?: string;
    cancelButtonIcon?: string;
    cancelButtonIconPaths?: any[];
    cancelButtonIconSize?: number;
    cancelButtonStyle?: React.CSSProperties;
    cancelButtonTitleStyle?: React.CSSProperties;
}

const FormDialog: React.FC<FormDialogProps> = ({
    // Props de Modal
    isOpen,
    onClose,
    backdropStyle,
    windowStyle,
    zIndex,
    id,
    // Props de DynamicForm
    formTitle,
    fields,
    data,
    submitPath,
    onSubmit,
    // onSubmitSuccess,
    // onSubmitError,
    formContainerStyle,
    formHeaderStyle,
    formBodyStyle,
    formTitleStyle,
    fieldContainerStyle,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldHeaderStyle,
    fieldBodyStyle,
    className,
    apiBaseUrl,
    extraData,
    useAuthToken,
    sendButtonType,
    sendButtonSize,
    sendButtonColor,
    sendButtonTitle = 'Enviar',
    sendButtonIcon,
    sendButtonIconPaths,
    sendButtonIconSize,
    sendButtonStyle,
    sendButtonTitleStyle,

    cancelButtonType = 'outline',
    cancelButtonSize,
    cancelButtonColor,
    cancelButtonTitle = 'Cancelar',
    cancelButtonIcon,
    cancelButtonIconPaths,
    cancelButtonIconSize,
    cancelButtonStyle,
    cancelButtonTitleStyle,
}) => {
    const [formValues, setFormValues] = useState<Record<string, any>>(data || {});
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
                    backgroundColor: '#fff',
                    padding: 5,
                    height: 'auto',
                    overflowY: "auto",
                    ...windowStyle
                }}
                zIndex={zIndex}
                id={id}
                onAnimationComplete={() => {
                    console.log('Animation complete')
                    setShowDynamicForm(true);
                }}
                showCloseButton={false}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: "0 10px",
                        paddingBottom: 30,
                        //overflowY: "auto",
                    }}
                >
                    {/* <main style={{
                        padding: "0 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-start",

                        width: '100%',
                        //height: '100%',
                        paddingBottom: 30,
                    }}> */}

                    {
                        (isOpen && showDynamicForm) ?
                            <>

                                <h2
                                    style={{
                                        textAlign: 'center',
                                        padding: 10
                                    }}
                                >{formTitle}</h2>
                                <DynamicForm
                                    fields={fields}
                                    data={data}
                                    submitPath={submitPath}
                                    // onSubmit={onSubmit}
                                    // onSubmitSuccess={((formData) => {
                                    //     onSubmitSuccess?.(formData);
                                    //     onClose('success');
                                    // })}
                                    // onSubmitError={(error) => {
                                    //     setToastState({
                                    //         isOpen: true,
                                    //         title: "Error",
                                    //         message: error.message,
                                    //         color: themeColors.danger
                                    //     });
                                    //     onSubmitError?.(error);
                                    // }}
                                    onChange={(formValues) => {
                                        console.log('formValues', formValues);
                                        setFormValues(formValues)
                                    }}
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
                                    mode={'submit'}
                                    apiBaseUrl={apiBaseUrl}
                                    extraData={extraData}
                                    useAuthToken={useAuthToken}
                                    hasSendButton={false}
                                    // sendButtonType={sendButtonType}
                                    // sendButtonSize={sendButtonSize}
                                    // sendButtonColor={sendButtonColor}
                                    // sendButtonTitle={sendButtonTitle}
                                    // sendButtonIcon={sendButtonIcon}
                                    // sendButtonIconPaths={sendButtonIconPaths}
                                    // sendButtonIconSize={sendButtonIconSize}
                                    // sendButtonStyle={sendButtonStyle}
                                    // sendButtonTitleStyle={sendButtonTitleStyle}
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

                                <div style={{
                                    display: "flex",
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 10,
                                    marginTop: 20
                                }}>
                                    <Button
                                        title={cancelButtonTitle || ''}
                                        titleStyle={cancelButtonTitleStyle}
                                        style={cancelButtonStyle}
                                        endIcon={cancelButtonIcon}
                                        endIconSize={cancelButtonIconSize}
                                        endIconStyle={cancelButtonStyle}
                                        endIconPaths={cancelButtonIconPaths}
                                        endIconColor={cancelButtonColor}
                                        type={cancelButtonType}
                                        size={cancelButtonSize}
                                        onClick={() => { onClose('cancel') }}
                                    />

                                    <Button
                                        title={sendButtonTitle || ''}
                                        titleStyle={sendButtonTitleStyle}
                                        style={sendButtonStyle}
                                        endIcon={sendButtonIcon}
                                        endIconSize={sendButtonIconSize}
                                        endIconStyle={sendButtonStyle}
                                        endIconPaths={sendButtonIconPaths}
                                        endIconColor={sendButtonColor}
                                        type={sendButtonType}
                                        size={sendButtonSize}
                                        onClick={() => {
                                            onSubmit?.(formValues)
                                        }}
                                    />
                                </div>

                            </>
                            : <></>
                    }
                    {/* </main> */}
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

export default FormDialog;
