module.exports = {
    // mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sriracha: ['Sriracha', 'cursive'],
                nunito: ['Nunito', 'sans-serif'],
            },
            backgroundImage: {
                'home-background': "url('/src/assets/start.jpg')",
            },
            backgroundColor: {
                primary: '#FF928B',
                pattern: '#FFF9F5',
                secondary: '#ffeee6',
                selecting: '#f2f2f2',
                inactive: '#D0D0D0',
                success: '#b3d98c',
                failed: '#efefae',
                flashcard: '#ffdccc',
            },
            textColor: {
                primary: '#FF928B',
                secondary: '#FFAC81',
                normal: '#030303',
                inactive: '#D0D0D0',
            },
            borderColor: {
                primary: '#FF928B',
                secondary: '#FEC3A6',
                inactive: '#D0D0D0',
                'dark-grey': '#666666',
                success: '#49862d',
                failed: '#aa9d22',
            },
            borderWidth: {
                1: '1px',
                3: '3px',
            },
            zIndex: {
                '-1': '-1',
            },
            ringColor: {
                primary: '#FF928B',
            },
            transformOrigin: {
                0: '0%',
            },
            gridTemplateColumns: {
                category: 'minmax(0, 2fr) repeat(3, minmax(0, 1fr))',
                flashcard: 'minmax(0, 0.5fr) repeat(2, minmax(0, 2fr)) repeat(2, minmax(0, 1fr))',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
