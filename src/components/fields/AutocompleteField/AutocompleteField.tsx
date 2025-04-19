import React, { useState, useRef, useEffect } from 'react';

import { themeColors } from '../../../config';
import { httpClient, securedHttpClient } from '../../../httpClient';
import Icon from '../../Icon/Icon';
import Popover from '../../Popover/Popover';


interface AutocompleteFieldProps {
    label?: string;
    description?: string;
    options?: { [key: string]: any }[];
    value?: any | any[];
    multiple?: boolean;
    placeholder?: string;
    onChange: (selectedValue: any | any[]) => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    popoverStyle?: React.CSSProperties;
    apiBaseUrl: string;
    path: string;
    useAuthToken?: boolean;
    searchParam?: string;
    noResultsText?: string;
    searchingText?: string;
    // Después:
    itemLabelKey?: string;
    itemDescriptionKey?: string;
    itemImageKey?: string;

    // Nuevas (para estilos):
    itemLabelStyle?: React.CSSProperties;
    itemDescriptionStyle?: React.CSSProperties;
    itemImageStyle?: React.CSSProperties;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
    label,
    description,
    options = [],
    multiple = false,
    value = multiple ? [] : '',
    placeholder = "Escriba para buscar...",
    onChange,
    containerStyle = {},
    labelStyle = {},
    popoverStyle = {},
    descriptionStyle = {},
    apiBaseUrl,
    path,
    useAuthToken = true,
    searchParam = "search",
    noResultsText = "No results found",
    searchingText = "Searching...",

    itemLabelKey = "name",
    itemDescriptionKey,
    itemImageKey,
    itemLabelStyle,
    itemDescriptionStyle,
    itemImageStyle
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState(options);
    const [selectedOptions, setSelectedOptions] = useState<any | any[]>(value);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined); // Width for Popover

    const anchorRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const openPopover = () => setIsOpen(true);
    const closePopover = () => setIsOpen(false);

    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(selectedOptions)) {
            console.log('change value', value);
            setSelectedOptions(value);
        }

    }, [value]);

    useEffect(() => {
        const client = useAuthToken ? securedHttpClient : httpClient;
        client.setBaseURL(apiBaseUrl);
    }, [apiBaseUrl, useAuthToken]);

    useEffect(() => {
        if (anchorRef.current) {
            setPopoverWidth(anchorRef.current.offsetWidth - 20); // Set width based on anchor
        }
    }, [anchorRef.current?.offsetWidth]);

    const fetchOptions = async (query: string) => {
        setIsSearching(true);
        try {
            const client = useAuthToken ? securedHttpClient : httpClient;
            const response = await client.get(`${path}?${searchParam}=${query}`);
            setSearchOptions(response?.data);
            setActiveIndex(-1);
            openPopover();
        } catch (error) {
            console.error("Error fetching options:", error);
            setSearchOptions([]);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            fetchOptions(searchTerm);
        } else {
            setSearchOptions(options);
            closePopover();
        }
    }, [searchTerm]);


    const handleSelectOption = (selectedItem: any) => {
        if (multiple) {
            const newSelection = Array.isArray(selectedOptions)
                ? selectedOptions.find((item: any) => item[itemLabelKey] === selectedItem[itemLabelKey])
                    ? selectedOptions.filter((item: any) => item[itemLabelKey] !== selectedItem[itemLabelKey])
                    : [...selectedOptions, selectedItem]
                : [selectedItem];

            setSelectedOptions(newSelection);
            onChange(newSelection);
        } else {
            setSelectedOptions(selectedItem);
            onChange(selectedItem);
            closePopover();
        }
    };

    const removeOption = (itemToRemove: any) => {
        if (multiple && Array.isArray(selectedOptions)) {
            const newSelection = selectedOptions.filter((item: any) => item[itemLabelKey] !== itemToRemove[itemLabelKey]);
            setSelectedOptions(newSelection);
            onChange(newSelection);
        } else if (!multiple) {
            setSelectedOptions(null);
            onChange(null);
            setSearchTerm('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prevIndex) => (prevIndex + 1) % searchOptions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prevIndex) =>
                prevIndex === 0 ? searchOptions.length - 1 : prevIndex - 1
            );
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelectOption(searchOptions[activeIndex]);
        }
    };

    useEffect(() => {
        if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
            optionRefs.current[activeIndex]?.scrollIntoView({
                block: 'nearest',
                behavior: 'smooth',
            });
        }
    }, [activeIndex]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown as any);
        } else {
            window.removeEventListener('keydown', handleKeyDown as any);
        }
        return () => window.removeEventListener('keydown', handleKeyDown as any);
    }, [isOpen, activeIndex, searchOptions]);

    return (
        <>
            <div style={{
                background: '#fff',
                width: '100%',


                boxSizing: 'border-box',
                backgroundColor: '#fff',
                position: 'relative',

                ...containerStyle,
            }}>
                {label && (
                    <label
                        style={{
                            position: 'absolute',
                            top: '-13px',
                            left: '10px',
                            display: 'inline-block',
                            padding: '0 5px',
                            background: '#fff',
                            fontWeight: '600',
                            color: themeColors.text,
                            ...labelStyle,
                        }}
                    >
                        {label}
                    </label>
                )}

                {/* Single selection */}
                {(!multiple && selectedOptions) ? (
                    <div style={{ padding: 5 }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '10px',
                                cursor: 'pointer'
                            }}
                            onClick={() => removeOption(selectedOptions)}
                        >
                            {itemImageKey && selectedOptions[itemImageKey] && (
                                <img
                                    src={`${apiBaseUrl}${selectedOptions[itemImageKey]}`}
                                    alt={selectedOptions[itemLabelKey]}
                                    style={{ width: '24px', height: '24px', borderRadius: '50%', ...itemImageStyle }}
                                />
                            )}
                            <div>
                                <span style={itemLabelStyle}>{selectedOptions[itemLabelKey]}</span>
                                {itemDescriptionKey && selectedOptions[itemDescriptionKey] && (
                                    <div style={{ fontSize: '0.8em', color: themeColors.textTint, ...itemDescriptionStyle }}>
                                        {selectedOptions[itemDescriptionKey]}
                                    </div>
                                )}
                            </div>
                            <Icon name="close" size={12} color={themeColors.textTint} />
                        </div>
                    </div>
                ) : (
                    <div ref={anchorRef} style={{
                        padding: '10px',
                        border: '1px solid #ccc',
                        cursor: 'pointer',
                        borderColor: themeColors.medium,
                        borderWidth: '2px',
                        borderRadius: '10px',
                        borderStyle: 'solid',
                    }}>
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', outline: 'none', border: 'none' }}
                            onFocus={() => searchTerm && openPopover()}
                        />
                    </div>
                )}

                {/* Multiple selection pills */}
                {multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px', marginBottom: 10 }}>
                        {selectedOptions.map((item) => (
                            <div
                                key={item[itemLabelKey]}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px 8px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '0.9em',
                                    gap: '5px',
                                    cursor: 'pointer'
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeOption(item);
                                }}
                            >
                                {itemImageKey && item[itemImageKey] && (
                                    <img
                                        src={`${apiBaseUrl}${item[itemImageKey]}`}
                                        alt={item[itemLabelKey]}
                                        style={{ width: '16px', height: '16px', borderRadius: '50%', ...itemImageStyle }}
                                    />
                                )}
                                <div>
                                    <span style={itemLabelStyle}>{item[itemLabelKey]}</span>
                                    {itemDescriptionKey && item[itemDescriptionKey] && (
                                        <div style={{ fontSize: '0.8em', color: themeColors.textTint, ...itemDescriptionStyle }}>
                                            {item[itemDescriptionKey]}
                                        </div>
                                    )}
                                </div>
                                <Icon name="close" size={12} color={themeColors.textTint} />
                            </div>
                        ))}
                    </div>
                )}

                <Popover
                    isOpen={isOpen}
                    anchorRef={anchorRef as React.RefObject<HTMLElement>}
                    onClose={closePopover}
                    zIndex={99999999999}
                    content={
                        <div style={{ maxHeight: '200px', overflowY: 'auto', ...popoverStyle }}>
                            {isSearching ? (
                                <div style={{ padding: '8px', textAlign: 'center', color: themeColors.textTint }}>
                                    {searchingText}
                                </div>
                            ) : searchOptions.length === 0 ? (
                                <div style={{ padding: '8px', textAlign: 'center', color: themeColors.textTint }}>
                                    {noResultsText}
                                </div>
                            ) : (
                                searchOptions.map((option, index) => {
                                    const isSelected = multiple
                                        ? selectedOptions.some((o: any) => o[itemLabelKey] === option[itemLabelKey])
                                        : selectedOptions?.[itemLabelKey] === option[itemLabelKey];

                                    return (
                                        <div
                                            key={option[itemLabelKey]}
                                            ref={(el) => { optionRefs.current[index] = el }}
                                            onClick={() => handleSelectOption(option)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px',
                                                cursor: 'pointer',
                                                backgroundColor: isSelected
                                                    ? themeColors.medium : activeIndex === index ? themeColors.light
                                                        : 'transparent',
                                                color: isSelected ? '#fff' : activeIndex === index ? themeColors.textShade
                                                    : 'inherit',
                                            }}
                                        >
                                            {itemImageKey && option[itemImageKey] && (
                                                <img
                                                    src={`${apiBaseUrl}${option[itemImageKey]}`}
                                                    alt={option[itemLabelKey]}
                                                    style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px', ...itemImageStyle }}
                                                />
                                            )}
                                            <div>
                                                <div style={itemLabelStyle}>{option[itemLabelKey]}</div>
                                                {itemDescriptionKey && option[itemDescriptionKey] && (
                                                    <div style={{ fontSize: '0.8em', ...itemDescriptionStyle }}>
                                                        {option[itemDescriptionKey]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    }
                    containerStyle={{ width: popoverWidth }}
                />
            </div>

            {description && (
                <p style={{
                    fontWeight: 300,
                    fontStyle: 'italic',
                    display: 'block',
                    padding: '3px',
                    margin: 0,
                    color: themeColors.textTint,
                    fontSize: '.9em',
                    ...descriptionStyle
                }}>
                    {description}
                </p>
            )}
        </>
    );

};

export default AutocompleteField;


