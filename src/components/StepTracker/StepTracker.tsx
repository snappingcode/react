import React from "react";
import themeColors from "../../config/themeColors";
import Icon from "../Icon/Icon";

interface Step {
    status: "incomplete" | "pending" | "completed" | "scheduled" | "expired" | "observed" | "draft";
    description?: string;
    [key: string]: any;
}

interface StepTrackerProps {
    steps: Step[];
    stepLabelKey: string;
}

const StepTracker: React.FC<StepTrackerProps> = ({ steps, stepLabelKey }) => {
    return (
        <div style={styles.container}>
            {steps.map((item, index) => {
                let statusIcon;
                let displayStatus;

                switch (item.status) {
                    case "incomplete":
                    case "pending":
                        statusIcon = (
                            <Icon
                                name="circleOutline"
                                color={themeColors.primary}
                                size={28}
                            />
                        );
                        displayStatus = "Pendiente";
                        break;

                    case "completed":
                        statusIcon = (
                            <Icon
                                name="checkmarkCircle"
                                size={28}
                                color={themeColors.primary}
                                style={styles.statusIcon}
                            />
                        );
                        displayStatus = "Completado";
                        break;

                    case "scheduled":
                        statusIcon = (
                            <Icon
                                name="circleOutline"
                                color={themeColors.primary}
                                size={28}
                            />
                        );
                        displayStatus = "Programado";
                        break;

                    case "expired":
                        statusIcon = (
                            <Icon
                                name="alertCircle"
                                color={themeColors.danger}
                                size={28}
                            />
                        );
                        displayStatus = "Vencido";
                        break;

                    case "observed":
                        statusIcon = (
                            <Icon
                                name="alertCircle"
                                color={themeColors.danger}
                                size={28}
                            />
                        );
                        displayStatus = "Observado";
                        break;

                    case "draft":
                        statusIcon = (
                            <Icon
                                name="saveAsDraft"
                                size={20}
                                color={themeColors.medium}
                                style={{ position: "relative", top: 3, left: 1 }}
                            />
                        );
                        displayStatus = "Borrador";
                        break;

                    default:
                        displayStatus = "";
                        break;
                }

                return (
                    <div style={styles.step} key={index}>
                        {index !== 0 && (
                            <>
                                <div style={{ ...styles.solidLine, ...styles.solidLeftLine }} />
                                <div style={{ ...styles.dashedLine, ...styles.dashedLeftLine }}>
                                    <svg width="32" height="3" style={styles.dashedSVG}>
                                        <line
                                            x1="0" y1="1.5" x2="32" y2="1.5"
                                            stroke={themeColors.primary}
                                            strokeWidth="3"
                                            strokeDasharray="5,4"
                                        />
                                    </svg>
                                </div>
                            </>
                        )}
                        <div style={{
                            height: 30,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <div style={styles.label}>{item[stepLabelKey]}</div>
                        </div>

                        <div style={styles.statusIconWrapper}>{statusIcon}</div>
                        <div style={styles.displayStatus}>{displayStatus}</div>

                        {index !== steps.length - 1 && (
                            <>
                                <div style={{ ...styles.solidLine, ...styles.solidRightLine }} />
                                <div style={{ ...styles.dashedLine, ...styles.dashedRightLine }}>
                                    <svg width="32" height="3" style={styles.dashedSVG}>
                                        <line
                                            x1="0" y1="1.5" x2="32" y2="1.5"
                                            stroke={themeColors.primary}
                                            strokeWidth="3"
                                            strokeDasharray="5,4"
                                        />
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

StepTracker.displayName = "StepTracker";

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingLeft: 0,
        paddingRight: 15,
    },
    step: {
        width: 90,
        height: 75,
        position: "relative",
    },
    label: {
        textAlign: "center",
        fontWeight: "500",
        color: themeColors.primaryShade,
        fontSize: 11
    },
    statusIconWrapper: {
        width: 30,
        height: 30,
        borderColor: themeColors.primary,
        borderWidth: 3,
        borderRadius: "50%",
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        top: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    statusIcon: {
        position: "absolute",
    },
    displayStatus: {
        textAlign: "center",
        position: "relative",
        top: 28,
        color: themeColors.textTint,
        fontSize: 12,
    },
    solidLine: {
        position: "absolute",
        height: 3,
        backgroundColor: themeColors.primary,
        width: 34,
        top: 43,
    },
    solidRightLine: {
        right: 0,
    },
    solidLeftLine: {
        left: 0,
    },
    dashedLine: {
        position: "absolute",
        width: 32,
        top: 43,
    },
    dashedRightLine: {
        right: -24,
    },
    dashedLeftLine: {
        left: -22,
    },
    dashedSVG: {
        display: "block",
    },
};

export default StepTracker;
