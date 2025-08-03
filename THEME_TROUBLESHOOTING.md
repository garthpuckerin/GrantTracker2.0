# Theme System Troubleshooting Guide

## 🎨 Theme System Overview

The GrantTracker2.0 theme system uses:
- **CSS Custom Properties** for dynamic theming
- **React Context** for state management
- **Local Storage** for persistence
- **Hydration-safe** implementation

## 🐛 Common Issues & Solutions

### Issue: "useTheme must be used within a ThemeProvider"

**Symptoms:**
- Error in browser console
- Theme picker not working
- 500 errors on dashboard

**Solutions:**

1. **Clear Browser Cache**
   ```bash
   # Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
   # Or clear localStorage manually in DevTools
   ```

2. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. **Check Theme Provider Setup**
   - Ensure `ClientThemeProvider` is in `src/app/layout.tsx`
   - Verify all theme files are properly imported

4. **Clear Node Modules (if needed)**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

### Issue: Theme Not Persisting

**Symptoms:**
- Theme resets on page refresh
- Theme picker shows wrong current theme

**Solutions:**

1. **Check Local Storage**
   ```javascript
   // In browser console
   localStorage.getItem('theme')
   ```

2. **Clear and Reset**
   ```javascript
   // In browser console
   localStorage.clear()
   // Then refresh page
   ```

### Issue: Theme Colors Not Applying

**Symptoms:**
- Theme picker works but colors don't change
- Some components not themed

**Solutions:**

1. **Check CSS Variables**
   ```javascript
   // In browser console
   getComputedStyle(document.documentElement).getPropertyValue('--background')
   ```

2. **Verify Tailwind Config**
   - Ensure new color variables are in `tailwind.config.js`
   - Check that CSS variables are properly defined

3. **Component-Specific Issues**
   - Some components might need manual theme class updates
   - Check for hardcoded colors in components

## 🔧 Development Tips

### Adding New Themes

1. **Define Theme Colors**
   ```typescript
   // In src/lib/themes.ts
   export const themes: Record<Theme, ThemeColors> = {
     // ... existing themes
     newTheme: {
       name: 'New Theme',
       background: 'hsl(0 0% 100%)',
       // ... other colors
     },
   };
   ```

2. **Add Theme Icon**
   ```typescript
   // In src/components/ui/theme-picker.tsx
   const themeIcons = {
     // ... existing icons
     newTheme: NewIcon,
   };
   ```

3. **Test Accessibility**
   - Ensure contrast ratios meet WCAG guidelines
   - Test with screen readers if possible

### Debugging Theme Issues

1. **Browser DevTools**
   ```javascript
   // Check current theme
   localStorage.getItem('theme')
   
   // Check CSS variables
   getComputedStyle(document.documentElement)
   ```

2. **React DevTools**
   - Check ThemeProvider context
   - Verify theme state

3. **Console Logging**
   ```typescript
   // Add to theme-picker.tsx for debugging
   console.log('Current theme:', theme);
   console.log('Available themes:', Object.keys(themes));
   ```

## 🎯 Best Practices

### Theme Implementation
- ✅ Use CSS custom properties for all colors
- ✅ Test all themes with all components
- ✅ Ensure proper contrast ratios
- ✅ Handle hydration properly

### Performance
- ✅ Minimize theme switching overhead
- ✅ Use efficient CSS variable updates
- ✅ Avoid unnecessary re-renders

### Accessibility
- ✅ Maintain WCAG AA contrast ratios
- ✅ Test with keyboard navigation
- ✅ Ensure screen reader compatibility

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the console** for specific error messages
2. **Verify file structure** matches the documentation
3. **Test in incognito mode** to rule out cache issues
4. **Create a minimal reproduction** if possible

The theme system is designed to be robust and user-friendly. Most issues can be resolved with a simple restart or cache clear. 