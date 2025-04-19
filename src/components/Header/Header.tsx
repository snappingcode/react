import React from "react";
import themeColors from "../../config/themeColors";
import ActionsMenuButton from "../buttons/ActionsMenuButton/ActionsMenuButton";
import useIsMobile from "../../hooks/useIsMobile";
import IconButton from "../buttons/IconButton/IconButton";
import SearchBar from "../SearchBar/SearchBar";

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
export interface Slot {
    type: "title" | "backButton" | "menuButton" | "profileButton" | "searchBar" | "actionsGroup" | "actionsMenuButton" | "iconButton" | "custom";
    config: Record<string, any>;
}

interface HeaderProps {
    startSlots?: Slot[];
    centerSlots?: Slot[];
    endSlots?: Slot[];
    className?: string;
    containerStyle?: React.CSSProperties;
    showSearchBar?: boolean;
    searchBarConfig?: any;
}

const Header: React.FC<HeaderProps> = ({
    startSlots = [],
    centerSlots = [],
    endSlots = [],
    className,
    containerStyle,
    showSearchBar = false,
    searchBarConfig = {}
}) => {
    const [showSearchOnly, setShowSearchOnly] = React.useState(false);
    const breakpoint = 996;
    const { isMobile } = useIsMobile(breakpoint);

    const forceMobile = isMobile || searchBarConfig?.forceMobileView;

    const renderSlot = (slot: Slot) => {
        switch (slot.type) {
            case "custom":
                return (
                    <div style={slot.config.containerStyle} className={slot.config.className}>
                        <div dangerouslySetInnerHTML={{ __html: slot.config.content }} />
                    </div>
                );
            case "title":
                return (
                    <h1 style={{
                        fontWeight: "900",
                        color: themeColors.text,
                        margin: 0,
                        padding: 0,
                        fontSize: 22,
                        ...slot.config.style
                    }}>{slot.config.text}</h1>
                );
            case "backButton":
            case "menuButton":
            case "iconButton":
                return (
                    <IconButton
                        onClick={slot.config.onClick}
                        style={slot.config.style}
                        icon={slot.config.icon || (slot.type === "backButton" ? "back" : "menu")}
                        hasShadow={false}
                        type={slot.config.type || "clear"}
                        color={slot.config.color}
                        size={slot.config.size}
                        iconSize={slot.config.iconSize}
                    />
                );
            case "actionsGroup":
                return (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        ...slot.config.containerStyle
                    }}>
                        {slot.config.items?.map((action: Action, index: number) => (
                            <IconButton
                                key={index}
                                onClick={() => {
                                    action?.config?.onClick(action?.type, action?.name);
                                    slot?.config?.onItemSelect(action?.name);
                                }}
                                icon={action.icon}
                                hasShadow={false}
                                type="clear"
                                color={action?.config?.color || themeColors.text}
                            />
                        ))}
                    </div>
                );
            case "actionsMenuButton":
                return (
                    <ActionsMenuButton
                        menuItems={slot?.config?.menuItems || []}

                        onItemSelect={(actionName) => {
                            console.log(`Action selected: ${actionName}`);
                            slot?.config?.onItemSelect(actionName);
                        }}
                    />
                );
            default:
                return null;
        }
    };

    // 🔒 Modo "solo búsqueda"
    if (showSearchBar && forceMobile && showSearchOnly) {
        return (
            <header
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: 5,
                    ...containerStyle
                }}
            >
                <SearchBar
                    containerStyle={{ flex: 1, marginLeft: 5, marginRight: 5 }}
                    inputStyle={{}}
                    placeholder={searchBarConfig.placeholder}
                    onChange={searchBarConfig.onChange}
                    onEnterPress={searchBarConfig.onEnterPress}
                    searchIcon={searchBarConfig.searchIcon}
                    searchIconColor={searchBarConfig.searchIconColor}
                    searchIconSize={searchBarConfig.searchIconSize}
                    clearIcon={searchBarConfig.clearIcon}
                    clearIconColor={searchBarConfig.clearIconColor}
                    clearIconSize={searchBarConfig.clearIconSize}
                />
                <IconButton
                    icon={searchBarConfig.closeIcon || "close"}
                    color={searchBarConfig.closeIconColor}
                    iconSize={searchBarConfig.closeIconSize}
                    onClick={() => setShowSearchOnly(false)}
                    type="clear"
                    hasShadow={false}
                    size={'sm'}

                />
            </header>
        );
    }

    return (
        <header
            className={className}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                padding: 5,
                ...containerStyle
            }}
        >
            {/* Start */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {startSlots.map((slot, index) => (
                    <div key={index}>{renderSlot(slot)}</div>
                ))}
            </div>

            {/* Center */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {centerSlots.map((slot, index) => (
                    <div key={index}>{renderSlot(slot)}</div>
                ))}
            </div>

            {/* End + SearchBar (desktop o mobile no expandido) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {showSearchBar && forceMobile && !showSearchOnly && (
                    <IconButton
                        icon={searchBarConfig.searchIcon || "search"}
                        color={searchBarConfig.searchIconColor || themeColors.text}
                        size={searchBarConfig.searchIconSize}
                        onClick={() => setShowSearchOnly(true)}
                        type="clear"
                        hasShadow={false}
                    />
                )}

                {showSearchBar && !forceMobile && (
                    <div style={{ marginRight: 5, marginLeft: 5 }}>
                        <SearchBar
                            containerStyle={{}}
                            inputStyle={{}}
                            placeholder={searchBarConfig.placeholder}
                            onChange={searchBarConfig.onChange}
                            onEnterPress={searchBarConfig.onEnterPress}
                            searchIcon={searchBarConfig.searchIcon}
                            searchIconColor={searchBarConfig.searchIconColor}
                            searchIconSize={searchBarConfig.searchIconSize}
                            clearIcon={searchBarConfig.clearIcon}
                            clearIconColor={searchBarConfig.clearIconColor}
                            clearIconSize={searchBarConfig.clearIconSize}
                        />
                    </div>
                )}

                {endSlots.map((slot, index) => (
                    <div key={index}>{renderSlot(slot)}</div>
                ))}
            </div>
        </header>
    );
};

export default Header;
