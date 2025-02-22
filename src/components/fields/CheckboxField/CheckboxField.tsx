import React from 'react';
import { themeColors } from '../../../config';
import Icon from '../../Icon/Icon';



interface CheckboxFieldProps {
    label?: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bodyStyle?: React.CSSProperties;

    className?: string;
    id?: string;
    iconSize?: number;
    iconColor?: string;
    checkedIconPaths?: { d: string; color?: string }[];
    uncheckedIconPaths?: { d: string; color?: string }[];
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
    label,
    description,
    checked,
    onChange,
    containerStyle,
    labelStyle,
    descriptionStyle,
    headerStyle,
    bodyStyle,
    className,
    id,
    iconSize = 34,
    iconColor = 'primary',
    checkedIconPaths,
    uncheckedIconPaths,
}) => {
    return (
        <div
            id={id}
            className={`checkbox-field-container ${className}`}
            style={{
                backgroundColor: themeColors.light,
                borderRadius: "10px",
                padding: 10,
                //paddingTop: 0,
                position: "relative",
                ...containerStyle
            }}

        >
            <div className={'field-header'}
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: "100%",
                    padding: "3px",
                    position: "relative",
                    boxSizing: "border-box",
                    ...headerStyle
                }}
            >

            </div>
            <div
                className={'field-body'}
                style={{
                    padding: "5px 10px 10px 10px",
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "nowrap",
                    alignItems: "center",
                    cursor: "pointer",
                    ...bodyStyle
                }}
                onClick={() => onChange(!checked)}
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onChange(!checked);
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        flexDirection: "column",
                        paddingRight: 10
                    }}
                >
                    <label style={{
                        cursor: 'pointer',
                        color: themeColors.text,
                        fontWeight: 'bold',
                        ...labelStyle
                    }}>{label}</label>
                    {description && <p style={{
                        cursor: 'pointer',
                        fontWeight: 300,
                        fontStyle: "italic",
                        display: "block",
                        padding: "0px 3px",
                        margin: 0,
                        color: themeColors.textTint,
                        fontSize: ".9em",
                        ...descriptionStyle
                    }}>{description}</p>}
                </div>

                <Icon
                    name={checked ? 'checkboxChecked' : 'checkboxUnchecked'}
                    color={iconColor}
                    size={iconSize}
                    paths={checked ? checkedIconPaths : uncheckedIconPaths}
                />
            </div>
        </div>
    );
};

export default CheckboxField;