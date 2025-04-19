import React, { useState } from "react";
import DynamicForm from "../DynamicForm/DynamicForm";
import Button from "../buttons/Button/Button";
import themeColors from "../../config/themeColors";

interface Step {
    title: string;
    fields: any[];
    path: string;
    sendButtonTitle?: string;
    backButtonTitle?: string;
    nextButtonTitle?: string;
    disableBack?: boolean;
    requireSuccessToNext?: boolean;
    onSuccess?: (res: any) => void;
    onError?: (error: any) => void;
}

interface MultiStepFormProps {
    steps: Step[];
    currentStepIndex?: number;
    onStepSuccess?: (currentStepIndex: number, res: any) => void;
    onStepError?: (currentStepIndex: number, error: any) => void;
    onSuccess?: () => void;
    onError?: (error: any) => void;
    primaryColor?: string;
    finishButtonTitle?: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
    steps,
    currentStepIndex = 0,
    // onStepSuccess,
    // onStepError,
    onSuccess,
    //onError,
    primaryColor = "#4caf50",
    finishButtonTitle = "Finish",
}) => {
    const [stepIndex, setStepIndex] = useState(currentStepIndex);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stepSuccess, setStepSuccess] = useState(false);

    // const handleStepSuccess = (res: any) => {
    //     setStepSuccess(true); // Enable "Next" if the step requires success
    //     if (onStepSuccess) onStepSuccess(stepIndex, res);

    //     if (stepIndex === steps.length - 1 && onSuccess) {
    //         onSuccess();
    //     }
    // };

    // const handleStepError = (error: any) => {
    //     setStepSuccess(false); // Ensure that "Next" is blocked in case of error
    //     if (onStepError) onStepError(stepIndex, error);
    //     if (onError) onError(error);
    // };

    const currentStep = steps[stepIndex];

    return (
        <>
            {currentStep &&
                <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
                    {/* Step Indicators */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        alignItems: "center",

                    }}>
                        {steps.map((_step, index) => (
                            <div
                                key={index}
                                style={{
                                    width: index == stepIndex ? 40 : 30,
                                    height: index == stepIndex ? 40 : 30,
                                    borderRadius: "50%",
                                    backgroundColor: index <= stepIndex ? primaryColor : "#ddd",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "bold",
                                    boxSizing: 'border-box'
                                }}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    {/* Current Step Form */}
                    <h2 style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        color: themeColors.text
                    }}>{currentStep?.title}</h2>

                    <DynamicForm
                        fields={currentStep?.fields}
                        sendButtonTitle={currentStep?.sendButtonTitle || "Next"}
                        //savePath={currentStep?.path}
                        submitPath={currentStep?.path}
                        onSubmit={() => {
                            setIsSubmitting(true);
                            setStepSuccess(false); // Block "Next" until the submission resolves
                        }}
                        // onSuccess={(res) => {
                        //     setIsSubmitting(false);
                        //     handleStepSuccess(res);
                        // }}
                        // onError={(error) => {
                        //     setIsSubmitting(false);
                        //     handleStepError(error);
                        // }}
                        sendButtonStyle={{
                            width: '100%',
                        }}
                    />

                    {/* Navigation Buttons */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                        {/* Back Button */}
                        <div>
                            {stepIndex > 0 && (

                                <Button
                                    onClick={() => setStepIndex(stepIndex - 1)}
                                    title={currentStep?.backButtonTitle || "Back"}
                                    disabled={
                                        currentStep?.disableBack ||
                                        stepIndex === 0 ||
                                        isSubmitting // During submission
                                    }
                                    type={'solid'}
                                    hasShadow={false}
                                    style={{
                                        cursor:
                                            currentStep?.disableBack || stepIndex === 0 || isSubmitting
                                                ? "not-allowed"
                                                : "pointer",
                                    }}
                                    color={themeColors.medium}
                                />
                            )}
                        </div>


                        {/* Next Button */}
                        <Button
                            onClick={() => {
                                setStepIndex(stepIndex + 1);
                                if (stepIndex === steps.length - 1 && onSuccess) {
                                    onSuccess();
                                }
                            }}
                            title={stepIndex === steps.length - 1
                                ? finishButtonTitle
                                : currentStep?.nextButtonTitle || "Next"}
                            disabled={
                                (currentStep.requireSuccessToNext && !stepSuccess) ||

                                isSubmitting
                            }

                            type={'solid'}
                            hasShadow={false}
                            style={{
                                cursor:
                                    (!currentStep?.requireSuccessToNext || stepSuccess) && !isSubmitting
                                        ? "pointer"
                                        : "not-allowed",
                            }}
                            color={themeColors.medium}
                        />
                    </div>
                </div>
            }
        </>

    );
};

export default MultiStepForm;
