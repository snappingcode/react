import React, { useEffect, useId, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import ConfigurationGroupBuilderModal from '../../modals/ConfigurationGroupBuilderModal/ConfigurationGroupBuilderModal';
import Button from '../../buttons/Button/Button';


interface EditableConfigurationGroupFieldProps {
    label?: string;
    description?: string;
    name: string;
    value: any;
    onChange?: (items: any[]) => void;
    onEditStart?: () => void;
    onEditSuccess?: (updatedValue: any) => void;
    onEditError?: (error: any) => void;
    onEditCancel?: () => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    savePath: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    editIcon?: string;
    saveIcon?: string;
    cancelIcon?: string;
    configurationGroup: 'fields' | 'slots' | 'filters' | 'headerActions' | 'listActions' | 'dividerGroups' | 'importCols' | 'exportCols';
    modalTitle?: string;
    modalSubtitle?: string;

}

const EditableConfigurationGroupField: React.FC<EditableConfigurationGroupFieldProps> = ({
    label,
    description,
    name,
    value = [],
    onChange,
    onEditStart,
    onEditSuccess,
    onEditError,
    onEditCancel,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    savePath,
    apiBaseUrl,
    useAuthToken = false,
    editIcon = "pencil",
    saveIcon = "check",
    cancelIcon = "close",
    configurationGroup,
    modalTitle = "",
    modalSubtitle = ""

}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    //const initialValue = useRef(value);
    const [configurationGroupBuilderModalIsOpen, setConfigurationGroupBuilderModalIsOpen] = useState(false);
    const modalId = useId();
    const safeModalId = `configuration-builder-modal${modalId.replace(/:/g, '-')}`.replace(/^-|-$/g, '');

    const handleEditStart = () => {
        setIsEditing(true);
        onEditStart?.();
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        setTempValue(value);
        onEditCancel?.();
    };

    const handleEditError = (error: any) => {
        setIsEditing(false);
        setTempValue(value);
        if (onEditError) onEditError(error);
    };

    const handleEditSuccess = (updatedValue: any) => {
        console.log(updatedValue);
        setIsEditing(false);
        setTempValue(updatedValue);
        onChange?.(updatedValue);
        onEditSuccess?.(updatedValue);
    };


    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(tempValue)) {
            console.log('change value', value);
            setTempValue(value);
        }
    }, [value]);
    return (
        <FieldContainer
            label={label}
            labelStyle={{
                ...labelStyle
            }}
            name={name}
            value={value}
            tempValue={tempValue}
            description={description}
            descriptionStyle={descriptionStyle}
            showEditFieldControls
            onEditStart={handleEditStart}
            onEditSuccess={handleEditSuccess}
            onEditError={handleEditError}
            onEditCancel={handleEditCancel}
            savePath={savePath}
            apiBaseUrl={apiBaseUrl}
            useAuthToken={useAuthToken}
            editIcon={editIcon}
            saveIcon={saveIcon}
            cancelIcon={cancelIcon}
            containerStyle={{
                ...containerStyle,
            }}
            headerStyle={headerStyle}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'nowrap',
                    alignItems: 'center',
                    cursor: 'pointer',
                }}
            >
                {
                    isEditing ?
                        <div
                            className="field-body"
                            style={{
                                padding: '5px 10px 10px 10px',
                                width: '100%',
                                ...bodyStyle,
                            }}
                        >
                            <div style={{
                                marginBottom: 5,
                                fontSize: 14,
                            }}>
                                <strong>Cantidad de items:</strong>
                                <span style={{
                                    marginLeft: 5
                                }}>{tempValue?.length | 0}</span>
                            </div>

                            <Button
                                startIcon='tools'
                                title='Abrir armador'
                                onClick={() => {
                                    setConfigurationGroupBuilderModalIsOpen(true);
                                }}
                                hasShadow={false}
                                type='clear'
                                size='md'
                                style={{

                                }}
                            />

                        </div> :
                        <div
                            className="field-body"
                            style={{
                                padding: '5px 10px 10px 10px',
                                width: '100%',
                                ...bodyStyle,
                            }}
                        >
                            <div style={{
                                marginBottom: 5,
                                fontSize: 14,
                            }}>
                                <strong>Cantidad de items:</strong>
                                <span style={{
                                    marginLeft: 5
                                }}>{tempValue?.length | 0}</span>
                            </div>

                        </div>
                }
                {/* {JSON.stringify(tempValue)} */}
            </div>
            <ConfigurationGroupBuilderModal
                id={`${safeModalId}`}
                title={modalTitle}
                subtitle={modalSubtitle}
                isOpen={configurationGroupBuilderModalIsOpen}
                onClose={(data) => {
                    //if (data) onChange(data);
                    if (data) setTempValue(data);
                    setConfigurationGroupBuilderModalIsOpen(false);
                }}
                fullScreen={true}
                configurationGroup={configurationGroup}
                data={tempValue}
            />
        </FieldContainer>

    )
}

export default EditableConfigurationGroupField