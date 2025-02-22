import React from 'react';
import themeColors from '../../config/themeColors';

interface GridLoaderProps {
    color?: string;
    size?: number;
}

const GridLoader: React.FC<GridLoaderProps> = ({ color = 'text', size = 40 }) => {
    const resolvedColor = color in themeColors ? themeColors[color as keyof typeof themeColors] : color;

    // Estilos en JavaScript
    const gridLoaderStyle: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '5px',
        justifyItems: 'center',
        alignItems: 'center',
        width: size,
        height: size,
    };

    const dotStyle: React.CSSProperties = {
        width: '80%',
        height: '80%',
        borderRadius: '50%',
        backgroundColor: resolvedColor,
        animation: 'dot-animation 1.5s infinite ease-in-out',
    };

    const keyframes = `
    @keyframes dot-animation {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(0.6);
        opacity: 0.6;
      }
    }
  `;

    const insertKeyframes = () => {
        const styleSheet = document.styleSheets[0];
        if (styleSheet) {
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
        }
    };

    React.useEffect(() => {
        insertKeyframes();
    }, []);

    return (
        <div className="precooked-grid-loader" style={gridLoaderStyle}>
            {[...Array(9)].map((_, index) => (
                <span
                    key={index}
                    style={{
                        ...dotStyle,
                        animationDelay: index % 2 === 0 ? '0.2s' : '0.4s',
                    }}
                />
            ))}
        </div>
    );
};

export default GridLoader;
