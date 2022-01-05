interface ErrorMessageProps {
    message: string;
    className?: string;
    style?: React.CSSProperties;
}

export function ErrorMessage({ message, className = '', style }: ErrorMessageProps) {
    return (
        <div className={`text-sm pl-4 pt-1 text-red-600 dark:text-red-400 ${className}`} style={style}>
            {message}
        </div>
    );
}
