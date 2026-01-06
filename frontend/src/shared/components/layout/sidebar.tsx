import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { 
  Settings, 
  Users, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Home,
  BarChart2,
  ClipboardCheck,
  Target,
  FileEdit,
  Building2
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon?: React.ReactNode;
}

interface NavGroup {
  name: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const navigation: (NavGroup | NavItem)[] = [
  {
    name: 'Inicio',
    to: '/',
    icon: <Home size={20} />,
  },
  {
    name: 'Administración',
    icon: <Settings size={20} />,
    items: [
      { name: 'Usuarios', to: '/usuarios', icon: <Users size={18} /> },
      { name: 'Clientes', to: '/clientes', icon: <Building2 size={18} /> },
      { name: 'Dimensiones', to: '/evaluaciones/dimensiones', icon: <FileText size={18} /> },
      { name: 'Plantillas Evaluaciones', to: '/evaluaciones/plantillas', icon: <FileEdit size={18} /> },
      { name: 'Plantillas Seguimiento', to: '/planes-seguimiento/configuracion', icon: <FileText size={18} /> },
    ]
  },
  {
    name: 'Evaluaciones',
    icon: <ClipboardCheck size={20} />,
    items: [
      { name: 'Colaboradores', to: '/colaboradores', icon: <Users size={18} /> },
      { name: 'Pendientes', to: '/evaluaciones', icon: <FileText size={18} /> },
    ]
  },
  {
    name: 'Planes de Acción',
    icon: <Target size={20} />,
    items: [
      { name: 'Activos', to: '/planes', icon: <Target size={18} /> },
    ]
  },
  {
    name: 'Reportes',
    to: '/reportes',
    icon: <BarChart2 size={20} />,
  }
];

const Sidebar = ({ isOpen, toggle }: SidebarProps) => {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark text-gray-300 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-xl border-r border-white/5",
        !isOpen && "-translate-x-full"
      )}
    >
      {/* Header / Logo */}
      <div className="h-20 flex items-center px-6 bg-brand-darker/50 backdrop-blur-sm border-b border-white/5">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center text-white font-bold shadow-lg shadow-brand-accent/20">
                IC
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
                Administración ICER
            </span>
        </div>
        <button 
            onClick={toggle} 
            className="absolute right-4 lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
            ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-5rem)] custom-scrollbar">
        <div className="px-4 mb-4 mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Menu Principal
        </div>
        
        {navigation.map((item, index) => {
            if ('items' in item) {
                return <NavGroupItem key={index} group={item} />;
            }
            return <NavItemLink key={index} item={item} />;
        })}
      </nav>
    </aside>
  );
};

const NavGroupItem = ({ group }: { group: NavGroup }) => {
  const location = useLocation();
  const [expanded, setExpanded] = useState(() => {
     return group.items.some(item => location.pathname.startsWith(item.to));
  });

  const isActive = group.items.some(item => location.pathname.startsWith(item.to));

  return (
    <div className="mb-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className={clsx(
          "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
          isActive 
            ? "text-white bg-white/5 shadow-inner" 
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <span className={clsx(
              "transition-colors duration-200",
              isActive ? "text-brand-accent" : "text-gray-500 group-hover:text-brand-accent"
          )}>
              {group.icon}
          </span>
          <span>{group.name}</span>
        </div>
        {expanded ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />}
      </button>

      {expanded && (
        <div className="mt-1 space-y-1">
          {group.items.map((subItem) => (
            <NavLink
              key={subItem.to}
              to={subItem.to}
              className={({ isActive }) =>
                clsx(
                  "relative flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-200 pl-12",
                  isActive
                    ? "text-white bg-brand-accent/10 font-medium"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                  <>
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand-accent" />
                    )}
                    {subItem.name}
                  </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const NavItemLink = ({ item }: { item: NavItem }) => {
    return (
        <NavLink
            to={item.to}
            className={({ isActive }) =>
                clsx(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 mb-1 group",
                    isActive
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                )
            }
        >
            {item.icon}
            <span>{item.name}</span>
        </NavLink>
    )
}

export default Sidebar;
