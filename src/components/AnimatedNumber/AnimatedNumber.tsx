import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
    from: number; // Initial value
    to: number; // Final value
    duration?: number; // Animation duration in milliseconds (default: 2000ms)
    decimalPlaces?: number; // Number of decimal places (default: 0)
    thousandSeparator?: string; // Separator for thousands (e.g., ",")
    decimalSeparator?: string; // Separator for decimals (e.g., ".")
    style?: React.CSSProperties; // Custom styles
    className?: string; // Custom class for styling
    onComplete?: () => void; // Callback when animation completes
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
    from,
    to,
    duration = 2000,
    decimalPlaces = 0,
    thousandSeparator = ',',
    decimalSeparator = '.',
    style,
    className,
    onComplete,
}) => {
    const [currentValue, setCurrentValue] = useState(from);

    useEffect(() => {
        const startTime = performance.now();
        // const endTime = startTime + duration;

        const animate = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1); // Ensure progress is between 0 and 1
            const value = from + (to - from) * progress;
            setCurrentValue(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCurrentValue(to);
                if (onComplete) onComplete();
            }
        };

        requestAnimationFrame(animate);

        // Cleanup to reset state if the component unmounts
        return () => setCurrentValue(from);
    }, [from, to, duration, onComplete]);

    // Formats the number with separators
    const formatValue = (value: number): string => {
        const parts = value.toFixed(decimalPlaces).split('.');
        const integerPart = parts[0]
            .replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator); // Apply thousand separator
        const decimalPart = parts[1] ? `${decimalSeparator}${parts[1]}` : '';
        return `${integerPart}${decimalPart}`;
    };

    return (
        <span className={className} style={style}>
            {formatValue(currentValue)}
        </span>
    );
};

export default AnimatedNumber;
