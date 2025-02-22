
import React from 'react';
import Button from '../buttons/Button/Button';
import { themeColors } from '../../config';
import Icon from '../Icon/Icon';

// Define the interface for breadcrumb items
interface BreadcrumbItem {
    name: string;
    displayName: string;
    icon?: string | null;
    color?: string;
}

interface BreadcrumbsProps {
    path: BreadcrumbItem[];
    onNavigate: (item: BreadcrumbItem, index: number) => void;
    containerStyle?: React.CSSProperties;
    buttonStyle?: React.CSSProperties;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate, containerStyle }) => {
    return (
        <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexWrap: 'wrap',
            ...containerStyle
        }}>
            {path.map((item, index) => (
                <React.Fragment key={item.name}>
                    {index === path.length - 1 ? (
                        // Current item is not clickable
                        <span style={{
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            top: -1
                        }}>
                            {item.icon && <Icon style={{
                                marginRight: 5
                            }} name={item.icon} />}
                            {item.displayName}
                        </span>
                    ) : (
                        // Clickable breadcrumb items
                        <Button
                            title={item.displayName}
                            onClick={() => onNavigate(item, index)}
                            type="clear"
                            hasShadow={false}
                            startIcon={item.icon ? item.icon : undefined}
                            startIconStyle={{
                                marginRight: 5
                            }}
                            color={themeColors.text}
                            size='md'
                            style={{
                                padding: 0
                            }}
                            titleStyle={{
                                position: 'relative',
                                top: 0,
                                margin: 0
                            }}
                        />
                    )}
                    {index < path.length - 1 && <span style={{
                        margin: '0 4px',
                        position: 'relative',
                        top: -2,
                        //left: -2
                    }}> &gt; </span>}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
