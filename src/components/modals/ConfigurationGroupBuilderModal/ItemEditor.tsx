import React, { useEffect } from "react";
import TextField from "../../fields/TextField/TextField";

interface ConfigType {
    description: string | null;
    colSpan: number;
    onlyTypes: string[];
    onlyWith: string[];
    showIf: string | null;
    showInModes: string[];
    readonly: boolean | null;
    readonlyIf: boolean | null;
    editable: boolean | null;
    editPath: string | null;
    editableIf: boolean;
    [key: string]: any; // To allow additional keys
}

interface ItemData {
    type: string;
    label: string;
    name: string;
    config: ConfigType;
    icon: string;
    [key: string]: any;
}

interface ItemEditorProps {
    data: ItemData;
    onChange: (newData: ItemData) => void;
}

const ItemEditor: React.FC<ItemEditorProps> = ({ data, onChange }) => {
    useEffect(() => {
        console.log("data", data);
    }, [data]);

    // Handler for first-level fields
    const handleFieldChange = (key: string, value: any) => {
        const updatedData = { ...data, [key]: value };
        onChange(updatedData);
    };

    // Handler for config fields
    const handleConfigFieldChange = (key: string, value: any) => {
        const updatedConfig = { ...data.config, [key]: value };
        const updatedData = { ...data, config: updatedConfig };
        onChange(updatedData);
    };

    return (
        <div>
            {data && (
                <>
                    {/* Edit label and name */}
                    {["name", "label"].map((key) => (
                        <div
                            style={{
                                marginTop: 15
                            }}
                            key={key}
                        >
                            <TextField
                                value={data[key] || ""}
                                label={key === "name" ? "Nombre" : "Label"}
                                onChange={(value: string) => handleFieldChange(key, value)}
                            />
                        </div>
                    ))}

                    {/* Edit config fields */}
                    {data.config && (
                        <div style={{ marginTop: "1rem" }}>
                            <h4>Config</h4>
                            {Object.keys(data.config).map((configKey) => (
                                <div
                                    key={configKey}
                                    style={{
                                        marginTop: 15
                                    }}
                                >
                                    <TextField
                                        value={
                                            data.config[configKey] !== null
                                                ? String(data.config[configKey])
                                                : ""
                                        }
                                        label={configKey}
                                        onChange={(value: string) =>
                                            handleConfigFieldChange(configKey, value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemEditor;
