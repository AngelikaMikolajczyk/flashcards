interface ErrorMessageProps {
    message: string;
    className?: string;
    style?: React.CSSProperties;
}

export function ErrorMessage({ message, className, style }: ErrorMessageProps) {
    return (
        <div className={className} style={style}>
            {message}
        </div>
    );
}
