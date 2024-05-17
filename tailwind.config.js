/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'heading-huge': '72px',
        'heading-extra-large': '60px',
        'heading-large': '48px',
        'heading-medium': '36px',
        'heading-small': '30px',
        'heading-extra-small': '24px',
        'title-large': '120px',
        'title-small': '96px',
        'body-extra-large': '20px',
        'body-large': '18px',
        'body-medium': '16px',
        'body-small': '14px',
        'body-extra-small': '12px',
        'body-tiny': '10px',
        'label-extra-large': '20px',
        'label-large': '18px',
        'label-medium': '16px',
        'label-small': '14px',
        'label-extra-small': '12px',
      },
      lineHeight: {
        'heading-huge': '90px',
        'heading-extra-large': '72px',
        'heading-large': '60px',
        'heading-medium': '44px',
        'heading-small': '38px',
        'heading-extra-small': '32px',
        'title-large': '150px',
        'title-small': '120px',
        'body-extra-large': '30px',
        'body-large': '28px',
        'body-medium': '24px',
        'body-small': '20px',
        'body-extra-small': '18px',
        'body-tiny': '16px',
        'label-extra-large': '24px',
        'label-large': '22px',
        'label-medium': '20px',
        'label-small': '18px',
        'label-extra-small': '16px',
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
      },
      fontStyle: {
        normal: 'normal',
      },
      letterSpacing: {
        tightest: '-0.01em',
        tighter: '-0.02em',
      },
      colors: {
        primary: {
          25: '#fcfaff',
          50: '#f9f5ff',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#b692f6',
          500: '#9e77ed',
          600: '#7F56D9',
          700: '#6941C6',
          800: '#53389E',
          900: '#42307d',
          950: '#2c1c5f',
        },
        'gray-light': {
          25: '#fcfcfd',
          50: '#F9FAFB',
          100: '#f2f4f7',
          200: '#eaecf0',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#182230',
          900: '#101828',
          950: '#0c111d',
        },
        'gray-dark': {
          25: '#fafafa',
          50: '#f5f5f6',
          100: '#f0f1f1',
          200: '#ececed',
          300: '#cecfd2',
          400: '#94969c',
          500: '#85888e',
          600: '#61646c',
          700: '#333741',
          800: '#1f242f',
          900: '#161b26',
          950: '#0c111d',
        },
        success: {
          25: '#F6FEF9',
          50: '#ECFDF3',
          100: '#DCFAE6',
          200: '#ABEFC6',
          300: '#75E0A7',
          400: '#47CD89',
          500: '#17B26A',
          600: '#079455',
          700: '#067647',
          800: '#085D3A',
          900: '#074D31',
          950: '#053321',
        },
        warning: {
          50: '#FFFCF5',
          100: '#FEFAF5',
          200: '#FBF2CB',
          300: '#FDE57E',
          400: '#FFD16A',
          500: '#FBBC55',
          600: '#E9A23B',
          700: '#C8811A',
          800: '#A35C00',
          900: '#8B4400',
          950: '#4E1D09',
          1000: '#78310B',
        },
        error: {
          25: '#fffbfa',
          50: '#fef3f2',
          100: '#fee4e2',
          200: '#fecdca',
          300: '#fda29b',
          400: '#f97066',
          500: '#f04438',
          600: '#d92d20',
          700: '#b42318',
          800: '#912018',
          900: '#7a271a',
          950: '#55160c',
        },
      },
      boxShadow: {
        'extra-small': '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        small:
          '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
        medium:
          '0px 2px 5px rgba(103, 110, 118, 0.08), 0px 0px 0px 1px rgba(103, 110, 118, 0.16), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        large:
          '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
        'extra-large':
          '0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)',
        'hover-primary':
          '0px 2px 5px rgba(16, 24, 40, 0.05), 0px 0px 0px 1px rgba(16, 24, 40, 0.05), 0px 1px 1px rgba(16, 24, 40, 0.05)',
        'hover-secondary':
          '0px 2px 5px rgba(103, 110, 118, 0.08), 0px 0px 0px 1px rgba(103, 110, 118, 0.24), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        'hover-error':
          '0px 2px 5px rgba(243, 65, 65, 0.08), 0px 0px 0px 2px rgba(243, 65, 65, 0.4), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        'hover-warning':
          '0px 2px 5px rgba(233, 162, 59, 0.08), 0px 0px 0px 2px rgba(233, 162, 59, 0.4), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        'hover-success':
          '0px 2px 5px rgba(83, 180, 131, 0.08), 0px 0px 0px 2px rgba(83, 180, 131, 0.4), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        'focus-primary':
          '0px 0px 0px 4px rgba(158, 119, 237, 0.24), 0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'focus-secondary':
          '0px 0px 0px 4px rgba(152, 162, 179, 0.14), 0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'focus-error':
          '0px 0px 0px 4px rgba(240, 68, 56, 0.24), 0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
        'focus-warning':
          '0px 0px 0px 4px rgba(233, 162, 59, 0.16), 0px 2px 5px rgba(103, 110, 118, 0.08), 0px 0px 0px 1px rgba(233, 162, 59, 0.16), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        'focus-success':
          '0px 0px 0px 4px rgba(83, 180, 131, 0.16), 0px 2px 5px rgba(103, 110, 118, 0.08), 0px 0px 0px 1px rgba(83, 180, 131, 0.16), 0px 1px 1px rgba(0, 0, 0, 0.12)',
        'toast-success':
          '0px 1px 1px 0px rgba(0, 0, 0, 0.12), 0px 0px 0px 1px rgba(83, 180, 131, 0.16), 0px 2px 5px 0px rgba(103, 110, 118, 0.08), 0px 0px 0px 4px rgba(83, 180, 131, 0.16)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        fadeOut: {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      borderRadius: {
        none: '0px',
        xxs: '2px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in',
        fadeOut: 'fadeOut 0.2s ease-in-out',
        slideIn: 'slideIn 0.5s forwards',
        slideOut: 'slideOut 0.5s forwards',
      },
      screens: {
        '2xs': '320px',
        xs: '375px',
        sm: '475px',
        '2xl': '1280px',
        '3xl': '1630px',
        '4xl': '1875px',
        '5xl': '2000px',
      },
    },
    variants: {
      extend: {
        boxShadow: ['responsive', 'hover', 'focus', 'active'],
      },
    },
  },
  plugins: [
    function ({ addUtilities, e, theme }) {
      const newUtilities = {};

      Object.entries(theme('fontSize')).forEach(([name, size]) => {
        Object.entries(theme('fontWeight')).forEach(([weightName, weight]) => {
          newUtilities[`.${e(`${name}-${weightName}`)}`] = {
            fontSize: size,
            fontWeight: weight,
            lineHeight: theme('lineHeight')[name],
            fontFamily: theme('fontFamily.sans'),
            fontStyle: theme('fontStyle.normal'),
            letterSpacing: theme('letterSpacing.tightest'),
          };
        });
      });

      addUtilities(newUtilities);
    },
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
