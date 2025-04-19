import React, { useRef, useState } from 'react';
import Button from '../Button/Button';
import IconButton from '../IconButton/IconButton';
import { themeColors } from '../../../config';

interface FileSelectButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick'> {
    onFileSelect: (file: File) => void;
    onFileClear: () => void;
    accept?: string;

    selectedFileContainerStyle?: React.CSSProperties;
    selectedFileNameStyle?: React.CSSProperties;
    clearIcon?: string;
    clearIconColor?: string;
    clearIconSize?: number;
}

const FileSelectButton: React.FC<FileSelectButtonProps> = ({
    title,
    onFileSelect,
    onFileClear,
    accept,
    selectedFileContainerStyle,
    selectedFileNameStyle,
    clearIcon = 'close',
    clearIconColor,
    clearIconSize,
    //startIcon = 'file',
    ...buttonProps
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            onFileSelect(file);
        }
    };

    const handleClear = () => {
        setSelectedFile(null);
        onFileClear();
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <>
            {!selectedFile ? (
                <>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <Button
                        title={title} onClick={() => inputRef.current?.click()} startIcon={buttonProps.startIcon || 'file'} {...buttonProps} />
                </>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        position: 'relative',
                        ...selectedFileContainerStyle,
                    }}
                >
                    <span style={{ flex: 1, ...selectedFileNameStyle }}>{selectedFile.name}</span>
                    <IconButton
                        icon={clearIcon}
                        type="clear"
                        size="xs"
                        onClick={handleClear}
                        aria-label="Clear"
                        hasShadow={false}
                        color={clearIconColor || themeColors.text}
                        iconSize={clearIconSize}
                    />
                </div>
            )}
        </>
    );
};

export default FileSelectButton;
