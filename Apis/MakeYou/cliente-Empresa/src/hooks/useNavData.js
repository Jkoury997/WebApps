// hooks/useNavData.js
import { useState, useEffect } from 'react';

// Definición de los datos de navegación
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: "SquareTerminal",
      isActive: true,
      items: [
        { title: "History", url: "#" },
        { title: "Starred", url: "#" },
        { title: "Settings", url: "#" },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: "Bot",
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: "BookOpen",
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: "Settings2",
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "#", icon: "LifeBuoy" },
    { title: "Feedback", url: "#", icon: "Send" },
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: "Frame" },
    { name: "Sales & Marketing", url: "#", icon: "PieChart" },
    { name: "Travel", url: "#", icon: "Map" },
  ],
};

// Hook que proporciona los datos de navegación
export function useNavData() {
  const [navData, setNavData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de obtención de datos, podrías reemplazar con fetch en caso de API
    setTimeout(() => {
      setNavData(data);
      setLoading(false);
    }, 500); // Simulamos un delay para emular la carga de datos
  }, []);

  return { navData, loading };
}
