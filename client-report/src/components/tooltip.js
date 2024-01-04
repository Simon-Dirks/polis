import {
    arrow,
    autoUpdate,
    flip,
    FloatingArrow,
    offset,
    shift,
    useDismiss,
    useFloating,
    useFocus,
    useHover,
    useInteractions,
    useRole,
    useTransitionStyles,
} from '@floating-ui/react'
import React, { useRef, useState } from 'react'

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

    const hover = useHover(context, { move: false })
    const focus = useFocus(context)
    const dismiss = useDismiss(context)
    const role = useRole(context, { role: 'tooltip' })

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role])

    const { styles: transitionStyles } = useTransitionStyles(context, {
        initial: {
            opacity: 0,
            transform: 'scale(0.8)',
        },
    })

    return (
        <>
            {renderOpener({ ref: setReference, ...getReferenceProps() })}
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
