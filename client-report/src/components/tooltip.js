import React, { useRef, useState } from 'react'
import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    offset,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
    useRole,
    useTransitionStyles,
} from '@floating-ui/react'

export const Tooltip = ({ children, renderOpener, placement, color }) => {
    const [isOpen, setIsOpen] = useState(false)

    const arrowRef = useRef(null)

    const {
        refs: { setReference, setFloating },
        floatingStyles,
        context,
    } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement,
        middleware: [
            offset(12),
            flip(),
            shift(),
            arrow({
                element: arrowRef,
            }),
        ],
        whileElementsMounted: autoUpdate,
    })

    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'tooltip' })

    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, role])

    const handleOpenerClick = () => {
        setIsOpen(!isOpen)
    }

    const { styles: transitionStyles } = useTransitionStyles(context, {
        initial: {
            opacity: 0,
            // transform: 'scale(0.95)',
            // transformOrigin: 'bottom right',
        },
    })

    return (
        <>
            {renderOpener({
                onClick: handleOpenerClick,
                ref: setReference,
                ...getReferenceProps(),
            })}
            {isOpen && children && (
                <div
                    ref={setFloating}
                    style={{ ...floatingStyles, zIndex: 1 }}
                    {...getFloatingProps()}
                >
                    <div style={{ ...transitionStyles }}>
                        <FloatingArrow
                            tipRadius={2}
                            height={8}
                            ref={arrowRef}
                            context={context}
                            style={{ fill: color }}
                        />
                        {children}
                    </div>
                </div>
            )}
        </>
    )
}
