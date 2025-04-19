import React from 'react'
import { themeColors } from '../../config';
import EditFieldControls from '../EditFieldControls/EditFieldControls';

interface FieldContainerProps {
    label?: string;
    description?: string;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    className?: string;
    showEditFieldControls?: boolean;
    children?: React.ReactNode;
    name?: string;
    value?: any;
    tempValue?: any;
    onChange?: (newValue: string) => void;
    onEditStart?: () => void;
    onEditSuccess?: (updatedValue: any) => void;
    onEditError?: (error: any) => void;
    onEditCancel?: () => void;
    savePath?: string;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    editIcon?: string;
    saveIcon?: string;
    cancelIcon?: string;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
    label,
    description,
    containerStyle,
    headerStyle,
    bodyStyle,
    labelStyle,
    descriptionStyle,
    className,
    showEditFieldControls = false,
    name = "",
    value,
    tempValue,
    children,
    onEditStart,
    onEditSuccess,
    onEditError,
    onEditCancel,
    savePath,
    apiBaseUrl,
    useAuthToken = false,
    editIcon = "pencil",
    saveIcon = "check",
    cancelIcon = "close",

}) => {

    return (
        <div
            className={className}
            style={{
                backgroundColor: themeColors.light,
                borderRadius: 10,
                padding: "5px 10px 10px 10px",
                ...containerStyle
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                padding: 5,
                position: 'relative',
                ...headerStyle
            }}>
                <span style={{
                    fontWeight: '600',
                    color: themeColors.text,
                    ...labelStyle
                }}>
                    {label}
                </span>

                {
                    showEditFieldControls ?
                        <EditFieldControls
                            initialValue={value}
                            editedValue={tempValue}
                            fieldName={name}
                            onEditStart={onEditStart}
                            onEditSuccess={onEditSuccess}
                            onEditError={onEditError}
                            onEditCancel={onEditCancel}
                            savePath={savePath}
                            apiBaseUrl={apiBaseUrl}
                            useAuthToken={useAuthToken}
                            editIcon={editIcon}
                            saveIcon={saveIcon}
                            cancelIcon={cancelIcon}
                            containerStyle={{
                                position: 'absolute',
                                right: -9,
                                top: -3
                            }}
                        /> : <></>
                }
            </div>
            <div style={{
                //padding: '10px',
                ...bodyStyle
            }}>
                {children}
                {description ? <p
                    style={{
                        fontWeight: 300,
                        fontStyle: 'italic',
                        display: 'block',
                        padding: '3px',
                        margin: 0,
                        color: themeColors.textTint,
                        fontSize: '.9em',
                        ...descriptionStyle,
                    }}
                >{description}</p> : <></>}
            </div>
        </div>
    )
}

export default FieldContainer