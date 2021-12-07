module.exports = {
    // mode: 'jit',
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: 'class', // or 'media' or false
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
                'dark-primary': '#b1b9cd',
                'dark-inactive': '#666666',
                'dark-success': '#4d6732',
                'dark-failed': '#9a9a32',
                'dark-secondary': '#92b9a6',
                'dark-flashcard': '#73a58d',
            },
            textColor: {
                primary: '#FF928B',
                secondary: '#FFAC81',
                normal: '#030303',
                inactive: '#D0D0D0',
                'dark-primary': '#b1b9cd',
                'dark-normal': '#f2f2f2',
                'dark-inactive': '#b3b3b3',
                'dark-success': '#b6d6a9',
                'dark-failed': '#f3f3d8',
                'dark-secondary': '#92b9a6',
                'error-message': '#cc6666',
            },
            borderColor: {
                primary: '#FF928B',
                secondary: '#FEC3A6',
                inactive: '#D0D0D0',
                'dark-grey': '#666666',
                success: '#49862d',
                failed: '#aa9d22',
                'dark-primary': '#b1b9cd',
                'dark-inactive': '#666666',
                'dark-success': '#375629',
                'dark-failed': '#747425',
                'dark-secondary': '#92b9a6',
                'light-grey': '#cccccc',
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
                'dark-primary': '#b1b9cd',
            },
            transformOrigin: {
                0: '0%',
            },
            gridTemplateColumns: {
                category: 'minmax(0, 2fr) repeat(4, minmax(0, 1fr))',
                flashcard: 'minmax(0, 0.5fr) repeat(2, minmax(0, 2fr)) repeat(2, minmax(0, 1fr))',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
