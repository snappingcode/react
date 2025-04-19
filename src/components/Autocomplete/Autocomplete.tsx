import React, { useState, useRef, useEffect } from 'react';
import { httpClient, securedHttpClient } from '../../httpClient';
import { themeColors } from '../../config';
import Icon from '../Icon/Icon';
import Popover from '../Popover/Popover';


interface AutocompleteProps {
    apiBaseUrl?: string;
    path?: string;
    useAuthToken?: boolean;
    localData?: any[];
    renderItem?: (item: any, index: number, results: any[]) => React.ReactNode;
    itemStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    searchInputStyle?: React.CSSProperties;
    placeholder?: string;
    loadingText?: string;
    noResultsText?: string;
    minSearchLength?: number;
    debounceTime?: number;
    onSelect?: (item: any) => void;
    onSearch?: (query: string) => void;
    errorText?: string;
    disabled?: boolean;
    defaultValue?: string;
    popoverStyle?: React.CSSProperties;
    loadingIndicator?: React.ReactNode;
    maxResults?: number;
    itemLabelKey?: string;
    itemDescriptionKey?: string;
    itemImageKey?: string;
    itemLabelStyle?: React.CSSProperties;
    itemDescriptionStyle?: React.CSSProperties;
    itemImageStyle?: React.CSSProperties;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
    apiBaseUrl,
    path,
    useAuthToken = false,
    localData = [],
    renderItem,
    itemStyle,
    containerStyle,
    searchInputStyle,
    placeholder = 'Search...',
    loadingText = 'Searching...',
    noResultsText = 'No results found.',
    minSearchLength = 1,
    debounceTime = 300,
    onSelect,
    onSearch,
    errorText = 'An error occurred.',
    disabled = false,
    defaultValue = '',
    popoverStyle,
    loadingIndicator,
    maxResults = 10,
    itemLabelKey,
    itemDescriptionKey,
    itemImageKey,
    itemLabelStyle,
    itemDescriptionStyle,
    itemImageStyle
}) => {
    const [query, setQuery] = useState(defaultValue);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPopoverOpen, setPopoverOpen] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const debounceTimeout = useRef<number | null>(null);
    const [popoverWidth, setPopoverWidth] = useState<number | undefined>(undefined);
    const client = useAuthToken ? securedHttpClient : httpClient;
    if (apiBaseUrl) client.setBaseURL(apiBaseUrl);
    const handleSearch = async (searchQuery: string) => {
        setError(null);
        setLoading(true);

        try {
            //const url = apiBaseUrl && path ? `${apiBaseUrl}${path}` : path || '';
            if (onSearch) onSearch(searchQuery);

            if (path) {
                const response = await client.get(`${path}?query=${encodeURIComponent(searchQuery)}`);
                setResults(response?.data.slice(0, maxResults));
            } else {
                const filteredData = localData.filter((item) =>
                    JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
                );
                setResults(filteredData.slice(0, maxResults));
            }
            setHasSearched(true);
        } catch (err) {
            setError(errorText);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < minSearchLength) {
            setResults([]);
            setPopoverOpen(false);
            setHasSearched(false);
            return;
        }

        setPopoverOpen(true);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = window.setTimeout(() => handleSearch(value), debounceTime);
    };

    const handleSelect = (item: any) => {
        if (onSelect) onSelect(item);
        //setQuery(item.label || item.name || '');
        setQuery('');
        setPopoverOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isPopoverOpen || results.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(results[activeIndex]);
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

    const renderContent = () => {
        if (loading) return loadingIndicator || <p>{loadingText}</p>;
        if (error) return <p style={{ color: 'red' }}>{error}</p>;
        if (hasSearched && results.length === 0) return <p>{noResultsText}</p>;

        return results.map((item, index) => (
            <div
                key={index}
                ref={(el) => {
                    optionRefs.current[index] = el; // Asigna el elemento al ref
                }}
                onClick={() => handleSelect(item)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: activeIndex === index ? "#f0f0f0" : "transparent",
                    borderBottom: index === results.length - 1 ? "none" : "1px solid #ccc",
                    color: themeColors.text,
                    fontSize: 14,
                    ...itemStyle,
                }}
            >
                {/* Si renderItem está definido, lo usamos en lugar de la estructura predeterminada */}
                {renderItem
                    ? renderItem(item, index, results)
                    : (
                        <>
                            {/* Imagen a la izquierda */}
                            {itemImageKey && item[itemImageKey] && (
                                <img
                                    src={item[itemImageKey]}
                                    alt=""
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        marginRight: 10,
                                        ...itemImageStyle
                                    }}
                                />
                            )}

                            {/* Contenedor de texto */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {itemLabelKey && <span style={{ fontWeight: "bold", ...itemLabelStyle }}>{item[itemLabelKey]}</span>}
                                {itemDescriptionKey && <span style={{ color: "#777", ...itemDescriptionStyle }}>{item[itemDescriptionKey]}</span>}
                            </div>
                        </>
                    )}
            </div>
        ));
    };
    useEffect(() => {
        if (inputRef.current) {
            setPopoverWidth(inputRef.current.offsetWidth);
        }
    }, [inputRef.current?.offsetWidth, query]);

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                maxWidth: 800,
                ...containerStyle
            }}
            onKeyDown={handleKeyDown}
            tabIndex={0} // To enable key events on the container
        >
            <div style={{
                position: 'relative',
            }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        paddingLeft: 15,
                        paddingRight: 40,
                        paddingBottom: 12,
                        paddingTop: 12,
                        borderRadius: 99,
                        border: 'none',
                        color: themeColors.text,
                        fontWeight: 500,
                        boxShadow: '0 2px 0px rgba(0, 0, 0, 0.1)',
                        background: '#ffffff',
                        ...searchInputStyle
                        //border: '1px solid #ccc', ...searchInputStyle
                    }}
                    disabled={disabled}
                />
                <Icon
                    name={'search'}
                    size={26}
                    color={themeColors.textTint}
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        marginTop: -13
                    }}
                />
            </div>

            {hasSearched && (
                <>
                    <Popover
                        content={renderContent()}
                        anchorRef={inputRef as React.RefObject<HTMLElement>}
                        isOpen={isPopoverOpen}
                        onClose={() => setPopoverOpen(false)}
                        containerStyle={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            borderRadius: '5px',
                            boxShadow: '0 4px 0px rgba(0, 0, 0, 0.1)',
                            width: popoverWidth,
                            zIndex: 999999,
                            ...popoverStyle
                        }}
                        backdropStyle={{
                            backgroundColor: 'transparent',
                            zIndex: 999999
                        }}

                    />
                </>

            )}
        </div>
    );
};

export default Autocomplete;
