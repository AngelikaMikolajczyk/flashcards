import { ReactNode } from 'react';

interface IconButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function IconButton({ children, onClick, className }: IconButtonProps) {
    return (
        <button onClick={onClick} type="button" className={className}>
            {children}
        </button>
    );
}
