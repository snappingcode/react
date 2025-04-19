import React, { useState, useEffect, useRef } from 'react';
import { themeColors } from '../../config';
import { httpClient, securedHttpClient } from '../../httpClient';
import StackedThumbnails from '../StackedThumbnails/StackedThumbnails';
import TemplateRenderer from '../TemplateRenderer/TemplateRenderer';
import Money from '../Money/Money';
import SortableContainer from '../Sortable/SortableContainer';
import SortableHandle from '../Sortable/SortableHandle';
import ActionsMenuButton from '../buttons/ActionsMenuButton/ActionsMenuButton';
import ActionIconButton from '../buttons/ActionIconButton/ActionIconButton';
import interpolateString from '../../utils/interpolateString';
import Text from '../Text/Text';
import ActionButton from '../buttons/ActionButton/ActionButton';
import useIsMobile from '../../hooks/useIsMobile';
import Button from '../buttons/Button/Button';
import IconButton from '../buttons/IconButton/IconButton';
import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import NoContent from '../NoContent/NoContent';
import Thumbnail from '../Thumbnail/Thumbnail';
import { Slot } from './DynamicListSlot.types';

export interface Action {
    type: string;
    name: string;
    label: string;
    icon?: string;
    config?: {
        style?: React.CSSProperties;
        color?: string;
        onClick: (actionType: string, actionName: string) => void;
        [key: string]: any;
    };
}

interface DynamicListProps {
    className?: string;
    containerStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    startSlots?: Slot[];
    endSlots?: Slot[];
    data?: any[] | null;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    listPath?: string;
    reorderPath?: string;
    displayMode?: 'row' | 'grid';
    noContentText?: string;
    noContentIcon?: string;
    reloadTrigger?: number;
    isSortable?: boolean;
    isItemClickable?: boolean;
    breakpoint?: number;
    renderItem?: (item: any, index: number) => React.ReactNode;
    onItemActionClick?: (actionName: string, itemData: any, itemIndex?: number) => void;
    onOrderChange?: (newOrder: any[]) => void;
    onItemChangeSuccess?: (item: any, fieldName: string, newValue: boolean) => void;
    onItemChangeError?: (item: any, fieldName: string, error: any) => void;
    onItemClick?: (item: any, index: number) => void;
    onItemSlotClick?: (slot: Slot, item: any) => void;
}

const DynamicList: React.FC<DynamicListProps> = ({
    className,
    containerStyle,
    itemStyle,
    startSlots = [],
    endSlots = [],
    data = null,
    apiBaseUrl,
    useAuthToken = false,
    noContentText = 'No content available',
    noContentIcon = 'records',
    listPath,
    reorderPath,
    isSortable = false,
    isItemClickable = false,
    renderItem: customRenderItem,
    breakpoint = 800,
    reloadTrigger,
    onOrderChange,
    onItemActionClick,
    //onItemChangeSuccess,
    //onItemChangeError,
    onItemClick,
    onItemSlotClick
}) => {
    const [items, setItems] = useState<any[]>(data || []);
    const [loading, setLoading] = useState<boolean>(!data);

    const prevValues = useRef({ apiBaseUrl, useAuthToken, listPath, reloadTrigger });
    const hasFetchedInitially = useRef(false);
    const { isMobile } = useIsMobile(breakpoint);
    const fetchData = async () => {
        if (data || !listPath) return;

        setLoading(true);

        try {
            const client = useAuthToken ? securedHttpClient : httpClient;

            if (apiBaseUrl) {
                client.setBaseURL(apiBaseUrl);
            }

            const response = await client.get(listPath);
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const valuesChanged =
            prevValues.current.apiBaseUrl !== apiBaseUrl ||
            prevValues.current.useAuthToken !== useAuthToken ||
            prevValues.current.listPath !== listPath ||
            prevValues.current.reloadTrigger !== reloadTrigger;


        if (valuesChanged || !hasFetchedInitially.current) {
            console.log("Fetching data for:", listPath, hasFetchedInitially.current);

            prevValues.current = { apiBaseUrl, useAuthToken, listPath, reloadTrigger };
            hasFetchedInitially.current = true;
            fetchData();
        }
    }, [apiBaseUrl, useAuthToken, listPath, reloadTrigger]);
    useEffect(() => {
        if (data) setItems(data);
    }, [data]);


    const handleSortEnd = async (newOrder: any[]) => {
        setItems(newOrder);

        if (onOrderChange) onOrderChange(newOrder);

        if (reorderPath) {
            try {
                const client = useAuthToken ? securedHttpClient : httpClient;
                if (apiBaseUrl) client.setBaseURL(apiBaseUrl);

                const payload = newOrder.map((item) => ({ id: item.id }));
                await client.post(reorderPath, payload);
            } catch (error) {
                console.error("Error saving new order:", error);
            }
        }
    };

    const handleExportResponse = (res: any, config: any) => {
        const format = config.exportFormat || 'json';
        const filename = config.exportFileName || res?.file_name || 'exported-file';

        let blob: Blob;
        let extension: string;

        switch (format) {
            case 'csv':
                blob = new Blob([res], { type: 'text/csv' });
                extension = 'csv';
                break;
            case 'pdf':
                blob = new Blob([res], { type: 'application/pdf' });
                extension = 'pdf';
                break;
            case 'json':
            default:
                blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
                extension = 'json';
                break;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Nueva función para renderizar slots de tipo action
    const renderActionSlot = (
        slot: Slot,
        item: any,
        index: number,
        onItemSlotClick?: (slot: Slot, itemData: any, itemIndex?: number) => void,
        onItemActionClick?: (actionName: string, itemData: any, itemIndex?: number) => void
    ): React.ReactNode => {
        const config = slot.config ?? {};
        const {
            variant,
            mode,
            path,
            onClick,
            onSuccess,
            title,
            color,
            size,
            startIcon,
            endIcon,
            borderRadius,
            hasShadow,
            icon,
            iconSize,
            type,
            containerStyle,
            apiBaseUrl,
            method,
            spinnerColor,
            useAuthToken,
            actionType,
        }: any = config;

        const interpolatedPath = interpolateString(item, path);

        const handleClick = () => {
            onItemSlotClick?.(slot, item, index);
            onClick?.(slot, item, index);
        };

        const sharedProps = {
            onClick: handleClick,
            title: interpolateString(item, title),
            color,
            size,
            startIcon,
            endIcon,
            borderRadius,
            hasShadow: hasShadow ?? false,
        };

        if (variant === 'button') {
            return mode === 'remote' ? (
                <ActionButton
                    {...sharedProps}
                    apiBaseUrl={apiBaseUrl}
                    path={interpolatedPath}
                    method={method}
                    spinnerColor={spinnerColor}
                    useAuthToken={useAuthToken}
                    onSuccess={(res) => {
                        onSuccess?.(slot, item, res);
                        if (actionType === 'export') {
                            handleExportResponse(res, config);
                        }
                    }}
                    onError={() => { }}
                />
            ) : (
                <Button {...sharedProps} />
            );
        } else if (variant === 'icon') {
            return mode === 'remote' ? (
                <ActionIconButton
                    icon={icon || ''}
                    iconSize={iconSize}
                    onClick={() => {
                        onItemSlotClick?.(slot, item);
                        onItemActionClick?.(slot?.name, item, index);
                        onClick?.(slot, item, index);
                    }}
                    size={size}
                    type={type || 'clear'}
                    color={color}
                    hasShadow={hasShadow || false}
                    containerStyle={containerStyle}
                    apiBaseUrl={apiBaseUrl}
                    path={interpolatedPath}
                    method={method}
                    spinnerColor={spinnerColor}
                    useAuthToken={useAuthToken}
                    onSuccess={(res) => {
                        if (actionType === 'export') {
                            handleExportResponse(res, config);
                        }

                    }}
                    onError={() => { }}
                />
            ) : (
                <IconButton
                    icon={icon || ''}
                    iconSize={iconSize}
                    onClick={() => {
                        onItemSlotClick?.(slot, item);
                        onClick?.(slot, item, index);
                    }}
                    size={size}
                    type={type || 'clear'}
                    color={color}
                    hasShadow={hasShadow || false}
                    style={containerStyle}
                />
            );
        }
        return null;
    };

    const renderActionsGroupSlot = (
        slot: Slot,
        item: any,
        index: number,
        onItemActionClick?: (actionName: string, itemData: any, itemIndex?: number) => void
    ): React.ReactNode => {
        const config = slot.config ?? {};
        const { items = [], containerStyle, onItemSelect }: any = config;

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                ...containerStyle
            }}>
                {items.map((action: any, idx: number) => {
                    const {
                        name,
                        variant,
                        mode,
                        icon,
                        iconSize,
                        title,
                        color,
                        size,
                        startIcon,
                        endIcon,
                        borderRadius,
                        hasShadow,
                        type,
                        containerStyle,
                        apiBaseUrl,
                        path,
                        method,
                        spinnerColor,
                        useAuthToken,
                        onClick,
                        actionType
                    } = action;

                    const interpolatedPath = interpolateString(item, path);

                    const handleClick = () => {
                        onClick?.(action?.type, name);
                        onItemSelect?.(name);
                        onItemActionClick?.(slot.name, item, index);
                    };

                    const sharedProps = {
                        onClick: handleClick,
                        title,
                        color,
                        size,
                        startIcon,
                        endIcon,
                        borderRadius,
                        hasShadow: hasShadow ?? false,
                    };

                    if (variant === 'button') {
                        return mode === 'remote' ? (
                            <ActionButton
                                key={idx}
                                {...sharedProps}
                                apiBaseUrl={apiBaseUrl}
                                path={interpolatedPath}
                                method={method}
                                spinnerColor={spinnerColor}
                                useAuthToken={useAuthToken}
                                onSuccess={(res) => {
                                    if (actionType === 'export') {
                                        handleExportResponse(res, action);
                                    }
                                }}
                                onError={() => { }}
                            />
                        ) : (
                            <Button key={idx} {...sharedProps} />
                        );
                    }

                    return mode === 'remote' ? (
                        <ActionIconButton
                            key={idx}
                            icon={icon || ''}
                            iconSize={iconSize}
                            onClick={handleClick}
                            size={size}
                            type={type || 'clear'}
                            color={color}
                            hasShadow={hasShadow || false}
                            containerStyle={containerStyle}
                            apiBaseUrl={apiBaseUrl}
                            path={interpolatedPath}
                            method={method}
                            spinnerColor={spinnerColor}
                            useAuthToken={useAuthToken}
                            onSuccess={(res) => {
                                if (actionType === 'export') {
                                    handleExportResponse(res, action);
                                }
                            }}
                            onError={() => { }}
                        />
                    ) : (
                        <IconButton
                            key={idx}
                            icon={icon || ''}
                            iconSize={iconSize}
                            onClick={handleClick}
                            size={size}
                            type={type || 'clear'}
                            color={color}
                            hasShadow={hasShadow || false}
                            style={containerStyle}
                        />
                    );
                })}
            </div>
        );
    };

    const renderActionsMenuSlot = (
        slot: Slot,
        item: any,
        index: number,
        onItemActionClick?: (actionName: string, itemData: any, itemIndex?: number) => void
    ): React.ReactNode => {
        const config = slot.config ?? {};
        const { menuItems = [], onItemSelect }: any = config;

        const handleSelect = (actionName: string) => {
            const action = menuItems.find((a: any) => a.name === actionName);

            if (action?.actionType === 'export') {
                const client = action.useAuthToken ? securedHttpClient : httpClient;
                if (action.apiBaseUrl) client.setBaseURL(action.apiBaseUrl);

                const interpolatedPath = interpolateString(item, action.path);

                client.get(interpolatedPath).then((res) => {
                    handleExportResponse(res.data, action);
                });
            }

            onItemActionClick?.(slot.name, item, index);
            onItemSelect?.(actionName);
        };

        return (
            <ActionsMenuButton
                menuItems={menuItems}
                onItemSelect={handleSelect}
            />
        );
    };

    const resolveSlotComponent = (slot: Slot, item: any, index: number): React.ReactNode => {
        switch (slot.type) {
            case 'action':
                return renderActionSlot(slot, item, index, onItemSlotClick, onItemActionClick);
            case 'actionsGroup':
                return renderActionsGroupSlot(slot, item, index, onItemActionClick);
            case 'actionsMenu':
                return renderActionsMenuSlot(slot, item, index, onItemActionClick);
            case 'text':
                return (
                    <Text
                        content={item[slot.name]}
                        color={slot?.config?.color}
                        style={slot?.config?.style}
                    />
                );

            case 'template':
                return (
                    <TemplateRenderer
                        context={item}
                        template={slot?.config?.template}
                        containerStyle={slot?.config?.containerStyle}
                    />
                );

            case 'icon':
                return (
                    <Icon
                        name={item[slot.name] || slot?.config?.defaultIcon}
                        size={slot?.config?.size}
                        color={interpolateString(item, slot?.config?.color || '')}
                    />
                );

            case 'thumbnail':
                return (
                    <Thumbnail
                        src={item[slot.name] || slot?.config?.defaultImage}
                        style={{
                            width: slot?.config?.size,
                            height: slot?.config?.size,
                            borderRadius: (slot?.config?.size ?? 40) / 2,
                            ...slot?.config?.style,
                        }}
                    />
                );

            case 'stackedThumbnails':
                return (
                    <StackedThumbnails
                        thumbnails={item[slot.name]}
                        maxDisplayed={slot?.config?.maxDisplayed}
                        size={slot?.config?.size}
                        spacing={slot?.config?.spacing}
                        borderColor={slot?.config?.borderColor}
                        overflowStyle={slot?.config?.overflowStyle}
                        overflowTextStyle={slot?.config?.overflowTextStyle}
                        containerStyle={slot?.config?.containerStyle}
                        onClick={() => {
                            onItemSlotClick?.(slot, item);
                            slot?.config?.onClick?.(slot, item);
                        }}
                    />
                );

            case 'money':
                return (
                    <Money
                        amount={item[slot.name]}
                        currencySymbol={slot.config?.currencySymbol || '$'}
                        symbolPosition={slot.config?.symbolPosition || 'start'}
                        decimalSeparator={slot.config?.decimalSeparator || ','}
                        thousandsSeparator={slot.config?.thousandsSeparator || '.'}
                        decimalPlaces={slot.config?.decimalPlaces || 2}
                        containerStyle={slot.config?.containerStyle}
                        symbolStyle={slot.config?.symbolStyle}
                        amountStyle={slot.config?.amountStyle}
                    />
                );

            default:
                return null;
        }
    };


    const renderDefaultItem = (item: any, index: number) => (
        <div
            key={`item-${item.id}`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                padding: '5px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                marginBottom: '10px',
                marginTop: '5px',
                cursor: isItemClickable ? 'pointer' : 'default',
                filter: "drop-shadow(0 1.5px 0 #ccc)",
                //boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
                ...itemStyle,
            }}
            className="snapping-dynamic-list-item"
            onClick={() => {
                if (isItemClickable && onItemClick) {
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
                    return (
                        <div key={slotIndex} style={{ padding: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {resolveSlotComponent(slot, item, index)}
                        </div>
                    );
                })}
            </div>

            {/* Right section */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {endSlots.map((slot, slotIndex) => {
                    return (
                        <div key={slotIndex} style={{ padding: 5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {resolveSlotComponent(slot, item, index)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderItem = customRenderItem || renderDefaultItem;

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
            noContentIcon={noContentIcon}
            noContentText={noContentText}
        />
    ) : (
        <div style={{
            width: '100%',
            maxWidth: 800,
            ...containerStyle
        }} className={className}>
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