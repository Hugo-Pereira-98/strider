import { Toast } from '@/components/Toast';
import { ReactNode, createContext, useState } from 'react';

type ToastContextType = {
	toast: (toast: Toast) => void;
	closeToast: (id: string) => void;
};

export const ToastContext = createContext({} as ToastContextType);

type ToastProviderProps = {
	children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
	const [currentToast, setCurrentToast] = useState<Toast | null>(null);

	const toast = (toast: Toast) => {
		setCurrentToast(toast);
	};

	const closeToast = () => {
		setCurrentToast(null);
	};

	return (
		<ToastContext.Provider value={{ toast, closeToast }}>
			{currentToast && <Toast {...currentToast} onClose={closeToast} />}
			{children}
		</ToastContext.Provider>
	);
}
