import React from 'react';
import { Parser } from 'expr-eval';
import * as ev from "expr-eval";
import { Div, Span, Strong } from './BasicComponents';
import Icon from '../Icon/Icon';

interface InterpolatedContentProps {
    extraData: { [key: string]: any };
    htmlContent?: string;
    jsonStructure?: any[];
}

const InterpolatedContent: React.FC<InterpolatedContentProps> = ({ extraData, htmlContent, jsonStructure }) => {
    const parser = new Parser();

    const interpolateString = (template: string) => {
        const regex = /{{\s*([\w\.]+)\s*}}/g;
        return template.replace(regex, (_, key) => {
            try {
                return parser.evaluate(key, extraData)?.toString();
            } catch (error) {
                console.error(`Error parsing ${key}:`, error);
                return '';
            }
        });
    };
    const evaluateShow = (exp: any) => {
        try {
            return exp ? ev.Parser.evaluate(exp, extraData) : true;
        } catch (error) {
            console.error("Error evaluating expression: ", error);
            return false;
        }
    };
    const renderFromJson = (json: any, data: any) => {

        const components: any = {
            Div, Span, Strong, Icon
        };

        const createElementFromNode = (node: any) => {
            const shouldShowCell = (node.showIf && evaluateShow(node.showIf)) || !node.showIf;
            if (shouldShowCell) {
                if (node.type === 'text') {
                    //Interpolar y devolver el texto
                    const interpolatedText = node.content.replace(/{{\s*([\w\.]+)\s*}}/g, (_: any, key: any) => {
                        try {
                            return parser.evaluate(key, data)?.toString();
                        } catch (error) {
                            console.error(`Error parsing ${key}: `, error);
                            return '';
                        }
                    });
                    return interpolatedText;
                } else if (node.type === 'tag') {
                    const Component = components[node.tagName];
                    const props = { ...node.attributes, key: Math.random() };
                    const children = node.children ? node.children.map(createElementFromNode) : [];
                    return <Component {...props}>{children}</Component>;
                }
            }

        };

        return json.map(createElementFromNode);
    };
    return (
        <div className="precooked-interpolated-content">
            {htmlContent ? (
                <div dangerouslySetInnerHTML={{ __html: interpolateString(htmlContent) }} />
            ) : jsonStructure ? (
                renderFromJson(jsonStructure, extraData)
            ) : null}
        </div>
    );
};

export default InterpolatedContent;