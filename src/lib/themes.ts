export type Theme = 'light' | 'beige' | 'dark';

export interface ThemeColors {
  name: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  info: string;
  infoForeground: string;
}

export const themes: Record<Theme, ThemeColors> = {
  light: {
    name: 'Light',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 84% 4.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(222.2 84% 4.9%)',
    primary: 'hsl(222.2 47.4% 11.2%)',
    primaryForeground: 'hsl(210 40% 98%)',
    secondary: 'hsl(210 40% 96%)',
    secondaryForeground: 'hsl(222.2 47.4% 11.2%)',
    muted: 'hsl(210 40% 96%)',
    mutedForeground: 'hsl(215.4 16.3% 46.9%)',
    accent: 'hsl(210 40% 96%)',
    accentForeground: 'hsl(222.2 47.4% 11.2%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 84% 4.9%)',
    success: 'hsl(142.1 76.2% 36.3%)',
    successForeground: 'hsl(355.7 100% 97.3%)',
    warning: 'hsl(38 92% 50%)',
    warningForeground: 'hsl(48 96% 89%)',
    info: 'hsl(199 89% 48%)',
    infoForeground: 'hsl(210 40% 98%)',
  },
  beige: {
    name: 'Warm Beige',
    background: 'hsl(45 30% 98%)',
    foreground: 'hsl(20 15% 15%)',
    card: 'hsl(45 25% 96%)',
    cardForeground: 'hsl(20 15% 15%)',
    popover: 'hsl(45 25% 96%)',
    popoverForeground: 'hsl(20 15% 15%)',
    primary: 'hsl(25 50% 45%)',
    primaryForeground: 'hsl(45 30% 98%)',
    secondary: 'hsl(40 20% 92%)',
    secondaryForeground: 'hsl(20 15% 15%)',
    muted: 'hsl(40 20% 92%)',
    mutedForeground: 'hsl(25 15% 35%)',
    accent: 'hsl(35 30% 88%)',
    accentForeground: 'hsl(20 15% 15%)',
    destructive: 'hsl(0 70% 60%)',
    destructiveForeground: 'hsl(45 30% 98%)',
    border: 'hsl(40 15% 85%)',
    input: 'hsl(40 15% 85%)',
    ring: 'hsl(25 50% 45%)',
    success: 'hsl(120 40% 45%)',
    successForeground: 'hsl(45 30% 98%)',
    warning: 'hsl(35 80% 55%)',
    warningForeground: 'hsl(20 15% 15%)',
    info: 'hsl(200 60% 50%)',
    infoForeground: 'hsl(45 30% 98%)',
  },
  dark: {
    name: 'Dark Grey',
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(222.2 84% 4.9%)',
    cardForeground: 'hsl(210 40% 98%)',
    popover: 'hsl(222.2 84% 4.9%)',
    popoverForeground: 'hsl(210 40% 98%)',
    primary: 'hsl(210 40% 98%)',
    primaryForeground: 'hsl(222.2 47.4% 11.2%)',
    secondary: 'hsl(217.2 32.6% 17.5%)',
    secondaryForeground: 'hsl(210 40% 98%)',
    muted: 'hsl(217.2 32.6% 17.5%)',
    mutedForeground: 'hsl(215 20.2% 65.1%)',
    accent: 'hsl(217.2 32.6% 17.5%)',
    accentForeground: 'hsl(210 40% 98%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    destructiveForeground: 'hsl(210 40% 98%)',
    border: 'hsl(217.2 32.6% 17.5%)',
    input: 'hsl(217.2 32.6% 17.5%)',
    ring: 'hsl(212.7 26.8% 83.9%)',
    success: 'hsl(142.1 70.6% 45.3%)',
    successForeground: 'hsl(144.9 80.4% 10%)',
    warning: 'hsl(48 96% 89%)',
    warningForeground: 'hsl(48 96% 10%)',
    info: 'hsl(199 89% 48%)',
    infoForeground: 'hsl(210 40% 98%)',
  },
};

export function getThemeCSSVariables(theme: Theme): string {
  const colors = themes[theme];
  return Object.entries(colors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n');
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const colors = themes[theme];
  
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Store theme preference
  localStorage.setItem('theme', theme);
}

export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return (localStorage.getItem('theme') as Theme) || 'light';
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
} 