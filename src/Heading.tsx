import React from 'react';

interface HeadingProps {
    variant: 'primary' | 'normal';
    children?: React.ReactNode;
}

export function Heading({ variant, children, ...props }: HeadingProps) {
    const variantToTag = {
        primary: 'h1',
        normal: 'h2',
    };

    const variantToClassName = {
        primary: 'text-primary dark:text-dark-primary text-4xl font-bold',
        normal: 'text-secondary dark:text-dark-secondary text-2xl font-bold',
    };

    return React.createElement(variantToTag[variant], { ...props, className: variantToClassName[variant] }, children);
}
