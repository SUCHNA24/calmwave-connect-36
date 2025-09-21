import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-4 w-4 text-primary" />;
    } else if (theme === "light") {
      return <Sun className="h-4 w-4 text-secondary" />;
    }
    return <Monitor className="h-4 w-4 text-muted-foreground" />;
  };

  const getLabel = () => {
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    return "System";
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="w-10 h-10 p-0 hover:bg-accent/50 hover:text-accent-foreground transition-all duration-300 rounded-xl backdrop-blur-sm border border-glass-border/30 hover:border-glass-border/60"
      title={`Current theme: ${getLabel()}. Click to toggle.`}
    >
      <div className="transition-transform duration-300 hover:scale-110">
        {getIcon()}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}