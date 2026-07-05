/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        app: {
          bg:      '#F5F6F7',
          surface: '#FFFFFF',
          border:  '#E4E7EB',
          text:    '#1A2530',
          muted:   '#5B6B79',
          primary: '#0B5FA5',
          'primary-hover': '#0A4F8A',
          'primary-light': '#E8F1FB',
        },
        status: {
          success:     '#1E7B45',
          'success-bg':'#EAF6EE',
          warning:     '#B8720A',
          'warning-bg':'#FEF5E7',
          critical:    '#C4291C',
          'critical-bg':'#FDECEB',
          info:        '#0B5FA5',
          'info-bg':   '#E8F1FB',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'xs':   ['11px', { lineHeight: '16px' }],
        'sm':   ['12px', { lineHeight: '18px' }],
        'base': ['13px', { lineHeight: '20px' }],
        'md':   ['14px', { lineHeight: '21px' }],
        'lg':   ['16px', { lineHeight: '24px' }],
        'xl':   ['18px', { lineHeight: '26px' }],
        '2xl':  ['20px', { lineHeight: '28px' }],
        '3xl':  ['24px', { lineHeight: '32px' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '3px',
        md: '6px',
        lg: '8px',
        full: '9999px',
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08)',
        panel: '0 2px 8px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};
