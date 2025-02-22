import React from 'react';

interface DotLoaderProps {
    color?: string;
    size?: number;
}

const DotLoader: React.FC<DotLoaderProps> = ({ color = '#36D7B7', size = 40 }) => {
    return (
        <div className="precooked-dot-loader" style={{ width: size, height: size }}>
            <span style={{ backgroundColor: color }} />
            <span style={{ backgroundColor: color }} />
            <span style={{ backgroundColor: color }} />
        </div>
    );
};

export default DotLoader;
