import { useEffect, useState } from 'react';

type Mode = 'dark' | 'light';

export default function useDarkMode() {
    const [mode, setMode] = useState<Mode>('dark');

    const colorMode: Mode = mode === 'dark' ? 'light' : 'dark';

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(colorMode);
        root.classList.add(mode);
    }, [colorMode, mode]);

    return [colorMode, setMode] as const;
}
