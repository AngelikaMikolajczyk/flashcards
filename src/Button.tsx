import { ReactNode } from 'react';

type ButtonType = 'button' | 'submit' | 'reset';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'success' | 'failed';

interface ButtonProps {
    type: ButtonType;
    variant: ButtonVariant;
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

const buttonClassNameBase = 'text-xl z-10 rounded-xl px-3.5 py-1.5';

export function Button({ type, variant, children, onClick, disabled }: ButtonProps) {
    const VARIANT_TO_VARIANT_CLASS_NAME = {
        primary:
            'bg-primary dark:bg-dark-primary border-primary dark:border-dark-primary text-white font-bold border-2',
        secondary:
            'bg-transparent border-primary dark:border-dark-primary text-normal dark:text-dark-normal text-opacity-60 dark:text-opacity-80 border-2',
        tertiary: 'flex gap-4 items-center',
        disabled:
            'bg-inactive dark:bg-dark-inactive border-inactive dark:border-dark-inactive text-white dark:text-dark-inactive font-bold border-2',
        success:
            'bg-success dark:bg-dark-success border-success dark:border-dark-success text-white dark:text-dark-success dark:text-opacity-80 font-medium border-2',
        failed: 'bg-failed dark:bg-dark-failed border-failed dark:border-dark-failed text-white dark:text-dark-failed font-medium border-2',
    };

    return (
        <button
            type={type}
            className={`${buttonClassNameBase} ${VARIANT_TO_VARIANT_CLASS_NAME[variant]}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
