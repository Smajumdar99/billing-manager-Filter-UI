/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		fontFamily: {
  			sans: ['Euclid Circular B', 'sans-serif'],
  			euclid: ['Euclid Circular B', 'sans-serif'],
  		},
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			blob: {
  				"0%": {
  					transform: "translate(0px, 0px) scale(1)",
  				},
  				"33%": {
  					transform: "translate(30px, -50px) scale(1.1)",
  				},
  				"66%": {
  					transform: "translate(-20px, 20px) scale(0.9)",
  				},
  				"100%": {
  					transform: "translate(0px, 0px) scale(1)",
  				},
  			},
  			"width-expand": {
  				"0%": { width: "72px" },
  				"100%": { width: "280px" }
  			},
  			"width-collapse": {
  				"0%": { width: "280px" },
  				"100%": { width: "72px" }
  			},
  			"fade-in": {
  				"0%": { opacity: 0, transform: "translateX(-10px)" },
  				"100%": { opacity: 1, transform: "translateX(0)" }
  			},
  			"fade-out": {
  				"0%": { opacity: 1, transform: "translateX(0)" },
  				"100%": { opacity: 0, transform: "translateX(-10px)" }
  			},
  			shimmer: {
  				'0%, 100%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' },
  			},
  			"spin-around": {
  				"0%": { transform: "translateZ(0) rotate(0)" },
  				"15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
  				"65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
  				"100%": { transform: "translateZ(0) rotate(360deg)" },
  			},
  			"shimmer-slide": {
  				to: { transform: "translate(calc(100cqw - 100%), 0)" },
  			},
  		},
  		animation: {
  			float: 'float 3s ease-in-out infinite',
  			'float-delayed': 'float 6s ease-in-out 2s infinite',
  			'float-slow': 'float 8s ease-in-out 1s infinite',
  			blob: "blob 7s infinite",
  			bounce: 'bounce 1s ease-in-out infinite',
  			"width-expand": "width-expand 0.3s ease-out forwards",
  			"width-collapse": "width-collapse 0.3s ease-out forwards",
  			"fade-in": "fade-in 0.3s ease-out forwards",
  			"fade-out": "fade-out 0.2s ease-in forwards",
  			shimmer: 'shimmer 2s linear infinite',
  			"shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
  			"spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
  		},
  		backgroundImage: {
  			'grid-primary': 'linear-gradient(to right, rgb(var(--primary) / 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--primary) / 0.1) 1px, transparent 1px)',
  		},
  		backgroundSize: {
  			'grid-primary': '4rem 4rem',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
}