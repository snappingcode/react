import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Portal from "../Portal/Portal";
import Icon from "../Icon/Icon";
import { themeColors } from "../../config";

interface Tab {
    id: string;
    label: string;
    icon?: string; // Optional icon
    link: string;
    [key: string]: any; // Allow additional properties for customization
}

interface NavigationTabsProps {
    tabs: Tab[]; // List of tabs
    renderTab?: (tab: Tab, isActive: boolean) => React.ReactNode; // Custom render function for tabs
    wrapperStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    tabStyle?: React.CSSProperties; // Optional inline styles for each tab
    activeTabStyle?: React.CSSProperties; // Optional inline styles for the active tab
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
    tabs,
    renderTab,
    wrapperStyle,
    containerStyle,
    tabStyle,
    activeTabStyle,
}) => {
    const location = useLocation();
    const [justifyContent, setJustifyContent] = useState<React.CSSProperties["justifyContent"]>("center");
    const [minHeight, setMinHeight] = useState<string>("75px"); // Estado para la altura mínima
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const screenWidth = window.innerWidth;

                // Cambiar justifyContent según el ancho de la pantalla
                if (screenWidth <= containerWidth) {
                    setJustifyContent("flex-start");
                } else {
                    setJustifyContent("center");
                }

                // Cambiar minHeight según el tipo de dispositivo
                if (screenWidth >= 768 && screenWidth <= containerWidth + 20) {
                    setMinHeight("92px"); // Desktop
                } else {
                    setMinHeight("77px"); // Celular/Tablet
                }
            }
        };

        // Ejecutamos la función al montar el componente
        handleResize();

        // Agregamos el listener para el evento resize
        window.addEventListener("resize", handleResize);

        // Limpiamos el listener al desmontar el componente
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const content = (
        <Portal>
            <div
                style={{
                    ...defaultStyles.wrapper,
                    justifyContent: justifyContent, // Aplicamos el valor dinámico
                    minHeight: minHeight, // Aplicamos la altura mínima dinámica
                    ...wrapperStyle,
                }}
                className="navigation-tabs-wrapper"
            >
                <div
                    ref={containerRef}
                    style={{ ...defaultStyles.container, ...containerStyle }}
                >
                    {tabs.map((tab) => {
                        const isActive = location.pathname === tab.link;
                        return (
                            <Link
                                key={tab.id}
                                style={{
                                    ...defaultStyles.tab,
                                    ...tabStyle,
                                    ...tab.style,
                                    ...(isActive ? { ...defaultStyles.activeTab, ...activeTabStyle } : {}),
                                }}
                                to={tab.link}
                            >
                                {renderTab ? (
                                    renderTab(tab, isActive)
                                ) : (
                                    <DefaultTab tab={tab} isActive={isActive} />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </Portal>
    );
    return content;
};

// Default tab renderer if renderTab is not provided
const DefaultTab: React.FC<{ tab: Tab; isActive: boolean }> = ({ tab, isActive }) => (
    <div
        style={{
            ...defaultStyles.defaultTab,
            ...(isActive ? defaultStyles.activeTab : {}),
        }}
    >
        {tab.icon && (
            <div>
                <Icon
                    style={{ ...defaultStyles.icon }}
                    color={isActive ? themeColors.primary : themeColors.text}
                    name={tab.icon}
                />
            </div>
        )}
        <div
            style={{
                ...defaultStyles.label,
                color: isActive ? themeColors.primary : themeColors.text,
            }}
        >
            {tab.label}
        </div>
    </div>
);

// Default styles for the component
const defaultStyles = {
    wrapper: {
        display: "flex",
        justifyContent: "center", // Este valor será sobrescrito dinámicamente
        alignItems: "flex-end",
        position: "fixed",
        bottom: "15px",
        left: 0,
        right: 0,
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingBottom: 3,
        overflowX: "auto", // Habilitamos el desplazamiento horizontal
        overflowY: "hidden", // Deshabilitamos el desplazamiento vertical
        height: "auto", // Altura dinámica
    } as React.CSSProperties,
    container: {
        paddingLeft: "10px",
        paddingRight: "10px",
        paddingTop: "20px",
        paddingBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "60px",
        backgroundColor: "#ffffff",
        boxSizing: "border-box",
        borderRadius: "20px",
        filter: "drop-shadow(0px 2px 0 #ddd)",
    } as React.CSSProperties,
    tab: {
        cursor: "pointer",
        textAlign: "center",
        textDecoration: "none",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flex: 1,
    } as React.CSSProperties,
    activeTab: {
        fontWeight: "bold",
        color: themeColors.primary,
    } as React.CSSProperties,
    defaultTab: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    } as React.CSSProperties,
    icon: {} as React.CSSProperties,
    label: {
        fontSize: "0.875rem",
        lineHeight: 1
    } as React.CSSProperties,
};

// Default export
export default NavigationTabs;