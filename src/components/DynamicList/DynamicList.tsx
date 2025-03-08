import React, { useState, useEffect } from 'react';
import PillGroup from '../PillGroup/PillGroup';
import { themeColors } from '../../config';
import { httpClient, securedHttpClient } from '../../httpClient';
import Icon from '../Icon/Icon';
import Color from '../Color/Color';
import IconButton from '../buttons/IconButton/IconButton';
import Thumbnail from '../Thumbnail/Thumbnail';
import InterpolatedContent from '../InterpolatedContent/InterpolatedContent';
import StepTracker from '../StepTracker/StepTracker';
import ActionsMenuButton from '../buttons/ActionsMenuButton/ActionsMenuButton';
import SortableHandle from '../Sortable/SortableHandle';
import Loader from '../Loader/Loader';
import SortableContainer from '../Sortable/SortableContainer';
import LockToggleButton from '../buttons/LockToggleButton/LockToggleButton';
import CopyButton from '../buttons/CopyButton/CopyButton';
import NoContent from '../NoContent/NoContent';
import Button from '../buttons/Button/Button';

interface SlotConfig {
    type: string;
    name: string;
    label: string;
    config?: Record<string, any>;
}

interface DynamicListProps {
    className?: string;
    containerStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    startSlots?: SlotConfig[];
    endSlots?: SlotConfig[];
    data?: any[] | null;
    apiBaseUrl?: string;
    useSecureConnection?: boolean;
    endpoint?: string;
    displayMode?: 'row' | 'grid';
    noContentText?: string;
    noContentIcon?: string;
    forceRefresh?: boolean;
    isSortable?: boolean;
    isClickable?: boolean;
    renderItem?: (item: any, index: number) => React.ReactNode;
    onActionClick?: (actionData: any, itemData: any) => void;
    onOrderChange?: (newOrder: any[]) => void;
    onItemChangeSuccess?: (item: any, fieldName: string, newValue: boolean) => void;
    onItemChangeError?: (item: any, fieldName: string, error: any) => void;
    onItemClick?: (item: any, index: number) => void;
}

const DynamicList: React.FC<DynamicListProps> = ({
    className,
    containerStyle,
    itemStyle,
    startSlots = [],
    endSlots = [],
    data = null,
    apiBaseUrl,
    useSecureConnection = false,
    noContentText = 'No content available',
    noContentIcon = 'records',
    endpoint,
    isSortable = false,
    isClickable = false,
    renderItem: customRenderItem,
    onOrderChange,
    onActionClick,
    onItemChangeSuccess,
    onItemChangeError,
    onItemClick,
}) => {
    const [items, setItems] = useState<any[]>(data || []);
    const [loading, setLoading] = useState<boolean>(!data);

    useEffect(() => {
        const fetchData = async () => {
            if (data || !endpoint) return;

            setLoading(true);

            try {
                const client = useSecureConnection ? securedHttpClient : httpClient;

                if (apiBaseUrl) {
                    client.setBaseURL(apiBaseUrl);
                }

                const response = await client.get(endpoint);
                setItems(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [data, apiBaseUrl, useSecureConnection, endpoint]);

    const handleSortEnd = (newOrder: any[]) => {
        setItems(newOrder);
        if (onOrderChange) onOrderChange(newOrder);
    };

    const resolveSlotComponent: any = (type: string) => {
        switch (type) {
            case 'text':
                return Text;
            case 'icon':
                return Icon;
            case 'color':
                return Color;
            case 'lockToggleButton':
                return LockToggleButton;
            case 'actionButton':
                return IconButton;
            case 'copyButton':
                return CopyButton;
            case 'button':
                return Button;
            case 'thumbnail':
                return Thumbnail;
            case 'interpolatedContent':
                return InterpolatedContent;
            case 'stepTracker':
                return StepTracker;
            case 'actionsMenu':
                return ActionsMenuButton;
            case 'pillGroup':
                return PillGroup;
            default:
                throw new Error(`Unknown slot type: ${type}`);
        }
    };

    const defaultRenderItem = (item: any, index: number) => (
        <div
            key={`item-${item.id}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '5px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                marginBottom: '10px',
                marginTop: '5px',
                cursor: isClickable ? 'pointer' : 'default',
                filter: "drop-shadow(0 2px 0 #ccc)",
                //boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                ...itemStyle,
            }}
            className="precooked-dynamic-list-item"
            onClick={() => {
                if (isClickable && onItemClick) {
                    onItemClick(item, index);
                }
            }}
        >
            {/* Left section */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isSortable && (
                    <SortableHandle>
                        <Icon name="drag" />
                    </SortableHandle>
                )}
                {startSlots.map((slot, slotIndex) => {
                    const SlotComponent = resolveSlotComponent(slot.type);
                    const resolvedSrc = item[slot.name] ? item[slot.name] : slot?.config?.defaultImage;
                    const resolvedType = slot.type === 'actionButton' ? 'clear' : slot?.config?.type;
                    return (
                        <div key={slotIndex} style={{ padding: 5 }}>
                            <SlotComponent
                                src={resolvedSrc}
                                pills={item[slot.name]}
                                steps={item[slot.name]}
                                value={item[slot.name]}
                                textToCopy={item[slot.name]}
                                name={slot.name}
                                extraData={item}
                                icon={slot?.config?.icon}
                                activeIcon={slot?.config?.activeIcon}
                                inactiveIcon={slot?.config?.inactiveIcon}
                                activeColor={slot?.config?.activeColor}
                                inactiveColor={slot?.config?.inactiveColor}
                                endpoint={slot?.config?.endpoint}
                                useSecureConnection={slot?.config?.useSecureConnection}
                                type={resolvedType}
                                hasShadow={false}
                                color={themeColors.text}
                                onChangeSuccess={(newValue: any) =>
                                    onItemChangeSuccess?.(item, slot.name, newValue)
                                }
                                onChangeError={(error: any) =>
                                    onItemChangeError?.(item, slot.name, error)
                                }
                                onClick={() => {
                                    onActionClick?.(slot?.config, item)
                                }}
                                {...slot.config}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Right section */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {endSlots.map((slot, slotIndex) => {
                    const SlotComponent = resolveSlotComponent(slot.type);
                    const resolvedSrc = item[slot.name] ? item[slot.name] : slot?.config?.defaultImage;
                    const resolvedType = slot.type === 'actionButton' ? 'clear' : slot?.config?.type;
                    return (
                        <div key={slotIndex} style={{ padding: 5 }}>
                            <SlotComponent
                                src={resolvedSrc}
                                pills={item[slot.name]}
                                steps={item[slot.name]}
                                value={item[slot.name]}
                                textToCopy={item[slot.name]}
                                name={slot.name}
                                extraData={item}
                                activeIcon={slot?.config?.activeIcon}
                                inactiveIcon={slot?.config?.inactiveIcon}
                                activeColor={slot?.config?.activeColor}
                                inactiveColor={slot?.config?.inactiveColor}
                                endpoint={slot?.config?.endpoint}
                                useSecureConnection={slot?.config?.useSecureConnection}
                                type={resolvedType}
                                hasShadow={false}
                                color={themeColors.text}
                                onChangeSuccess={(newValue: any) =>
                                    onItemChangeSuccess?.(item, slot.name, newValue)
                                }
                                onChangeError={(error: any) =>
                                    onItemChangeError?.(item, slot.name, error)
                                }
                                onClick={() => {
                                    onActionClick?.(slot?.config, item)
                                }}
                                {...slot.config}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderItem = customRenderItem || defaultRenderItem;

    if (loading) {
        return <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40
        }}>
            <Loader color='primary' />
        </div>;
    }

    return isSortable ? (
        <SortableContainer
            items={items}
            onSortEnd={handleSortEnd}
            renderItem={renderItem}
            useDragHandle={true}
        />
    ) : (
        <div style={containerStyle} className={className}>
            {
                items.length > 0 ? <>
                    {items.map((item, index) => renderItem(item, index))}
                </> :
                    <div style={{}}>
                        <NoContent icon={noContentIcon} message={noContentText} iconColor={themeColors.textTint} />
                    </div>
            }

        </div>
    );
};

export default DynamicList;