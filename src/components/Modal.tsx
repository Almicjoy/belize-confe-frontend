"use client";
import React, { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import { AiOutlineClose } from "react-icons/ai"; // Using React Icons

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const modalRoot = document.getElementById("modal-root");

  // Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 "
      onClick={onClose} // click outside to close
    >
      <div
        className="rounded-lg shadow-lg max-w-lg relative py-8 px-6 my-20"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 my-20"
        >
          <AiOutlineClose size={24} /> {/* larger and more visible */}
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
