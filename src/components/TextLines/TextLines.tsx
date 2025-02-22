import React from "react";

interface TextLinesProps {
    maxCharsPerLine: number;
    maxLines: number;
    text: string;
    style?: React.CSSProperties;
    lineStyle?: React.CSSProperties;
    className?: string;
}

const TextLines: React.FC<TextLinesProps> = ({ maxCharsPerLine, maxLines, text, style, lineStyle, className }) => {
    const getLines = (text: string, maxCharsPerLine: number, maxLines: number): string[] => {
        let words = text.split(' '); // Array con todas las palabras
        const lines = []; // Array con las líneas

        for (let i = 0; i < maxLines; i++) {
            let currentLine = '';

            // Recorrer las palabras disponibles y armar la línea
            while (words.length > 0 && (currentLine.length + words[0].length + 1) <= maxCharsPerLine) {
                currentLine += words.shift() + ' ';
            }

            // Truncar la palabra si es demasiado larga para la línea
            if (words.length > 0 && (currentLine.length + words[0].length + 1) > maxCharsPerLine) {
                if (currentLine.length === 0) {
                    // Si la palabra es demasiado larga para una línea vacía, cortarla
                    currentLine = words[0].slice(0, maxCharsPerLine - 3) + '...';
                    words.shift();
                }
            }

            lines.push(currentLine.trim());

            // Si hemos alcanzado el número máximo de líneas y aún hay palabras, truncar la última línea
            if (i === maxLines - 1 && words.length > 0) {
                let lastLine: any = lines.pop();
                lastLine = lastLine.slice(0, maxCharsPerLine - 3) + '...';
                lines.push(lastLine);
                break;
            }
        }

        return lines;
    };

    const lines = getLines(text, maxCharsPerLine, maxLines);

    return (
        <div className={className} style={style}>
            {lines.map((line, index) => (
                <div key={index} style={lineStyle}>{line}</div>
            ))}
        </div>
    );
};

export default TextLines;
