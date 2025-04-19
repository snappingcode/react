import React, { useState, useEffect, Fragment } from 'react';
import * as ev from 'expr-eval';
import { themeColors } from '../../config';
import { httpClient, HttpClient, securedHttpClient } from '../../httpClient';

import Button from '../buttons/Button/Button';
import { applyNestedValues, setNestedValue } from '../../utils/nestedValues';
import useIsMobile from '../../hooks/useIsMobile';
import { renderField } from './FieldRenderer';


interface Field {
    type: string;
    label?: string;
    name: string;
    config?: Record<string, any>;
    value?: any;
}

interface DynamicFormProps {
    title?: string;
    fields: Field[];
    data?: Record<string, any>;
    fetchPath?: string;
    submitPath?: string;
    onChange?: (formData: Record<string, any>) => void;
    onSubmit?: (formData: Record<string, any>) => void;
    onSubmitSuccess?: (formData: Record<string, any>) => void;
    onSubmitError?: (error: any) => void;
    onCreateSuccess?: (formData: Record<string, any>) => void;
    onCreateError?: (error: any) => void;
    onEditSuccess?: (formData: Record<string, any>) => void;
    onEditError?: (error: any) => void;
    onFieldEditSuccess?: (field: any, fieldValue: any, formData: Record<string, any>) => void;
    onFieldEditError?: (field: any, error: any) => void;
    extraData?: Record<string, any>;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    fieldContainerStyle?: React.CSSProperties;
    fieldLabelStyle?: React.CSSProperties;
    fieldDescriptionStyle?: React.CSSProperties;
    fieldHeaderStyle?: React.CSSProperties;
    fieldBodyStyle?: React.CSSProperties;
    className?: string;
    id?: string;
    mode?: "create" | "edit" | "globalEdit" | "readOnly" | "submit";
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    hasSendButton?: boolean;
    sendButtonType?: "clear" | "outline" | "solid";
    sendButtonSize?: "xs" | "sm" | "md" | "lg" | "xl";
    sendButtonColor?: string;
    sendButtonTitle?: string;
    sendButtonIcon?: string;
    sendButtonIconPaths?: any[];
    sendButtonIconSize?: number;
    sendButtonStyle?: React.CSSProperties;
    sendButtonTitleStyle?: React.CSSProperties;
    sendButtonWrapperStyle?: React.CSSProperties;
    renderRadioOption?: (option: any, isClickable?: boolean, index?: number, isActive?: boolean) => React.ReactNode;
    renderCheckboxOption?: (option: any, index?: number, isChecked?: boolean) => React.ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    title,
    fields,
    data,
    fetchPath,
    submitPath,
    onChange,
    onSubmit,
    onCreateSuccess,
    onCreateError,
    onEditSuccess,
    onEditError,
    onFieldEditSuccess,
    onFieldEditError,
    onSubmitSuccess,
    onSubmitError,
    containerStyle,
    titleStyle,
    headerStyle,
    bodyStyle,
    fieldContainerStyle,
    fieldLabelStyle,
    fieldDescriptionStyle,
    fieldHeaderStyle,
    fieldBodyStyle,
    className,
    id,
    mode = "create",
    apiBaseUrl,
    extraData,
    useAuthToken = true,
    hasSendButton = true,
    sendButtonType = "solid",
    sendButtonSize = "lg",
    sendButtonColor = "primary",
    sendButtonTitle,
    sendButtonIcon,
    sendButtonIconPaths,
    sendButtonIconSize,
    sendButtonStyle,
    sendButtonTitleStyle,
    sendButtonWrapperStyle,
    renderRadioOption,
    //renderCheckboxOption
}) => {
    const [processing, setProcessing] = useState(false);

    let initialValues: any = {};

    fields.map((field: any) => {
        switch (field.type) {
            case "radio":
                initialValues[field.name] = field?.config?.defaultValue || field?.config?.options[0]?.value;
                break;
            case "date":
                initialValues[field.name] = field?.config?.defaultValue;
                break;
            case "iconPicker":
                initialValues[field.name] = field?.config?.defaultValue || null;
                break;
            // case "dynamicList":
            //     initialValues[field.name] = field?.config?.defaultValue || [];
            // break;
            case "checkbox":
                initialValues[field.name] = field?.config?.defaultValue || false;
                break;
            // case "color":
            //     initialValues[field.name] = "#666";
            //     break;
            // case "pastelColor":
            //     initialValues[field.name] = "#A597CC";
            //     break;
            case "list":
                initialValues[field.name] = field?.config?.defaultValue || [];
                break;
            case "checklist":
                initialValues[field.name] = field?.config?.defaultValue || [];
                break;

            case "images":
                initialValues[field.name] = field?.config?.defaultValue || [];
                break;
            case "videos":
                initialValues[field.name] = field?.config?.defaultValue || [];
                break;
            case "integer":
                initialValues[field.name] = field?.config?.defaultValue || null;
                break;
            case "grid":
                initialValues[field.name] = field?.config?.defaultValue || [];
                break;
            case "configuration":
                initialValues[field.name] = field?.config?.defaultValue || [];
                break;
            case "money":
                initialValues[field.name] = field?.config?.defaultValue || null;
                break;
            case "picker":
                if (field.validations?.maxItems === 1) {
                    initialValues[field.name] = field?.config?.defaultValue || null;
                } else {
                    initialValues[field.name] = field?.config?.defaultValue || [];
                }
                break;
            case "text":
                break;
            case "decimal":
                initialValues[field.name] = field?.config?.defaultValue || null;
                break;
            case "simplePayment":
                initialValues[field.name] = {
                    paymentMethods: [
                        {
                            name: "cash",
                            visibleName: "Efectivo",
                            amount: 0,
                        },
                        {
                            name: "credit_card",
                            visibleName: "Tarjeta de crédito",
                            amount: 0,
                        },
                        {
                            name: "debit_card",
                            visibleName: "Tarjeta de débito",
                            amount: 0,
                        },
                        {
                            name: "mercado_pago",
                            visibleName: "Mercado Pago",
                            amount: 0,
                        },
                        {
                            name: "bank_payment",
                            visibleName: "Pago bancario",
                            amount: 0,
                        },
                    ],
                    totalPaid: 0,
                };
                break;

            default:
                break;
        }
    });

    const [formValues, setFormValues] = useState<Record<string, any>>(initialValues);
    const { isMobile } = useIsMobile(768);

    const client: HttpClient = useAuthToken ? securedHttpClient : httpClient;
    if (apiBaseUrl) client.setBaseURL(apiBaseUrl);
    useEffect(() => {
        const initializeData = async () => {
            if (mode !== "create" && mode !== "submit" && fetchPath) {
                setProcessing(true);
                try {
                    const response = await client.get(fetchPath);
                    setFormValues(response.data); // Aquí asumimos que ya viene bien anidado
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setProcessing(false);
                }
            } else if (data) {
                // Usa applyNestedValues para mantener estructura anidada si los keys vienen como "a.b.c"
                setFormValues((prevValues) => applyNestedValues(prevValues, data));
            } else {
                // Solo inicializa si está vacío
                if (Object.keys(formValues).length === 0) {
                    const initialValues = fields.reduce((acc, field) => {
                        return setNestedValue(acc, field.name, field.value || '');
                    }, {});
                    setFormValues(initialValues);
                }
            }
        };

        initializeData();
    }, [mode, fetchPath, data, client]);

    const handleFieldChange = (name: string, value: any) => {
        // setFormValues((prevValues) => ({
        //     ...prevValues,
        //     [name]: value,
        // }));
        setFormValues((prevValues) => setNestedValue(prevValues, name, value));

    };
    useEffect(() => {
        onChange?.(formValues);
    }, [formValues])
    const handleSubmit = async () => {
        const finalData = { ...formValues, ...(extraData || {}) };

        if (submitPath) {
            setProcessing(true);
            try {
                const response = await client.post(submitPath, finalData);
                if (mode === 'create') onCreateSuccess?.(response)
                if (mode === 'globalEdit') onEditSuccess?.(response)
                if (mode === 'submit') onSubmitSuccess?.(response)
            } catch (error) {
                if (mode === 'create') onCreateError?.(error)
                if (mode === 'globalEdit') onEditError?.(error)
                if (mode === 'submit') onSubmitError?.(error)
            } finally {
                setProcessing(false);
            }
        } else if (onSubmit) {
            onSubmit(finalData);
        }
    };

    const shouldShowField = (field: Field) => {
        const showInModes = field?.config?.showInModes || ["create", "edit", "globalEdit", "readOnly", "submit"];
        const modeMatch = showInModes.includes(mode);
        const conditionMatch = field.config?.showIf ? ev.Parser.evaluate(field.config?.showIf, formValues) : true;
        return modeMatch && conditionMatch;
    };

    // const renderField = (field: Field) => {

    // };

    const getFieldSizeStyle = (colSpan: number | undefined) => {
        const columnSize = isMobile ? 100 : colSpan ? (colSpan / 12) * 100 : 100;
        return {
            flexBasis: `${columnSize}%`,
            maxWidth: `${columnSize}%`,
        };
    };
    const resolvedSendButtonTitle = () => {
        if (sendButtonTitle) return sendButtonTitle;
        if (mode === 'create') return 'Crear';
        if (mode === 'globalEdit') return 'Editar';
        if (mode === 'submit') return 'Enviar';
        return 'Guardar';
    }

    return (
        <>
            <form
                id={id}
                className={`dynamic-form-container ${className}`}
                style={{
                    background: '#fff',
                    padding: 10,
                    boxSizing: 'border-box',
                    ...containerStyle,
                }}
            >
                <div className='dynamic-form-header' style={{
                    display: 'flex',
                    justifyContent: 'center',
                    boxSizing: "border-box",
                    padding: 4,
                    ...headerStyle
                }}>
                    <h2 style={{
                        padding: 0,
                        margin: 0,
                        boxSizing: "border-box",
                        color: themeColors.textShade,
                        ...titleStyle
                    }}>{title}</h2>
                </div>
                <div
                    className='dynamic-form-body'
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: "5px 0",
                        ...bodyStyle,
                    }}
                >
                    {fields.map((field: Field, index) => (
                        <Fragment key={index}>
                            {shouldShowField(field) && (
                                <div
                                    className='field-wrapper'
                                    style={{
                                        ...getFieldSizeStyle(field?.config?.colSpan),
                                        padding: '5px 5px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {renderField({
                                        field,
                                        formValues,
                                        mode,
                                        apiBaseUrl,
                                        fieldContainerStyle,
                                        fieldLabelStyle,
                                        fieldDescriptionStyle,
                                        fieldHeaderStyle,
                                        fieldBodyStyle,
                                        onFieldEditSuccess,
                                        onFieldEditError,
                                        handleFieldChange,
                                        renderRadioOption
                                    })}
                                </div>
                            )}
                        </Fragment>
                    ))}
                </div>
                {(mode === 'create' || mode === 'globalEdit' || mode === 'submit') && (

                    <>
                        {hasSendButton ? (
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    ...sendButtonWrapperStyle
                                }}
                            >
                                <Button
                                    onClick={() => handleSubmit()}
                                    startIcon={sendButtonIcon}
                                    startIconSize={sendButtonIconSize}
                                    startIconPaths={sendButtonIconPaths}
                                    title={resolvedSendButtonTitle()}
                                    titleStyle={sendButtonTitleStyle}
                                    style={{
                                        marginTop: 10,
                                        ...sendButtonStyle
                                    }}
                                    type={sendButtonType}
                                    size={sendButtonSize}
                                    color={sendButtonColor}
                                    disabled={processing}
                                />
                            </div>
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </form>

        </>

    );
};

export default DynamicForm;