import React from 'react';
import DotLoader from './DotLoader';
import GridLoader from './GridLoader';
import SpinnerLoader from './SpinnerLoader';


interface LoaderProps {
    type?: 'grid' | 'dot' | 'spinner';
    size?: number;
    color?: string;
}

const Loader: React.FC<LoaderProps> = ({ type = 'spinner', size = 40, color = 'text' }) => {
    switch (type) {
        case 'dot':
            return <DotLoader size={size} color={color} />;
        case 'grid':
            return <GridLoader size={size} color={color} />;
        case 'spinner':
        default:
            return <SpinnerLoader size={size} color={color} />;
    }
};

export default Loader;
