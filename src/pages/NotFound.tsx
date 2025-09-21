import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, AlertCircle } from "lucide-react";
import ParticleCursor from "../components/ParticleCursor";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <ParticleCursor />
      <div className="glass-card p-12 text-center max-w-md mx-4">
        <AlertCircle className="w-20 h-20 text-primary mx-auto mb-6" />
        <h1 className="text-6xl font-heading font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground font-body mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="bg-gradient-accent text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
        >
          <Home className="w-5 h-5" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
