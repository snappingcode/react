import React from "react";
import { themeColors } from "../../config";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    style?: React.CSSProperties;
    pageButtonStyle?: React.CSSProperties;
    activePageButtonStyle?: React.CSSProperties;
    prevNextButtonStyle?: React.CSSProperties;
    showEllipsis?: boolean;
    showPrevNextButtons?: boolean;
    prevLabel?: string | React.ReactNode;
    nextLabel?: string | React.ReactNode;
    limit?: number;
    renderPageButton?: (page: number, isActive: boolean) => React.ReactNode;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
    style,
    pageButtonStyle,
    activePageButtonStyle,
    prevNextButtonStyle,
    showEllipsis = true,
    showPrevNextButtons = true,
    prevLabel = "← Previous",
    nextLabel = "Next →",
    limit = 5,
    renderPageButton,
}) => {
    // Function to generate the page numbers with "..."
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const halfLimit = Math.floor(limit / 2);

        if (totalPages <= limit) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > halfLimit + 2 && showEllipsis) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - halfLimit);
            const end = Math.min(totalPages - 1, currentPage + halfLimit);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - halfLimit - 1 && showEllipsis) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, ...style }}>
            {/* Previous Button */}
            {showPrevNextButtons && (
                <button
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        opacity: currentPage === 1 ? 0.5 : 1,
                        cursor: currentPage === 1 ? "default" : "pointer",
                        ...prevNextButtonStyle,
                    }}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    {prevLabel}
                </button>
            )}

            {/* Page Numbers */}
            {generatePageNumbers().map((page) =>
                typeof page === "number" ? (
                    renderPageButton ? (
                        renderPageButton(page, page === currentPage)
                    ) : (
                        <button
                            key={`page-${page}`}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 12,
                                cursor: "pointer",
                                border: "1px solid transparent",
                                color: page === currentPage ? themeColors.text : themeColors.textTint,
                                background: "none",
                                ...(page === currentPage ? activePageButtonStyle : pageButtonStyle),
                            }}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    )
                ) : (
                    <span key={`ellipsis-${page}`} style={{ opacity: 0.5, color: themeColors.textTint }}>
                        {page}
                    </span>
                )
            )}


            {/* Next Button */}
            {showPrevNextButtons && (
                <button
                    style={{
                        backgroundColor: "transparent",
                        border: "none",
                        opacity: currentPage === totalPages ? 0.5 : 1,
                        cursor: currentPage === totalPages ? "default" : "pointer",
                        ...prevNextButtonStyle,
                    }}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    {nextLabel}
                </button>
            )}
        </div>
    );
};

export default Pagination;
