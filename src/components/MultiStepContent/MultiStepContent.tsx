
import React, { useState, CSSProperties } from 'react';
import DynamicForm from '../DynamicForm/DynamicForm';

interface StepConfig {
    type: string; // Tipo de paso, ej. "selection", "form", "buttonGroup", etc.
    name: string; // Identificador único del paso.
    displayName: string; // Nombre visible del paso.
    config?: Record<string, any>; // Configuración específica para el paso.
}

interface MultiStepContentProps {
    containerStyle?: CSSProperties; // Estilo para el contenedor principal.
    steps: StepConfig[]; // Lista de pasos.
}

const MultiStepContent: React.FC<MultiStepContentProps> = ({ containerStyle, steps }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const currentStep = steps[currentStepIndex];

    const goToNextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        }
    };

    const goToPreviousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    return (
        <div style={containerStyle}>

            <h3>{currentStep?.displayName}</h3>

            <div>

                {currentStep?.type === 'form' && (
                    <div>
                        <DynamicForm
                            fields={currentStep?.config?.fields}
                        />
                        {/* Lógica específica para 'form' */}
                    </div>
                )}
                {currentStep?.type === 'buttonGroup' && (
                    <div>
                        <p>Renderiza botones aquí.</p>
                        {/* Lógica específica para 'buttonGroup' */}
                    </div>
                )}
            </div>

            <div>
                <button onClick={goToPreviousStep} disabled={currentStepIndex === 0}>
                    Anterior
                </button>
                <button onClick={goToNextStep} disabled={currentStepIndex === steps.length - 1}>
                    Siguiente
                </button>
            </div>
        </div>
    );
};

export default MultiStepContent;
