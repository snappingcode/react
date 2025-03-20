import React, { useState, useEffect, Fragment } from 'react';
import * as ev from 'expr-eval';

import AutocompleteField from '../fields/AutocompleteField/AutocompleteField';
import ColorField from '../fields/ColorField/ColorField';
import TextField from '../fields/TextField/TextField';
import LongTextField from '../fields/LongTextField/LongTextField';
import PastelColorField from '../fields/PastelColorField/PastelColorField';
import RadioField from '../fields/RadioField/RadioField';
import CheckboxField from '../fields/CheckboxField/CheckboxField';
import CheckboxGroupField from '../fields/CheckboxGroupField/CheckboxGroupField';
import PasswordField from '../fields/PasswordField/PasswordField';
import Button from '../buttons/Button/Button';

import NumberField from '../fields/NumberField/NumberField';
import DateField from '../fields/DateField/DateField';
import DateTimeField from '../fields/DateTimeField/DateTimeField';
import TimeField from '../fields/TimeField/TimeField';
import MonthYearField from '../fields/MonthYearField/MonthYearField';
import YearField from '../fields/YearField/YearField';
import Portal from '../Portal/Portal';
import IconButton from '../buttons/IconButton/IconButton';
import { themeColors } from '../../config';
import { httpClient, HttpClient, securedHttpClient } from '../../httpClient';

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

interface DynamicFormProps {
    title?: string;
    fields: FieldData[];
    data?: Record<string, any>; // Nuevos datos iniciales opcionales
    fetchEndpoint?: string; // Endpoint para obtener datos iniciales
    submitEndpoint?: string; // Endpoint para enviar datos
    onSubmit?: (formData: Record<string, any>) => void;
    onSuccess?: (formData: Record<string, any>) => void;
    onError?: (error: any) => void;
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
    sendButtonWrapperStyle?: React.CSSProperties;
    renderRadioOption?: (option: any, index: number, isActive: boolean) => React.ReactNode;
    renderCheckboxOption?: (option: any, index: number, isChecked: boolean) => React.ReactNode;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
    title,
    fields,
    data,
    fetchEndpoint,
    submitEndpoint,
    onSubmit,
    onSuccess,
    onError,
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
    useSecureConnection = true,
    sendButtonType = "solid",
    sendButtonSize = "md",
    sendButtonColor = "primary",
    sendButtonTitle,
    sendButtonIcon,
    sendButtonIconPaths,
    sendButtonIconSize,
    sendButtonStyle,
    sendButtonTitleStyle,
    sendButtonWrapperStyle,
    renderRadioOption,
    renderCheckboxOption
}) => {
    const [processing, setProcessing] = useState(false);
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);
    const client: HttpClient = useSecureConnection ? securedHttpClient : httpClient;

    if (apiBaseUrl) client.setBaseURL(apiBaseUrl);

    useEffect(() => {
        const initializeData = async () => {
            if (mode !== "create" && mode !== "submit" && fetchEndpoint) {
                setProcessing(true);
                try {
                    const response = await client.get(fetchEndpoint);
                    setFormValues(response.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    setProcessing(false);
                }
            } else if (data) {
                // Solo actualiza el estado si los datos iniciales son diferentes
                setFormValues((prevValues) => ({
                    ...prevValues,
                    ...data,
                }));
            } else {
                // Inicializa los valores del formulario solo si no hay datos previos
                if (Object.keys(formValues).length === 0) {
                    setFormValues(fields.reduce((acc, field) => ({ ...acc, [field.name]: field.value || "" }), {}));
                }
            }
        };

        initializeData();
    }, [mode, fetchEndpoint, data, client]);

    const handleFieldChange = (name: string, value: any) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const finalData = { ...formValues, ...(extraData || {}) };

        if (submitEndpoint) {
            setProcessing(true);
            try {
                const response = await client.post(submitEndpoint, finalData);
                if (onSuccess) onSuccess(response);
            } catch (error) {
                console.error("Error submitting data:", error);
                if (onError) onError(error);
            } finally {
                setProcessing(false);
            }
        } else if (onSubmit) {
            onSubmit(finalData);
        }
    };

    const shouldShowField = (field: FieldData) => {
        const showInModes = field.showInModes || ["create", "edit", "globalEdit", "readOnly", "submit"];
        const modeMatch = showInModes.includes(mode);
        const conditionMatch = field.showIf ? ev.Parser.evaluate(field.showIf, formValues) : true;
        return modeMatch && conditionMatch;
    };


    const renderField = (field: FieldData) => {
        const {
            type,
            label,
            description,
            placeholder,
            name,
            size,
            value,
            containerStyle,
            labelStyle,
            descriptionStyle,
            headerStyle,
            bodyStyle,
            ...additionalProps
        } = field;

        const commonStyle = {
            containerStyle: { ...fieldContainerStyle, ...containerStyle },
            labelStyle: { ...fieldLabelStyle, ...labelStyle },
            descriptionStyle: { ...fieldDescriptionStyle, ...descriptionStyle },
        };

        const conditionalStyle = {
            headerStyle: { ...fieldHeaderStyle, ...headerStyle },
            bodyStyle: { ...fieldBodyStyle, ...bodyStyle },
        };

        switch (type) {
            case 'text':
                return (
                    <TextField
                        onChange={(e: any) => handleFieldChange(name, e.target ? e.target.value : e)}
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        placeholder={placeholder}
                        inputStyle={additionalProps.inputStyle}
                        {...commonStyle}
                    />
                );
            case 'password':
                return (
                    <PasswordField
                        onChange={(e: any) => handleFieldChange(name, e.target ? e.target.value : e)}
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        placeholder={placeholder}
                        inputStyle={additionalProps.inputStyle}
                        {...commonStyle}
                    />
                );
            case 'longText':
                return (
                    <LongTextField
                        onChange={(e: any) => handleFieldChange(name, e.target ? e.target.value : e)}
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        rows={additionalProps.rows}
                        {...commonStyle}
                    />
                );
            case 'color':
                return (
                    <ColorField
                        onChange={(value: string) => handleFieldChange(name, value)}
                        label={label}
                        description={description || '#000000'}
                        value={formValues[name]}
                        {...commonStyle}
                    />
                );
            case 'pastelColor':
                return (
                    <PastelColorField
                        onChange={(value: string) => handleFieldChange(name, value)}
                        label={label}
                        description={description}
                        value={formValues[name] || "#A597CC"}
                        {...commonStyle}
                    />
                );
            case 'radio':
                return (
                    <RadioField
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        onChange={(value: string) => handleFieldChange(name, value)}
                        options={additionalProps.options}
                        renderOption={additionalProps.useDynamicRenderOption ? renderRadioOption : undefined}
                        containerStyle={commonStyle.containerStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );

            case 'autocomplete':
                return (
                    <AutocompleteField
                        onChange={(value: any) => handleFieldChange(name, value)}
                        label={label}
                        description={description}
                        value={formValues[name]}
                        options={additionalProps.options}
                        multiple={additionalProps.multiple}
                        baseUrl={additionalProps.baseUrl}
                        path={additionalProps.path}
                        useInterceptor={additionalProps.useInterceptor}
                        searchParam={additionalProps.searchParam}
                        noResultsText={additionalProps.noResultsText}
                        searchingText={additionalProps.searchingText}
                        primaryKey={additionalProps.primaryKey}
                        secondaryKey={additionalProps.secondaryKey}
                        thumbnailKey={additionalProps.thumbnailKey}

                        {...commonStyle}
                        {...conditionalStyle}
                    />
                );
            case 'checkbox':
                return (
                    <CheckboxField
                        checked={Boolean(formValues[name])}
                        onChange={(checked: boolean) => handleFieldChange(name, checked)}
                        label={label}
                        description={description}
                        {...commonStyle}
                        {...conditionalStyle}
                    />
                );
            case 'checkboxGroup':
                return (
                    <CheckboxGroupField
                        label={label}
                        description={description}
                        selectedValues={formValues[name] || []}
                        onChange={(values: any[]) => handleFieldChange(name, values)}
                        options={additionalProps.options}
                        renderOption={additionalProps.useDynamicRenderOption ? renderCheckboxOption : undefined}
                        containerStyle={commonStyle.containerStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );
            case 'number':
                return (
                    <NumberField
                        label={label}
                        description={description}
                        value={formValues[name] || 0}
                        onChange={(value: number) => handleFieldChange(name, value)}
                        decimalPlaces={additionalProps.decimalPlaces}
                        min={additionalProps.min}
                        max={additionalProps.max}
                        step={additionalProps.step}
                        containerStyle={commonStyle.containerStyle}
                        inputStyle={additionalProps.inputStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );
            case 'date':
                return (
                    <DateField
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        onChange={(value: string) => handleFieldChange(name, value)}
                        minDate={additionalProps.minDate}
                        maxDate={additionalProps.maxDate}
                        containerStyle={commonStyle.containerStyle}
                        inputStyle={additionalProps.inputStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );
            case 'dateTime':
                return (
                    <DateTimeField
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        onChange={(value: string) => handleFieldChange(name, value)}
                        minDateTime={additionalProps.minDateTime}
                        maxDateTime={additionalProps.maxDateTime}
                        containerStyle={commonStyle.containerStyle}
                        inputStyle={additionalProps.inputStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );
            case 'time':
                return (
                    <TimeField
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        onChange={(value: string) => handleFieldChange(name, value)}
                        step={additionalProps.step}
                        containerStyle={commonStyle.containerStyle}
                        inputStyle={additionalProps.inputStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );
            case 'monthYear':
                return (
                    <MonthYearField
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        onChange={(value: string) => handleFieldChange(name, value)}
                        minMonthYear={additionalProps.minMonthYear}
                        maxMonthYear={additionalProps.maxMonthYear}
                        containerStyle={commonStyle.containerStyle}
                        inputStyle={additionalProps.inputStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );
            case 'year':
                return (
                    <YearField
                        label={label}
                        description={description}
                        value={formValues[name] || ''}
                        onChange={(value: number) => handleFieldChange(name, value)}
                        minYear={additionalProps.minYear}
                        maxYear={additionalProps.maxYear}
                        step={additionalProps.step}
                        containerStyle={commonStyle.containerStyle}
                        inputStyle={additionalProps.inputStyle}
                        labelStyle={commonStyle.labelStyle}
                        descriptionStyle={commonStyle.descriptionStyle}
                        {...additionalProps}
                    />
                );


            default:
                return null;
        }
    };

    const getFieldSizeStyle = (size: number | undefined) => {
        const columnSize = isMobile ? 100 : size ? (size / 12) * 100 : 100;
        return {
            flexBasis: `${columnSize}%`,
            maxWidth: `${columnSize}%`,
        };
    };

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
                        ...bodyStyle,
                    }}
                >
                    {fields.map((field, index) => (
                        <Fragment key={index}>
                            {shouldShowField(field) && (
                                <div
                                    className='field-wrapper'
                                    style={{
                                        ...getFieldSizeStyle(field.size),
                                        padding: '5px 5px',
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {renderField(field)}
                                </div>
                            )}
                        </Fragment>
                    ))}
                </div>
                {(mode === 'create' || mode === 'globalEdit' || mode === 'submit') && (

                    <>
                        {sendButtonTitle ? (
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
                                    title={sendButtonTitle}
                                    titleStyle={sendButtonTitleStyle}
                                    style={{
                                        marginTop: 10,
                                        ...sendButtonStyle
                                    }}
                                    type={sendButtonType}
                                    size={sendButtonSize}
                                    color={sendButtonColor}
                                    //disabled={true}
                                    disabled={processing}
                                />
                            </div>
                        ) : (
                            <Portal>
                                <div
                                    style={{
                                        position: 'fixed',
                                        bottom: 20,
                                        right: 20,
                                        zIndex: 1000,
                                        ...sendButtonWrapperStyle
                                    }}
                                >
                                    <IconButton
                                        onClick={() => handleSubmit()}
                                        icon={sendButtonIcon || 'check'}
                                        iconPaths={sendButtonIconPaths}
                                        iconSize={sendButtonIconSize}
                                        style={sendButtonStyle}
                                        type={sendButtonType}
                                        size={sendButtonSize}
                                        color={sendButtonColor}
                                        disabled={processing}
                                    />
                                </div>
                            </Portal>
                        )}

                    </>


                )}
            </form>

        </>

    );
};

export default DynamicForm;
