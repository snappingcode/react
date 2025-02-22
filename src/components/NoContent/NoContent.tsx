import React from 'react';
import { themeColors } from '../../config';
import Icon from '../Icon/Icon';
import DynamicIcon from '../DynamicIcon/DynamicIcon';

interface NoContentProps {
    containerStyle?: React.CSSProperties;
    iconStyle?: React.CSSProperties;
    messageStyle?: React.CSSProperties;
    icon?: string;
    iconPaths?: any[];
    iconSize?: number;
    iconColor?: string;
    message: string;
}

const resolveIcon = (
    icon: string | undefined,
    paths?: any[],
    size?: number,
    color?: string,
    style?: React.CSSProperties
) => {
    if (icon) {
        return <Icon name={icon} size={size} color={color} style={style} />;
    } else if (paths) {
        return <DynamicIcon paths={paths} size={size} style={style} />;
    }
    return null;
};

const NoContent: React.FC<NoContentProps> = ({
    containerStyle,
    iconStyle,
    messageStyle,
    icon,
    iconPaths,
    iconSize = 60,
    iconColor = themeColors.textTint,
    message,
}) => {
    return (
        <div style={{ textAlign: 'center', padding: '20px', ...containerStyle }}>
            {resolveIcon(icon, iconPaths, iconSize, iconColor, iconStyle)}
            <p style={{

                fontSize: '16px',
                color: themeColors.text,
                fontWeight: '300',
                padding: 0,
                //paddingTop: 10,
                margin: 0,
                marginTop: 5,
                ...messageStyle
            }}>
                {message}
            </p>
        </div>
    );
};

export default NoContent;
