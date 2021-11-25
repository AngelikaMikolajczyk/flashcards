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

const buttonClassNameBase = 'text-xl z-10 rounded-xl px-3.5 py-1.5 border-2';

export function Button({ type, variant, children, onClick, disabled }: ButtonProps) {
    const VARIANT_TO_VARIANT_CLASS_NAME = {
        primary: 'bg-primary border-primary text-white font-bold',
        secondary: 'bg-transparent border-primary text-normal text-opacity-60',
        tertiary: 'flex gap-4 items-center',
        disabled: 'bg-inactive border-inactive text-white font-bold',
        success: 'bg-success border-success text white font bold',
        failed: 'bg-failed border-failed text white font bold',
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
