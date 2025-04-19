import React, { useState } from 'react';

interface JsonViewerProps {
    data: any;
    level?: number;
    collapsed?: boolean;
    containerStyle?: React.CSSProperties;
}

const isObject = (value: any) => value && typeof value === 'object' && !Array.isArray(value);
const isArray = (value: any) => Array.isArray(value);

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0, collapsed = false, containerStyle }) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);
    const toggle = () => setIsCollapsed(!isCollapsed);

    const renderValue = (value: any) => {
        if (isObject(value) || isArray(value)) {
            return <JsonViewer data={value} level={level + 1} collapsed={true} />;
        }
        return <span style={{ color: '#007acc' }}>{JSON.stringify(value)}</span>;
    };

    const indentStyle = {
        //paddingLeft: `${level * 8}px`,
        paddingLeft: 4,
        paddingBottom: 4
    };

    if (level === 0) {
        return (
            <div style={{ fontFamily: 'monospace', fontSize: 14, ...containerStyle }}>
                <JsonViewer data={data} level={level + 1} collapsed={collapsed} />
            </div>
        );
    }

    if (isArray(data)) {
        return (
            <div style={indentStyle}>
                {isCollapsed ? (
                    <div onClick={toggle} style={{ cursor: 'pointer', fontWeight: 'bold' }}>[...]</div>
                ) : (
                    <>
                        <div onClick={toggle} style={{ cursor: 'pointer', fontWeight: 'bold' }}>[</div>
                        {data.map((item, index) => (
                            <div key={index} style={{
                                //paddingLeft: `${(level + 1) * 8}px`,
                                paddingLeft: 16,
                                display: 'flex'
                            }}>
                                <strong style={{
                                    // position: 'relative',
                                    // left: 8
                                }}>{index}:</strong> {renderValue(item)}
                            </div>
                        ))}
                        {/* <div style={indentStyle}>]</div> */}
                        <div style={{}}>]</div>
                    </>
                )}
            </div>
        );
    }

    if (isObject(data)) {
        return (
            <div style={indentStyle}>
                {isCollapsed ? (
                    <div onClick={toggle} style={{ cursor: 'pointer', fontWeight: 'bold' }}>{'{...}'}</div>
                ) : (
                    <>
                        <div onClick={toggle} style={{ cursor: 'pointer', fontWeight: 'bold' }}>{'{'}</div>
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key} style={{
                                paddingLeft: 16,
                                display: 'flex'
                                //paddingLeft: `${(level + 1) * 8}px` 
                            }}>
                                <strong>{key}:</strong> {renderValue(value)}
                            </div>
                        ))}
                        {/* <div style={indentStyle}>{'}'}</div> */}
                        <div style={{}}>{'}'}</div>
                    </>
                )}
            </div>
        );
    }

    return <div style={indentStyle}>{renderValue(data)}</div>;
};

export default JsonViewer;
