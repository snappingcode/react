import React, { FC, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import IconButton from "../buttons/IconButton/IconButton";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../Icon/Icon";
import themeColors from "../../config/themeColors";

interface BrandProps {
    containerStyle?: React.CSSProperties;
    logo?: string;
    logoStyle?: React.CSSProperties;
    title?: string;
    titleStyle?: React.CSSProperties;
}

interface UserProps {
    containerStyle?: React.CSSProperties;
    avatar?: string;
    avatarStyle?: React.CSSProperties;
    name?: string;
    nameStyle?: React.CSSProperties;
    email?: string;
    emailStyle?: React.CSSProperties;
    role?: string;
    roleStyle?: React.CSSProperties;
    actions?: Array<{ label: string; icon?: React.ReactNode; onClick: () => void }>;
}

interface MenuItem {
    label: string;
    icon?: string;
    iconSize?: number;
    link?: string;
    style?: React.CSSProperties;
    onClick: () => void;
    subItems?: MenuItem[];
}

interface FooterItem {
    type: "button" | "toggle" | "custom";
    label?: string;
    icon?: string;
    onClick?: () => void;
    checked?: boolean;
    customContent?: React.ReactNode;
}

interface SideMenuProps {
    className?: string;
    containerStyle?: React.CSSProperties;
    isOpen: boolean;
    position: "left" | "right";
    width?: string;
    breakpoint?: string;
    closeOnOverlayClick?: boolean;
    animation?: "slide" | "fade" | "none";
    onClose?: () => void;
    onOpen?: () => void;
    brand?: BrandProps;
    user?: UserProps;
    menuItems: MenuItem[];
    menuItemsContainerStyle?: React.CSSProperties;
    menuItemStyle?: React.CSSProperties;
    activeItemStyle?: React.CSSProperties;
    activeItemColor?: string;
    footerItems?: FooterItem[];
    footerItemsContainerStyle?: React.CSSProperties;
    footerItemStyle?: React.CSSProperties;
    ariaLabel?: string;
    ariaControls?: string;
    toggleButtonContainerStyle?: React.CSSProperties;
    toggleButtonIcons?: { open: string; close: string };
    toggleButtonStyle?: React.CSSProperties;
    toggleButtonSize?: "xs" | "sm" | "md" | "lg" | "xl";
    toggleButtonColor?: string;
}

const SideMenu: FC<SideMenuProps> = ({
    className,
    containerStyle,
    isOpen,
    position = "left",
    width = "250px",
    breakpoint = "768px",
    closeOnOverlayClick = true,
    animation = "slide",
    onClose,
    onOpen,
    brand,
    user,
    menuItems,
    menuItemsContainerStyle,
    menuItemStyle,
    activeItemStyle,
    activeItemColor,
    footerItems,
    footerItemsContainerStyle,
    footerItemStyle,
    ariaLabel,
    ariaControls,
    toggleButtonContainerStyle,
    toggleButtonIcons = { open: "menu", close: "close" },
    toggleButtonStyle,
    toggleButtonSize = "md",
    toggleButtonColor = "text"
}) => {
    const [menuOpen, setMenuOpen] = useState(isOpen);
    const [isResponsive, setIsResponsive] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        const handleResize = () => {
            const isBelowBreakpoint = window.innerWidth < parseInt(breakpoint);
            setIsResponsive(isBelowBreakpoint);
            setMenuOpen(!isBelowBreakpoint);
            if (isBelowBreakpoint) { onClose?.() } else { onOpen?.() }
        };
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);


    const toggleMenu = () => {
        const newState = !menuOpen;
        setMenuOpen(newState);
        newState ? onOpen?.() : onClose?.();
    };
    const handleMenuItemClick = (item: MenuItem) => {
        if (item.link) {
            navigate(item.link);
        }
        item.onClick?.();
    };
    const content = (
        <div
            className={className}
            style={{
                position: "fixed",
                top: 0,
                [position]: menuOpen ? 0 : `-${width}`,
                width,
                height: "100%",
                transition: animation !== "none" ? "all 0.3s ease" : "none",
                zIndex: 1000,
                backgroundColor: "#fff",
                overflowY: "auto",
                paddingTop: isResponsive ? 50 : 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                color: themeColors.textTint,
                boxSizing: "border-box",
                ...containerStyle
            }}
            aria-label={ariaLabel}
            aria-controls={ariaControls}
        >
            {/* Brand Section */}
            {brand && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        width: '100%',
                        boxSizing: 'border-box',
                        ...brand.containerStyle
                    }}

                >
                    {brand.logo && (
                        <div style={{
                            width: '80%',
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            ...brand.logoStyle
                        }}>
                            <img
                                src={brand.logo}
                                alt={brand.title}
                                style={{
                                    width: '100%',
                                    display: 'block',
                                    margin: 0,
                                    padding: 0,
                                }}
                            />
                        </div>
                    )}
                    {brand.title && <div style={brand.titleStyle}>{brand.title}</div>}
                </div>
            )}

            {/* User Section */}
            {user && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    ...user.containerStyle
                }}>
                    {user.avatar && (
                        <div style={{
                            width: '70px',
                            borderRadius: 999,
                            overflow: 'hidden',
                            boxSizing: 'border-box',
                            marginBottom: 5,
                            ...user.avatarStyle
                        }}>
                            <img
                                src={user.avatar}
                                alt={user.name}
                                style={{
                                    width: '100%',
                                    display: 'block',
                                    margin: 0,
                                    padding: 0,
                                }}
                            />
                        </div>
                    )}
                    {user.name && <div style={{
                        fontSize: 15,
                        fontWeight: '400',
                        ...user.nameStyle
                    }}>{user.name}</div>}
                    {user.email && <div style={{
                        fontSize: 15,
                        fontWeight: '400',
                        ...user.emailStyle
                    }}>{user.email}</div>}
                    {user.role && <div style={{
                        fontSize: 15,
                        fontWeight: '400',
                        ...user.roleStyle
                    }}>{user.role}</div>}
                    {user.actions &&
                        user.actions.map((action, index) => (
                            <div key={index} onClick={action.onClick}>
                                {action.icon} {action.label}
                            </div>
                        ))}
                </div>
            )}

            {/* Menu Items Section */}
            <div style={{
                flexGrow: 1, // Allow this div to take the remaining space
                overflowY: "auto",
                padding: 5,
                boxSizing: "border-box",
                ...menuItemsContainerStyle
            }}>
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 5,
                            justifyContent: "flex-start",
                            cursor: "pointer",
                            boxSizing: "border-box",
                            padding: 5,
                            borderRadius: 5,
                            ...menuItemStyle,
                            ...(location.pathname === item.link ? activeItemStyle : {}),
                            ...item.style,
                        }}
                        onClick={() => handleMenuItemClick(item)}
                    >
                        {item.icon && <div style={{
                            //flex: 1,
                            width: item.iconSize
                        }}><Icon size={item.iconSize} color={location.pathname === item.link ? activeItemColor : "text"} name={item.icon} /></div>}
                        <span style={{
                            color: location.pathname === item.link ? activeItemColor : "inherit",
                            display: "inline-block",
                            padding: 3,
                            fontSize: 15
                        }}>{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Footer Section */}
            {footerItems && (
                <div style={{
                    padding: 5,
                    ...footerItemsContainerStyle
                }}>
                    {footerItems.map((item, index) => {
                        if (item.type === "button") {
                            return (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: 5,
                                    justifyContent: "flex-start",
                                    cursor: "pointer",
                                    boxSizing: "border-box",
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    paddingBottom: 0,
                                    paddingTop: 0,

                                }}
                                    key={index} onClick={item.onClick}>
                                    {item.icon && <Icon name={item.icon} />}
                                    <span style={{
                                        display: "inline-block",
                                        padding: 3,
                                    }}>{item.label}</span>
                                </div>
                            );
                        }
                        // if (item.type === "toggle") {
                        //     return (
                        //         <div key={index}>
                        //             {item.icon} {item.label}
                        //             <input type="checkbox" checked={item.checked} onChange={item.onClick} />
                        //         </div>
                        //     );
                        // }
                        if (item.type === "custom" && item.customContent) {
                            return <div key={index}>{item.customContent}</div>;
                        }
                        return null;
                    })}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Toggle Button */}
            {isResponsive && (
                <div style={{

                    ...toggleButtonContainerStyle
                }}>
                    <IconButton
                        icon={menuOpen ? toggleButtonIcons.close : toggleButtonIcons.open} onClick={toggleMenu}
                        type="clear"
                        hasShadow={false}
                        style={{
                            position: "fixed",
                            top: 10,
                            [position]: 10,
                            zIndex: 1100,
                            ...toggleButtonStyle,
                        }}
                        color={toggleButtonColor}
                        size={toggleButtonSize}
                    />
                </div>)
            }

            {/* Side Menu Content */}
            {ReactDOM.createPortal(content, document.body)}
        </>
    );
};

export default SideMenu;
