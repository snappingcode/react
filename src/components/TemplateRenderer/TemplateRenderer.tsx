import React from "react";
//import { Parser } from "expr-eval";

interface TemplateRendererProps {
    context: { [key: string]: any };
    template?: string;
    containerStyle?: React.CSSProperties;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ context, template, containerStyle }) => {
    //const parser = new Parser();

    // Function to replace placeholders {{ key }} with actual values from context
    const interpolateString = (template: string): string => {
        // return template.replace(/{{\s*([\w\.]+)\s*}}/g, (_, key) => {
        //     try {
        //         return parser.evaluate(key, context)?.toString() || "";
        //     } catch (error) {
        //         console.error(`Error parsing ${key}:`, error);
        //         return "";
        //     }
        // });
        return template.replace(/{{\s*([\w\.]+)\s*}}/g, (_, key) => {
            try {
                return key in context ? String(context[key]) : "";
            } catch {
                return "";
            }
        });
    };

    return (
        <div className="snapping-template-renderer" style={{ ...containerStyle }}>
            {template ? (
                <div dangerouslySetInnerHTML={{ __html: interpolateString(template) }} />
            ) : null}
        </div>
    );
};

export default TemplateRenderer;
