import { ReactNode } from 'react';

type ButtonType = 'button' | 'submit' | 'reset';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'disabled';

interface ButtonProps {
    type: ButtonType;
    variant: ButtonVariant;
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({ type, variant, children, onClick, disabled }: ButtonProps) {
    const VARIANT_TO_VARIANT_CLASS_NAME = {
        primary: 'text-xl z-10 rounded-xl bg-primary px-3.5 py-1.5 border-2 border-primary text-white font-bold',
        secondary:
            'text-xl z-10 rounded-xl bg-transparent px-3.5 py-1.5 border-2 border-primary text-normal text-opacity-60',
        tertiary: 'flex gap-4 items-center',
        disabled: 'text-xl z-10 rounded-xl bg-inactive px-3.5 py-1.5 border-2 border-inactive text-white font-bold',
    };

    return (
        <button type={type} className={VARIANT_TO_VARIANT_CLASS_NAME[variant]} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
}
