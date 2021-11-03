import { ReactNode } from 'react';

type ButtonType = 'button' | 'submit' | 'reset';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

interface ButtonProps {
    type: ButtonType;
    variant: ButtonVariant;
    children: ReactNode;
    onClick?: () => void;
}

export function Button({ type, variant, children, onClick }: ButtonProps) {
    const VARIANT_TO_VARIANT_CLASS_NAME = {
        primary: 'text-xl z-10 rounded-xl bg-primary px-3.5 py-1.5 border-2 border-primary text-white font-bold',
        secondary:
            'text-xl z-10 rounded-xl bg-transparent px-3.5 py-1.5 border-2 border-primary text-normal text-opacity-60',
        tertiary: 'flex gap-4 items-center',
    };

    return (
        <button type={type} className={VARIANT_TO_VARIANT_CLASS_NAME[variant]} onClick={onClick}>
            {children}
        </button>
    );
}
