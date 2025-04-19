import React, { useEffect, useState } from "react";
import { httpClient, securedHttpClient } from "../../httpClient";

import { themeColors } from "../../config";
import { getNestedValue } from "../../utils/nestedValues";
import IconButton from "../buttons/IconButton/IconButton";

interface EditFieldControlsProps {
    initialValue: string | number; // Valor original antes de editar
    editedValue: string | number;  // Valor actual editado
    fieldName: string; //
    onEditStart?: () => void;
    onEditSuccess?: (updatedValue: any) => void;
    onEditError?: (error: any) => void;
    onEditCancel?: () => void;
    containerStyle?: React.CSSProperties;
    apiBaseUrl?: string;
    useAuthToken?: boolean;
    savePath?: string;
    editIcon?: string;
    saveIcon?: string;
    cancelIcon?: string;
}


const EditFieldControls: React.FC<EditFieldControlsProps> = ({
    initialValue,
    editedValue,
    fieldName,
    onEditStart,
    onEditSuccess,
    onEditError,
    onEditCancel,
    containerStyle,
    apiBaseUrl,
    useAuthToken = false,
    savePath,
    editIcon = "pencil",
    saveIcon = "check",
    cancelIcon = "close",
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const client = useAuthToken ? securedHttpClient : httpClient;
    if (apiBaseUrl) client.setBaseURL(apiBaseUrl);

    const handleEditStart = () => {
        setIsEditing(true);
        onEditStart?.();
    };

    const handleEditCancel = () => {
        setIsEditing(false);
        onEditCancel?.();
    };

    const handleEditConfirm = async () => {
        const original = JSON.stringify(initialValue);
        const current = JSON.stringify(editedValue);
        if (original === current) return; // Comparo valor inicial vs actual
        if (savePath) {
            setIsProcessing(true);
            try {
                const response = await client.patch(savePath, {
                    field: fieldName,
                    value: editedValue
                });
                //onEditSuccess?.(response?.data[fieldName]);
                onEditSuccess?.(getNestedValue(response?.data, fieldName))
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating value:", error);
                onEditError?.(error);
                setIsEditing(false);
            } finally {
                setIsProcessing(false);
            }
        }

    };
    useEffect(() => {
        console.log("editedValue", JSON.stringify(editedValue))
        console.log("initialValue", JSON.stringify(initialValue))
    }, [editedValue, initialValue])
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            padding: 3,
            ...containerStyle
        }}>

            {!isEditing ? (
                <IconButton type="clear" hasShadow={false} color={themeColors.text} size={"sm"} icon={editIcon} onClick={handleEditStart} />
            ) : (
                <>
                    <IconButton type="clear" hasShadow={false} color={themeColors.text} size={"sm"} icon={saveIcon} onClick={handleEditConfirm} disabled={isProcessing || JSON.stringify(editedValue) === JSON.stringify(initialValue)} />
                    <IconButton type="clear" hasShadow={false} color={themeColors.text} size={"sm"} icon={cancelIcon} onClick={handleEditCancel} disabled={isProcessing} />
                </>
            )}
        </div>
    );
};

export default EditFieldControls;
