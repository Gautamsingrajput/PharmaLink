/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#0f172a", // Slate 900
                secondary: "#334155", // Slate 700
                accent: "#38bdf8", // Sky 400
                background: "#020617", // Slate 950
                surface: "#1e293b", // Slate 800
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
