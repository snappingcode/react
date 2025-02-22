import React, { useState, useRef, useEffect } from 'react';

import { themeColors } from '../../../config';
import { httpClient, securedHttpClient } from '../../../httpClient';
import Icon from '../../Icon/Icon';
import Popover from '../../Popover/Popover';


interface AutocompleteFieldProps {
    label?: string;
    description?: string;
    options?: { [key: string]: any }[];
    value?: string | string[];
    multiple?: boolean;
    onChange: (selectedValue: string | string[]) => void;
    containerStyle?: React.CSSProperties;
    labelStyle?: React.CSSProperties;
    descriptionStyle?: React.CSSProperties;
    popoverStyle?: React.CSSProperties;
    baseUrl: string;
    path: string;
    useInterceptor?: boolean;
    searchParam?: string;
    noResultsText?: string;
    searchingText?: string;
    primaryKey?: string;
    secondaryKey?: string;
    thumbnailKey?: string;
}

const AutocompleteField: React.FC<AutocompleteFieldProps> = ({
    label,
    description,
    options = [],
    multiple = false,
    value = multiple ? [] : '',
    onChange,
    containerStyle = {},
    labelStyle = {},
    popoverStyle = {},
    descriptionStyle = {},
    baseUrl,
    path,
    useInterceptor = true,
    searchParam = "search",
    noResultsText = "No results found",
    searchingText = "Searching...",
    primaryKey = "name",
    secondaryKey,
    thumbnailKey,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOptions, setSearchOptions] = useState(options);
    const [selectedOptions, setSelectedOptions] = useState<string | string[]>(value);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined); // Width for Popover

    const anchorRef = useRef<HTMLDivElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const openPopover = () => setIsOpen(true);
    const closePopover = () => setIsOpen(false);

    useEffect(() => {
        setSelectedOptions(value);
    }, [value]);

    useEffect(() => {
        const client = useInterceptor ? securedHttpClient : httpClient;
        client.setBaseURL(baseUrl);
    }, [baseUrl, useInterceptor]);

    useEffect(() => {
        if (anchorRef.current) {
            setPopoverWidth(anchorRef.current.offsetWidth - 20); // Set width based on anchor
        }
    }, [anchorRef.current?.offsetWidth]);

    const fetchOptions = async (query: string) => {
        setIsSearching(true);
        try {
            const client = useInterceptor ? securedHttpClient : httpClient;
            const response = await client.get(`${path}?${searchParam}=${query}`);
            setSearchOptions(response);
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

    const handleSelectOption = (optionName: string) => {
        if (multiple) {
            const newSelection = Array.isArray(selectedOptions)
                ? selectedOptions.includes(optionName)
                    ? selectedOptions.filter((v) => v !== optionName)
                    : [...selectedOptions, optionName]
                : [optionName];
            setSelectedOptions(newSelection);
            onChange(newSelection);
        } else {
            setSelectedOptions(optionName);
            onChange(optionName);
            closePopover();
        }
    };

    const removeOption = (optionName: string) => {
        if (multiple && Array.isArray(selectedOptions)) {
            const newSelection = selectedOptions.filter((v) => v !== optionName);
            setSelectedOptions(newSelection);
            onChange(newSelection);
        } else if (!multiple) {
            setSelectedOptions('');
            onChange('');
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
            handleSelectOption(searchOptions[activeIndex][primaryKey]);
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
            <div style={{ position: 'relative', ...containerStyle }}>
                <label style={labelStyle}>{label}</label>

                {/* Renderizar el input o la pill seleccionada en el modo de selección única */}
                {(!multiple && selectedOptions) ? (
                    <div
                        style={{
                            border: '1px solid #ccc',
                            padding: 5
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '10px',
                                border: '1px solid #ccc'
                            }}
                            onClick={() => removeOption(selectedOptions as string)}
                        >
                            {thumbnailKey && searchOptions.find((opt) => opt[primaryKey] === selectedOptions)?.[thumbnailKey] && (
                                <img
                                    src={`${baseUrl}${searchOptions.find((opt) => opt[primaryKey] === selectedOptions)?.[thumbnailKey]}`}
                                    alt={selectedOptions as string}
                                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                />
                            )}
                            <div>
                                <span>{searchOptions.find((opt) => opt[primaryKey] === selectedOptions)?.[primaryKey]}</span>
                                {secondaryKey && searchOptions.find((opt) => opt[primaryKey] === selectedOptions)?.[secondaryKey] && (
                                    <div style={{ fontSize: '0.8em', color: themeColors.textTint }}>
                                        {searchOptions.find((opt) => opt[primaryKey] === selectedOptions)?.[secondaryKey]}
                                    </div>
                                )}
                            </div>
                            <Icon name="close" size={12} color={themeColors.textTint} />
                        </div>

                    </div>
                ) : (
                    <div ref={anchorRef} style={{ padding: '10px', border: '1px solid #ccc', cursor: 'pointer' }}>
                        <input
                            type="text"
                            placeholder="Escriba para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', outline: 'none', border: 'none' }}
                            onFocus={() => searchTerm && openPopover()}
                        />
                    </div>
                )}

                {/* Pills para selección múltiple */}
                {multiple && Array.isArray(selectedOptions) && selectedOptions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                        {selectedOptions.map((val) => {
                            const optionData = searchOptions.find((opt) => opt[primaryKey] === val);
                            return (
                                <div key={val} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '5px 8px',
                                    backgroundColor: '#e0e0e0',
                                    borderRadius: '12px',
                                    fontSize: '0.9em',
                                    gap: '5px',
                                }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeOption(val);
                                    }}>
                                    {thumbnailKey && optionData?.[thumbnailKey] && (
                                        <img
                                            src={`${baseUrl}${optionData[thumbnailKey]}`}
                                            alt={val}
                                            style={{ width: '16px', height: '16px', borderRadius: '50%' }}
                                        />
                                    )}
                                    <div>
                                        <span>{optionData?.[primaryKey]}</span>
                                        {secondaryKey && optionData?.[secondaryKey] && (
                                            <div style={{ fontSize: '0.8em', color: themeColors.textTint }}>
                                                {optionData[secondaryKey]}
                                            </div>
                                        )}
                                    </div>
                                    <Icon name="close" size={12} color={themeColors.textTint} />
                                </div>
                            );
                        })}
                    </div>
                )}

                <Popover
                    isOpen={isOpen}
                    anchorRef={anchorRef as React.RefObject<HTMLElement>}
                    onClose={closePopover}
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
                                searchOptions.map((option, index) => (
                                    <div
                                        key={index}
                                        //ref={(el) => (optionRefs.current[index] = el)}
                                        ref={(el) => {
                                            optionRefs.current[index] = el; // Asigna el elemento al ref
                                        }}
                                        onClick={() => handleSelectOption(option[primaryKey])}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '8px',
                                            cursor: 'pointer',
                                            backgroundColor: activeIndex === index
                                                ? themeColors.textTint
                                                : Array.isArray(selectedOptions) && selectedOptions.includes(option[primaryKey])
                                                    ? themeColors.textTint
                                                    : 'transparent',
                                            color: activeIndex === index
                                                ? '#fff'
                                                : Array.isArray(selectedOptions) && selectedOptions.includes(option[primaryKey])
                                                    ? '#fff'
                                                    : 'inherit',
                                        }}
                                    >
                                        {thumbnailKey && option[thumbnailKey] && (
                                            <img
                                                src={`${baseUrl}${option[thumbnailKey]}`}
                                                alt={option[primaryKey]}
                                                style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }}
                                            />
                                        )}
                                        <div>
                                            <div>{option[primaryKey]}</div>
                                            {secondaryKey && option[secondaryKey] && (
                                                <div style={{ fontSize: '0.8em', color: themeColors.textTint }}>
                                                    {option[secondaryKey]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    }
                    containerStyle={{
                        width: popoverWidth,
                    }}
                />
            </div>

            {description && <p style={{
                fontWeight: 300,
                fontStyle: 'italic',
                display: 'block',
                padding: '3px',
                margin: 0,
                color: themeColors.textTint,
                fontSize: '.9em',
                ...descriptionStyle
            }}>{description}</p>}
        </>
    );
};

export default AutocompleteField;


