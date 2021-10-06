import { ReactNode } from 'react';

interface IconButtonProps {
    children: ReactNode;
    onClick?: () => void;
}

export function IconButton({ children, onClick }: IconButtonProps) {
    return (
        <button onClick={onClick} type="button">
            {children}
        </button>
    );
}
