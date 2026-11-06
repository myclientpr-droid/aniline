import { Manrope } from 'next/font/google';

export const manrope = Manrope({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-sans',
    weight: ['300', '400', '500', '600', '700', '800'],
    fallback: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
});