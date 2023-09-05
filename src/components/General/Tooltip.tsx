import React, {useRef, useState, useMemo, FC, ReactNode, useEffect} from "react";

type TooltipPropsType = {
    children: ReactNode
    text?: string;
    isVisible?: boolean;
}

export const Tooltip: FC<TooltipPropsType> = ({children, text, isVisible = false}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);
    const tooltipContainerRef = useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = useState(false);
    const [tooltipHeight, setTooltipHeight] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            setIsHover(false);
        }
    }, [isVisible]);

    useEffect(() => {
        if (isHover && tooltipRef?.current) {
            setTooltipHeight(tooltipRef.current.clientHeight);
        }
    }, [isHover]);

    const tooltipPosition = useMemo(() => {
        if (isHover && tooltipContainerRef?.current) {
            const tooltipContainerProperties = tooltipContainerRef.current.getBoundingClientRect();
            const extraSpace = 10;

            if (tooltipHeight) {
                return {
                    top: tooltipHeight + extraSpace > tooltipContainerProperties.top ? tooltipContainerProperties.bottom + extraSpace : tooltipContainerProperties.top - tooltipHeight - extraSpace,
                    left: tooltipContainerProperties.x + (tooltipContainerProperties.width / 2)
                }
            }
        }
    }, [isHover, tooltipHeight]);

    const tooltipStyle = {
        display: isHover ? 'block' : 'none',
        transform: 'translate(-50%)',
        ...tooltipPosition
    }

    return (
        <div className="relative">
            <div ref={tooltipRef} className="tooltip" style={tooltipStyle}>{text}</div>
            <div
                ref={tooltipContainerRef}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                {children}
            </div>
        </div>
    )
}