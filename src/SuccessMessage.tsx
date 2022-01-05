import { AiOutlineCheck } from 'react-icons/ai';

interface SuccessMessageProps {
    message: string;
    className?: string;
}

export function SuccessMessage({ message, className = '' }: SuccessMessageProps) {
    return (
        <div className={`flex gap-1 items-center text-sm py-2 px-3 rounded-lg text-teal-700 bg-teal-100  ${className}`}>
            <AiOutlineCheck />
            {message}
        </div>
    );
}
