import React, { useId, useState } from 'react';
import FieldContainer from '../../FieldContainer/FieldContainer';
import ConfigurationGroupBuilderModal from '../../modals/ConfigurationGroupBuilderModal/ConfigurationGroupBuilderModal';
import Button from '../../buttons/Button/Button';

interface ConfigurationGroupFieldProps {
    label?: string;
    description?: string;
    value: any;
    onChange: (value?: any) => void;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    configurationGroup: 'fields' | 'slots' | 'filters' | 'headerActions' | 'listActions' | 'dividerGroups' | 'importCols' | 'exportCols';
    modalTitle?: string;
    modalSubtitle?: string;
    //id?: string;
}

const ConfigurationGroupField: React.FC<ConfigurationGroupFieldProps> = ({
    label,
    description,
    value,
    onChange,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
    configurationGroup,
    modalTitle = "",
    modalSubtitle = ""
}) => {
    const [configurationGroupBuilderModalIsOpen, setConfigurationGroupBuilderModalIsOpen] = useState(false);
    const modalId = useId();
    const safeModalId = `configuration-builder-modal${modalId.replace(/:/g, '-')}`.replace(/^-|-$/g, '');

    return (
        <>
            <FieldContainer
                label={label}
                labelStyle={{
                    ...labelStyle,
                }}
                description={description}
                descriptionStyle={descriptionStyle}
                containerStyle={{
                    ...containerStyle,
                }}
                headerStyle={{
                    ...headerStyle
                }}
                className={className}
            >
                <div
                    className={'field-body'}
                    style={{
                        padding: '5px 10px 10px 10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
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
                        }}>{value?.length | 0}</span>
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
                </div>
                <ConfigurationGroupBuilderModal
                    id={`${safeModalId}`}
                    title={modalTitle}
                    subtitle={modalSubtitle}
                    isOpen={configurationGroupBuilderModalIsOpen}
                    onClose={(data) => {
                        if (data) onChange(data);
                        setConfigurationGroupBuilderModalIsOpen(false);
                    }}
                    fullScreen={true}
                    configurationGroup={configurationGroup}
                    data={value}
                />
            </FieldContainer>
        </>
    );
};

export default ConfigurationGroupField;
