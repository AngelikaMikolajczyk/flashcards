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
            },
            textColor: {
                primary: '#FF928B',
                secondary: '#FEC3A6',
                normal: '#030303',
            },
            borderColor: {
                primary: '#FF928B',
                secondary: '#FEC3A6',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
