import React, { useState, useEffect, useRef } from 'react';
import { themeColors } from '../../config';
import Icon from '../Icon/Icon';
import DynamicIcon from '../DynamicIcon/DynamicIcon';
import useIsMobile from '../../hooks/useIsMobile';
import IconButton from '../buttons/IconButton/IconButton';


interface TabItem {
    name: string; // Identifier in camelCase
    label: string; // User-visible label
    icon?: string; // Icon name
    iconPaths?: any[]; // Custom icon paths
}

interface TabsProps {
    containerStyle?: React.CSSProperties;
    id?: string;
    tabs: TabItem[];
    defaultActiveTab?: string;
    onTabChange?: (activeTab: string) => void;
    color?: string; // For customizing tab color
    renderTab?: (tab: TabItem, isActive: boolean) => React.ReactNode;
    tabStyle?: React.CSSProperties;
    activeTabStyle?: React.CSSProperties;
    tabListStyle?: React.CSSProperties;
}

const resolveIcon = (
    icon: string | undefined,
    paths?: any[],
    size?: number,
    color?: string
) => {
    if (icon) {
        return <Icon name={icon} size={size} color={color} />;
    } else if (paths) {
        return <DynamicIcon paths={paths} size={size} />;
    }
    return null;
};

const Tabs: React.FC<TabsProps> = ({
    containerStyle,
    id,
    tabs,
    defaultActiveTab,
    onTabChange,
    color = 'primary', // Default color
    renderTab,
    tabStyle,
    activeTabStyle,
    tabListStyle
}) => {
    const breakpoint = 768;
    const { isMobile } = useIsMobile(breakpoint);
    // Verificamos si hay tabs antes de establecer el estado inicial
    const initialTab = defaultActiveTab || (tabs.length > 0 ? tabs[0].name : null);
    const [activeTab, setActiveTab] = useState<string | null>(initialTab);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const listRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkScrollability = () => {
            if (listRef.current && containerRef.current) {
                const { scrollWidth, clientWidth, scrollLeft } = listRef.current;
                setCanScrollLeft(scrollLeft > 0);
                setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
            }
        };

        checkScrollability();
        window.addEventListener('resize', checkScrollability);
        return () => window.removeEventListener('resize', checkScrollability);
    }, [tabs]);

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
        if (onTabChange) {
            onTabChange(tabName);
        }
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (!listRef.current) return;

        const { clientWidth, scrollLeft, scrollWidth } = listRef.current;
        const scrollAmount = clientWidth * 0.7; // Se mueve un 70% del contenedor

        const newScrollLeft = direction === 'left'
            ? Math.max(scrollLeft - scrollAmount, 0)
            : Math.min(scrollLeft + scrollAmount, scrollWidth - clientWidth);

        listRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    };

    useEffect(() => {
        const updateButtonsState = () => {
            if (!listRef.current) return;
            const { scrollLeft, clientWidth, scrollWidth } = listRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
        };

        listRef.current?.addEventListener('scroll', updateButtonsState);
        return () => listRef.current?.removeEventListener('scroll', updateButtonsState);
    }, []);

    const resolvedColor = color in themeColors ? themeColors[color as keyof typeof themeColors] : color;

    return (
        <div
            ref={containerRef}
            {...(id ? { id } : {})}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%', // Asegurar que ocupa todo el ancho
                overflow: 'hidden', // Oculta el scroll
                ...containerStyle
            }}
        >
            {!isMobile && (
                <div style={{
                    width: '40px',

                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <IconButton
                        icon="chevronLeft"
                        type='clear'
                        hasShadow={false}
                        size="xs"
                        color={themeColors.text}
                        onClick={() => handleScroll('left')}
                        disabled={!canScrollLeft} // Se desactiva si no puede hacer scroll a la izquierda
                        style={{

                        }}
                    />
                </div>
            )}

            <ul
                ref={listRef}
                style={{
                    display: 'flex',
                    listStyle: 'none',
                    padding: 5,
                    gap: 5,
                    overflow: 'hidden', // Oculta la barra de scroll
                    scrollBehavior: 'smooth',
                    whiteSpace: 'nowrap',
                    ...tabListStyle
                }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.name;
                    const tabContent = renderTab ? (
                        renderTab(tab, isActive)
                    ) : (
                        <span
                            style={{
                                display: 'inline-flex',
                                padding: "10px 20px",
                                cursor: "pointer",
                                color: themeColors.textTint,
                                fontWeight: 600,
                                fontSize: 14,
                                textAlign: "center",
                                position: "relative",
                                transition: "background .3s ease-in-out",
                                backgroundColor: isActive ? themeColors.primary : themeColors.light,
                                borderRadius: 10,
                                ...(tabStyle || {}), // Aplica estilos personalizados de tabStyle
                                ...(isActive ? activeTabStyle || {} : {}), // Aplica activeTabStyle solo si está activo
                                //minWidth: '120px' // Asegura un ancho mínimo para facilitar el scroll
                            }}
                        >
                            {resolveIcon(tab.icon, tab.iconPaths, 20, resolvedColor)}
                            <span>{tab.label}</span>
                        </span>


                    );

                    return (
                        <li
                            key={tab.name}
                            onClick={() => handleTabClick(tab.name)}
                        >
                            {tabContent}
                        </li>
                    );
                })}
            </ul>

            {!isMobile && (
                <div style={{
                    width: '40px',

                    display: 'flex',
                    justifyContent: 'center',
                }}>
                    <IconButton
                        icon="chevronRight"
                        type='clear'
                        hasShadow={false}
                        size="xs"
                        color={themeColors.text}
                        onClick={() => handleScroll('right')}
                        disabled={!canScrollRight} // Se desactiva si no puede hacer scroll a la derecha
                        style={{

                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Tabs;
