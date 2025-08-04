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
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',
    card: '0 0% 100%',
    cardForeground: '222.2 84% 4.9%',
    popover: '0 0% 100%',
    popoverForeground: '222.2 84% 4.9%',
    primary: '222.2 47.4% 11.2%',
    primaryForeground: '210 40% 98%',
    secondary: '210 40% 96%',
    secondaryForeground: '222.2 47.4% 11.2%',
    muted: '210 40% 96%',
    mutedForeground: '215.4 16.3% 46.9%',
    accent: '210 40% 96%',
    accentForeground: '222.2 47.4% 11.2%',
    destructive: '0 84.2% 60.2%',
    destructiveForeground: '210 40% 98%',
    border: '214.3 31.8% 91.4%',
    input: '214.3 31.8% 91.4%',
    ring: '222.2 84% 4.9%',
    success: '142.1 76.2% 36.3%',
    successForeground: '355.7 100% 97.3%',
    warning: '38 92% 50%',
    warningForeground: '48 96% 89%',
    info: '199 89% 48%',
    infoForeground: '210 40% 98%',
  },
  beige: {
    name: 'Warm Beige',
    background: '45 30% 98%',
    foreground: '20 15% 15%',
    card: '45 25% 96%',
    cardForeground: '20 15% 15%',
    popover: '45 25% 96%',
    popoverForeground: '20 15% 15%',
    primary: '25 50% 45%',
    primaryForeground: '45 30% 98%',
    secondary: '40 20% 92%',
    secondaryForeground: '20 15% 15%',
    muted: '40 20% 92%',
    mutedForeground: '25 15% 35%',
    accent: '35 30% 88%',
    accentForeground: '20 15% 15%',
    destructive: '0 70% 60%',
    destructiveForeground: '45 30% 98%',
    border: '40 15% 85%',
    input: '40 15% 85%',
    ring: '25 50% 45%',
    success: '120 40% 45%',
    successForeground: '45 30% 98%',
    warning: '35 80% 55%',
    warningForeground: '20 15% 15%',
    info: '200 60% 50%',
    infoForeground: '45 30% 98%',
  },
  dark: {
    name: 'Dark Grey',
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    card: '222.2 84% 4.9%',
    cardForeground: '210 40% 98%',
    popover: '222.2 84% 4.9%',
    popoverForeground: '210 40% 98%',
    primary: '210 40% 98%',
    primaryForeground: '222.2 47.4% 11.2%',
    secondary: '217.2 32.6% 17.5%',
    secondaryForeground: '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    mutedForeground: '215 20.2% 65.1%',
    accent: '217.2 32.6% 17.5%',
    accentForeground: '210 40% 98%',
    destructive: '0 62.8% 30.6%',
    destructiveForeground: '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    input: '217.2 32.6% 17.5%',
    ring: '212.7 26.8% 83.9%',
    success: '142.1 70.6% 45.3%',
    successForeground: '144.9 80.4% 10%',
    warning: '48 96% 89%',
    warningForeground: '48 96% 10%',
    info: '199 89% 48%',
    infoForeground: '210 40% 98%',
  },
};

export function getThemeCSSVariables(theme: Theme): string {
  const colors = themes[theme];
  return Object.entries(colors)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n');
}

export function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const colors = themes[theme];

  // Apply all color variables with hsl() wrapper
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, `hsl(${value})`);
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
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}
