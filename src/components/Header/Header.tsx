
import React from "react";

import SearchBar from "../SearchBar/SearchBar";
import themeColors from "../../config/themeColors";
import IconButton from "../buttons/IconButton/IconButton";

interface Slot {
    type: "title" | "backButton" | "menuButton" | "profileButton" | "searchBar" | "actions" | "moreOptions";
    config: Record<string, any>;
}

interface HeaderProps {
    startSlots?: Slot[];
    centerSlots?: Slot[];
    endSlots?: Slot[];
    style?: React.CSSProperties;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    startSlots = [],
    centerSlots = [],
    endSlots = [],
    style,
    className,
}) => {
    const renderSlot = (slot: Slot) => {
        switch (slot.type) {
            case "title":
                return <h1 style={{
                    fontWeight: "900",
                    color: themeColors.text,
                    margin: 0,
                    padding: 0,
                    fontSize: 22,
                    ...slot.config.style
                }}>{slot.config.text}</h1>;
            case "backButton":
                return (
                    <IconButton
                        onClick={slot.config.onClick}
                        style={slot.config.style}
                        icon={slot.config.icon || "back"}
                        hasShadow={false}
                        type='clear'
                    />
                );
            case "menuButton":
                return (
                    <IconButton
                        onClick={slot.config.onClick}
                        style={slot.config.style}
                        icon={slot.config.icon || "menu"}
                        hasShadow={false}
                        type='clear'
                    />
                );
            case "searchBar":
                return (<SearchBar
                    containerStyle={{
                        marginLeft: 5,
                        marginRight: 5

                    }}
                    inputStyle={{

                    }}
                    placeholder={slot.config.placeholder}
                    onChange={slot.config.onChange}
                    onEnterPress={slot.config.onEnterPress}
                />);
            // case "profileButton":
            //     return (
            //         <button onClick={slot.config.onClick} style={slot.config.style}>
            //             {slot.config.avatar || "👤"}
            //         </button>
            //     );
            case "actions":
                return (
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        //gap: "8px",
                        ...slot.config.containerStyle
                    }}>
                        {slot.config.items?.map((action: any, index: number) => (
                            <IconButton
                                key={index}
                                onClick={action.onClick}
                                icon={action.icon}
                                hasShadow={false}
                                type='clear'
                                color={action.color || themeColors.text}
                            />
                        ))}
                    </div>
                );
            case "moreOptions":
                return (

                    <IconButton
                        onClick={slot.config.onClick}
                        style={slot.config.style}
                        icon={slot.config.icon || "moreVertical"}
                        hasShadow={false}
                        type='clear'
                        color={slot.config.color || themeColors.text}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <header className={className} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            padding: 5,
            ...style

        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                //gap: "8px"
            }}>
                {startSlots.map((slot, index) => (
                    <div key={index}>{renderSlot(slot)}</div>
                ))}
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                //gap: "8px"
            }}>
                {centerSlots.map((slot, index) => (
                    <div key={index}>{renderSlot(slot)}</div>
                ))}
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                //gap: "8px"
            }}>
                {endSlots.map((slot, index) => (
                    <div key={index}>{renderSlot(slot)}</div>
                ))}
            </div>
        </header>
    );
};
export default Header;