import { useState } from "react";
import Icon from "../../Icon/Icon";


interface CopyButtonProps {
    //copyText: string;
    textToCopy: string;
    label?: string;
    className?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, label, className }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Vuelve al ícono de copiar después de 2s
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            //className={`flex items-center gap-2 px-3 py-2 border rounded ${className}`}
            className={`${className}`}
            onClick={handleCopy}
            style={{
                border: 'none'
            }}
        >
            {label && <span>{label}</span>}
            <Icon name={copied ? "check" : "copy"} />
        </button>
    );
};
