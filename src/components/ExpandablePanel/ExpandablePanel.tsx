import React, { useState, useRef, useEffect } from 'react';
import Icon from '../Icon/Icon';

interface ExpandablePanelProps {
    renderHeader: () => React.ReactNode; // Function to render the header content
    renderBody: () => React.ReactNode;   // Function to render the body content
    containerStyle?: React.CSSProperties;
    collapsedIconDirection?: 'down' | 'right'; // Direction of the collapsed state icon
}

const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
    renderHeader,
    renderBody,
    containerStyle,
    collapsedIconDirection = 'down',
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState(0);

    const togglePanel = () => {
        setIsExpanded((prev) => !prev);
    };

    useEffect(() => {
        // Update content height when expanded
        if (isExpanded && contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        } else {
            setContentHeight(0);
        }
    }, [isExpanded]);

    // Determine chevron rotation
    const getChevronRotation = () => {
        if (isExpanded) return '-90deg'; // Always points up when expanded
        return collapsedIconDirection === 'down' ? '90deg' : '0deg';
    };

    return (
        <div style={{
            ...containerStyle
        }}>
            {/* Header */}
            <div
                onClick={togglePanel}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
                <div>{renderHeader()}</div>
                <span
                    style={{
                        transform: `rotate(${getChevronRotation()})`,
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <Icon name={'chevronRightSm'} />
                </span>
            </div>

            {/* Body with animation */}
            <div
                style={{
                    height: `${contentHeight}px`,
                    overflow: 'hidden',
                    transition: 'height 0.3s ease, opacity 0.3s ease',
                    opacity: isExpanded ? 1 : 0,
                }}
            >
                <div ref={contentRef}>{renderBody()}</div>
            </div>
        </div>
    );
};

export default ExpandablePanel;
