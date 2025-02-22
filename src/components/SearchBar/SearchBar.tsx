import React, { useState } from "react";
import themeColors from "../../config/themeColors";
import Icon from "../Icon/Icon";
import IconButton from "../buttons/IconButton/IconButton";

interface SearchBarProps {
    containerStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    searchIcon?: string;
    clearIcon?: string;
    placeholder?: string; // Placeholder text for the input
    onChange?: (value: string) => void; // Callback for each change in the input
    onEnterPress?: (value: string) => void; // Callback when pressing enter
}

const SearchBar: React.FC<SearchBarProps> = ({
    containerStyle,
    inputStyle,
    searchIcon = "search", // Default search icon
    clearIcon = "close", // Default clear icon
    placeholder = "Search...",
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
            className="precooked-search-bar"
            style={{
                display: "flex",
                alignItems: "center",
                border: `1px solid ${themeColors.medium}`,
                borderRadius: "25px",
                padding: "5px 10px",
                ...containerStyle
            }}>
            <Icon name={searchIcon} />
            <input
                type="text"
                value={searchValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    padding: "5px",
                    background: 'transparent',
                    color: themeColors.text,
                    fontSize: 16,
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
                />
            )}
        </div>
    );
};

export default SearchBar;
