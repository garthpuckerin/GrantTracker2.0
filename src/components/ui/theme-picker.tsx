// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from '@/components/ui/dropdown-menu';
// import { Palette, Sun, Moon, Coffee } from 'lucide-react';
// import { Theme, themes } from '@/lib/themes';
// import { useTheme } from '@/components/providers/theme-provider';

// const themeIcons = {
//   light: Sun,
//   beige: Coffee,
//   dark: Moon,
// };

// export function ThemePicker() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const handleThemeChange = (newTheme: Theme) => {
//     setTheme(newTheme);
//   };

//   // Show loading state until mounted
//   if (!mounted) {
//     return (
//       <Button variant="outline" size="sm" disabled>
//         <Palette className="h-4 w-4" />
//       </Button>
//     );
//   }

//   const CurrentIcon = themeIcons[theme] || Sun; // Fallback to Sun icon

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="sm" className="gap-2">
//           <CurrentIcon className="h-4 w-4" />
//           <span className="hidden sm:inline">{themes[theme]?.name || 'Light'}</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="w-48">
//         {Object.entries(themes).map(([key, themeConfig]) => {
//           const Icon = themeIcons[key as Theme];
//           return (
//             <DropdownMenuItem
//               key={key}
//               onClick={() => handleThemeChange(key as Theme)}
//               className="flex items-center gap-2 cursor-pointer"
//             >
//               <Icon className="h-4 w-4" />
//               <span>{themeConfig.name}</span>
//               {theme === key && (
//                 <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
//               )}
//             </DropdownMenuItem>
//           );
//         })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// } 