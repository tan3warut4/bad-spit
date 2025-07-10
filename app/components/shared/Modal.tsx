'use client'
import { ReactNode } from 'react'


type ModalProps = {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    )
}
export default Modal