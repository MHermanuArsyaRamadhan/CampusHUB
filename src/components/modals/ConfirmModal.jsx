import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Konfirmasi', confirmClass = 'btn-danger', children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
        <div className="flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-full">
            <AlertTriangle className="text-red-600" size={22} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
            {children}
          </div>
        </div>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-secondary text-sm">Batal</button>
          <button onClick={onConfirm} className={`${confirmClass} text-sm`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

