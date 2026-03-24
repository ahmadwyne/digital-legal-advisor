import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const AdminThemeContext = createContext(null);

const STORAGE_KEY = "adminTheme";

export const AdminThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || "light";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);

    document.body.classList.add("admin-theme");
    document.body.dataset.adminTheme = theme;

    if (theme === "dark") {
      document.body.classList.add("admin-dark");
    } else {
      document.body.classList.remove("admin-dark");
    }

    return () => {
      document.body.classList.remove("admin-theme");
      document.body.classList.remove("admin-dark");
      delete document.body.dataset.adminTheme;
    };
  }, [theme]);

  const setAdminTheme = useCallback((nextTheme) => {
    setTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: setAdminTheme,
      toggleTheme,
    }),
    [theme, setAdminTheme, toggleTheme],
  );

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export default AdminThemeContext;
