import { useEffect, useState } from 'react';

type Mode = 'dark' | 'light';

export default function useDarkMode() {
    const [mode, setMode] = useState<Mode>(
        (localStorage.getItem('theme') as Mode | null) ??
            (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );

    function saveUserPreferences(preference: Mode) {
        localStorage.setItem('theme', preference);
    }

    function setColorMode(colorMode: Mode) {
        setMode(colorMode);
        saveUserPreferences(colorMode);
    }

    const colorMode: Mode = mode === 'dark' ? 'light' : 'dark';

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(colorMode);
        root.classList.add(mode);
    }, [colorMode, mode]);

    return [colorMode, setColorMode] as const;
}
