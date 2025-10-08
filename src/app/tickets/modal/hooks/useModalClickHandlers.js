"use client"

import { useEffect } from "react"

export function useModalClickHandlers(isOpen, onClose, modalRef, modalContentRef) {
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // Check if the click is on a dropdown or its children
                const isDropdownClick = event.target.closest('[role="listbox"]') !== null
                if (!isDropdownClick) {
                    onClose()
                }
            }
        }

        const handleInsideClick = (event) => {
            event.stopPropagation()
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick)
            modalContentRef.current?.addEventListener("mousedown", handleInsideClick)
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
            modalContentRef.current?.removeEventListener("mousedown", handleInsideClick)
        }
    }, [isOpen, onClose, modalRef, modalContentRef])
}
