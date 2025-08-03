// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import { Theme, getStoredTheme, applyTheme } from '@/lib/themes';

// interface ThemeContextType {
//   theme: Theme;
//   setTheme: (theme: Theme) => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   const [theme, setThemeState] = useState<Theme>('light');
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//     const storedTheme = getStoredTheme();
//     setThemeState(storedTheme);
//     // Apply theme immediately
//     applyTheme(storedTheme);
//   }, []);

//   // Apply theme whenever it changes
//   useEffect(() => {
//     if (mounted) {
//       applyTheme(theme);
//     }
//   }, [theme, mounted]);

//   const setTheme = (newTheme: Theme) => {
//     setThemeState(newTheme);
//     applyTheme(newTheme);
//   };

//   // Always render children, but theme might not be applied until mounted
//   return (
//     <ThemeContext.Provider value={{ theme, setTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme() {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     // Return a default theme instead of throwing
//     return {
//       theme: 'light' as Theme,
//       setTheme: () => {},
//     };
//   }
//   return context;
// } 