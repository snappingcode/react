// FieldRenderer.tsx
import React from 'react';
import { getNestedValue } from '../../utils/nestedValues';
import interpolateString from '../../utils/interpolateString';
import EditableTextField from '../editable-fields/EditableTextField/EditableTextField';
import EditableRadioField from '../editable-fields/EditableRadioField/EditableRadioField';
import EditableIconPickerField from '../editable-fields/EditableIconPickerField/EditableIconPickerField';
import EditableDynamicListField from '../editable-fields/EditableDynamicListField/EditableDynamicListField';
import EditableColorField from '../editable-fields/EditableColorField/EditableColorField';
import EditablePastelColorField from '../editable-fields/EditablePastelColorField/EditablePastelColorField';
import EditableConfigurationGroupField from '../editable-fields/EditableConfigurationGroupField/EditableConfigurationGroupField';
import ReadOnlyTextField from '../read-only-fields/ReadOnlyTextField/ReadOnlyTextField';
import ReadOnlyRadioField from '../read-only-fields/ReadOnlyRadioField/ReadOnlyRadioField';
import TextField from '../fields/TextField/TextField';
import PasswordField from '../fields/PasswordField/PasswordField';
import RadioField from '../fields/RadioField/RadioField';
import IconPickerField from '../fields/IconPickerField/IconPickerField';
import ConfigurationGroupField from '../fields/ConfigurationGroupField/ConfigurationGroupField';
import PastelColorField from '../fields/PastelColorField/PastelColorField';
import ColorField from '../fields/ColorField/ColorField';
import DynamicListField from '../fields/DynamicListField/DynamicListField';
import AutocompleteField from '../fields/AutocompleteField/AutocompleteField';
import MoneyField from '../fields/MoneyField/MoneyField';
import CheckboxField from '../fields/CheckboxField/CheckboxField';

interface Field {
    type: string;
    label?: string;
    name: string;
    config?: Record<string, any>;
    value?: any;
}

interface FieldRendererParams {
    field: Field;
    formValues: Record<string, any>;
    mode: string;
    apiBaseUrl?: string;
    fieldContainerStyle?: React.CSSProperties;
    fieldLabelStyle?: React.CSSProperties;
    fieldDescriptionStyle?: React.CSSProperties;
    fieldHeaderStyle?: React.CSSProperties;
    fieldBodyStyle?: React.CSSProperties;
    onFieldEditSuccess?: (field: any, fieldValue: any, formData: Record<string, any>) => void;
    onFieldEditError?: (field: any, error: any) => void;
    handleFieldChange: (name: string, value: any) => void;
    renderRadioOption?: (option: any, isClickable?: boolean, index?: number, isActive?: boolean) => React.ReactNode;
}

export const renderField = ({
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
}: FieldRendererParams) => {
    // lógica actual de renderField...
    const {
        type,
        label,
        name,
        config
        //...additionalProps
    } = field;

    const commonStyle = {
        containerStyle: { ...fieldContainerStyle, ...config?.containerStyle },
        // headerStyle: { ...fieldHeaderStyle, ...config?.headerStyle },
        // bodyStyle: { ...fieldBodyStyle, ...config?.bodyStyle },
        labelStyle: { ...fieldLabelStyle, ...config?.labelStyle },
        descriptionStyle: { ...fieldDescriptionStyle, ...config?.descriptionStyle },
    };
    const interpolatedSavePath = formValues.id ? interpolateString(formValues, config?.savePath) : "";
    if (mode === "edit") {
        console.log(type, config)
        if (config?.readOnlyInEdit) {
            switch (type) {
                case "text":
                    return <ReadOnlyTextField {...commonStyle} value={formValues[name]} label={label} />;
                case "radio":
                    return <ReadOnlyRadioField
                        {...commonStyle}
                        value={formValues[name]}
                        label={label}
                        options={config?.options}
                        renderOption={renderRadioOption}
                    />;

                default:
                    return null;
            }
        }
        switch (type) {
            case "text":
                return <EditableTextField
                    {...commonStyle}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    value={formValues[name]}
                    onChange={(value: any) => handleFieldChange(name, value)}
                    name={name}
                    onEditSuccess={(newValue) => {
                        console.log(newValue);
                        onFieldEditSuccess?.(field, newValue, formValues);
                        //onSuccess?.(formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                />;
            case "radio":
                return <EditableRadioField
                    {...commonStyle}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    value={formValues[name]}
                    onChange={(value: any) => handleFieldChange(name, value)}
                    name={name}
                    onEditSuccess={(newValue) => {
                        console.log(newValue);
                        onFieldEditSuccess?.(field, newValue, formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                    options={config?.options}
                    renderOption={renderRadioOption}
                />;
            case "iconPicker":
                return <EditableIconPickerField
                    {...commonStyle}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    value={formValues[name]}
                    onChange={(value: any) => handleFieldChange(name, value)}
                    name={name}
                    onEditSuccess={(newValue) => {
                        console.log(newValue);
                        onFieldEditSuccess?.(field, newValue, formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                />;
            case "dynamicList":
                return <EditableDynamicListField
                    {...commonStyle}
                    //value={getNestedValue(formValues, name)}
                    value={formValues[name]}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    onChange={(value) => handleFieldChange(name, value)}
                    bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                    headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                    slots={config?.slots}
                    forceMobileView={config?.forceMobileView}
                    name={name}
                    onEditSuccess={(newValue) => {
                        onFieldEditSuccess?.(field, newValue, formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                />;
            case "color":
                return <EditableColorField
                    {...commonStyle}
                    //value={getNestedValue(formValues, name)}
                    value={formValues[name]}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    onChange={(value) => handleFieldChange(name, value)}
                    bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                    headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                    disablePrimary={config?.disablePrimary}
                    name={name}
                    onEditSuccess={(newValue) => {
                        onFieldEditSuccess?.(field, newValue, formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                />;
            case "pastelColor":
                return <EditablePastelColorField
                    {...commonStyle}
                    //value={getNestedValue(formValues, name)}
                    value={formValues[name]}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    onChange={(value) => handleFieldChange(name, value)}
                    bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                    headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                    name={name}
                    onEditSuccess={(newValue) => {
                        onFieldEditSuccess?.(field, newValue, formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                />;
            case "configurationGroup":
                return <EditableConfigurationGroupField
                    {...commonStyle}
                    value={getNestedValue(formValues, name)}
                    //value={formValues[name]}
                    label={label}
                    apiBaseUrl={apiBaseUrl}
                    useAuthToken={true}
                    savePath={interpolatedSavePath}
                    onChange={(value) => handleFieldChange(name, value)}
                    bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                    headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                    name={name}
                    onEditSuccess={(newValue) => {
                        onFieldEditSuccess?.(field, newValue, formValues);
                    }}
                    onEditError={(error) => {
                        onFieldEditError?.(field, error);
                    }}
                    configurationGroup={config?.configurationGroup}

                    modalTitle={config?.modalTitle}
                    modalSubtitle={config?.modalSubtitle}

                />;
            default:
                return null;
        }
    }

    if (mode === "readOnly") {
        switch (type) {
            case "text":
                return <ReadOnlyTextField
                    {...commonStyle}
                    value={formValues[name]}
                    label={label}
                />;
            case "radio":
                return <ReadOnlyRadioField
                    {...commonStyle}
                    value={formValues[name]}
                    label={label}
                    options={config?.options}
                    renderOption={renderRadioOption}
                />;
            default:
                return null;
        }
    }

    // Caso por defecto: modo "create", "globalEdit" o "submit"
    switch (type) {
        case "text":
            return <TextField
                {...commonStyle}
                value={getNestedValue(formValues, name) || ''}
                placeholder={config?.placeholder}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                description={config?.description}
            />;
        case "money":
            return <MoneyField
                {...commonStyle}
                value={getNestedValue(formValues, name) || ''}
                placeholder={config?.placeholder}
                currencySymbol={config?.currencySymbol}
                symbolPosition={config?.symbolPosition}
                symbolStyle={config?.symbolStyle}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                description={config?.description}
            />;
        case "password":
            return <PasswordField
                {...commonStyle}
                //value={getNestedValue(formValues, name) || ''}
                value={formValues[name] || ''}
                placeholder={config?.placeholder}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                description={config?.description}
            />;
        case "checkbox":
            return <CheckboxField
                {...commonStyle}
                //value={getNestedValue(formValues, name) || ''}
                value={formValues[name] || false}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                description={config?.description}
            />;
        case "radio":
            return <RadioField
                {...commonStyle}
                value={getNestedValue(formValues, name)}
                label={label}
                options={config?.options}
                onChange={(value) => handleFieldChange(name, value)}
                renderOption={renderRadioOption}
                bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                description={config?.description}
            />;
        case "iconPicker":
            return <IconPickerField
                {...commonStyle}
                value={getNestedValue(formValues, name)}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                description={config?.description}
            />;
        // case "configuration":
        //     return <ConfigurationField
        //         {...commonStyle}
        //         value={getNestedValue(formValues, name)}
        //         label={label}
        //         onChange={(value) => handleFieldChange(name, value)}
        //         configurationGroup={config?.configurationGroup}
        //         modalTitle={config?.modalTitle}
        //         modalSubtitle={config?.modalSubtitle}
        //         bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
        //         headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
        //     />;
        case "configurationGroup":
            return <ConfigurationGroupField
                {...commonStyle}
                value={getNestedValue(formValues, name) || []}
                //value={formValues[name]}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                configurationGroup={config?.configurationGroup}
                modalTitle={config?.modalTitle}
                modalSubtitle={config?.modalSubtitle}
                bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                description={config?.description}
            />;
        case "pastelColor":
            return <PastelColorField
                {...commonStyle}
                value={getNestedValue(formValues, name)}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                description={config?.description}
            />;
        case "color":
            return <ColorField
                {...commonStyle}
                value={getNestedValue(formValues, name)}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                description={config?.description}
            />;
        case "dynamicList":
            return <DynamicListField
                {...commonStyle}
                value={getNestedValue(formValues, name)}
                label={label}
                onChange={(value) => handleFieldChange(name, value)}
                bodyStyle={{ ...fieldBodyStyle, ...config?.bodyStyle }}
                headerStyle={{ ...fieldHeaderStyle, ...config?.headerStyle }}
                slots={config?.slots}
                forceMobileView={config?.forceMobileView}
                description={config?.description}
            />;
        case "autocomplete":
            return <AutocompleteField
                {...commonStyle}
                value={getNestedValue(formValues, name)}
                label={label}
                labelStyle={config?.labelStyle}
                onChange={(value) => handleFieldChange(name, value)}
                multiple={config?.multiple}
                apiBaseUrl={config?.apiBaseUrl || apiBaseUrl || ''}
                path={config?.path}
                placeholder={config?.placeholder}
                itemLabelKey={config?.itemLabelKey}
                itemLabelStyle={config?.itemLabelStyle}
                itemDescriptionKey={config?.itemDescriptionKey}
                itemDescriptionStyle={config?.itemDescriptionStyle}
                itemImageKey={config?.itemImageKey}
                itemImageStyle={config?.itemImageStyle}
                searchParam={config?.searchParam}
                description={config?.description}
            />;
        default:
            return null;
    }
};
