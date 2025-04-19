import React, { useState } from "react";
import themeColors from "../../config/themeColors";
import Icon from "../Icon/Icon";
import IconButton from "../buttons/IconButton/IconButton";

interface SearchBarProps {
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;

    placeholder?: string; // Placeholder text for the input
    onChange?: (value: string) => void; // Callback for each change in the input
    onEnterPress?: (value: string) => void; // Callback when pressing enter

    searchIcon?: string;
    searchIconColor?: string;
    searchIconSize?: number;

    clearIcon?: string;
    clearIconColor?: string;
    clearIconSize?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
    containerStyle,
    inputStyle,
    searchIcon = "search", // Default search icon
    clearIcon = "close", // Default clear icon
    placeholder = "Search...",
    searchIconColor,
    searchIconSize,
    clearIconColor,
    clearIconSize,
    onChange,
    onEnterPress,
}) => {
    const [searchValue, setSearchValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        if (onChange) {
            onChange(value);
        }
    };

    const handleClear = () => {
        setSearchValue("");
        if (onChange) {
            onChange("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && onEnterPress) {
            onEnterPress(searchValue);
        }
    };

    return (
        <div
            className="snapping-search-bar"
            style={{
                display: "flex",
                alignItems: "center",
                border: `1.5px solid ${themeColors.medium}`,
                borderRadius: "25px",
                padding: "2px 35px 2px 7px",
                position: "relative",
                ...containerStyle
            }}>
            <Icon name={searchIcon}
                color={searchIconColor || themeColors.text}
                size={searchIconSize}
            />
            <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    //padding: "5px",
                    background: 'transparent',
                    color: themeColors.text,
                    fontSize: 16,
                    lineHeight: 1.4,
                    //backgroundColor: 'red',
                    ...inputStyle
                }}
                placeholder={placeholder}
            />
            {searchValue && (
                <IconButton
                    icon={clearIcon}
                    type="clear"
                    size="xs"
                    onClick={handleClear}
                    aria-label="Clear"
                    hasShadow={false}
                    color={clearIconColor || themeColors.text}
                    iconSize={clearIconSize}
                    style={{
                        position: "absolute",
                        right: 5,
                        top: 2
                    }}
                />
            )}
        </div>
    );
};

export default SearchBar;
