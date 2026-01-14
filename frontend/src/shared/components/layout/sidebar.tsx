import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import witiLogo from '../../../assets/logos/witi-logo.svg';
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
  Building2,
  X
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
        "fixed inset-y-0 left-0 z-50 w-72 text-gray-200 lg:relative lg:translate-x-0 shadow-2xl border-r border-white/10 flex flex-col",
        "bg-[linear-gradient(180deg,#020b1d_0%,#031633_65%,#0d2b5e_100%)]",
        "transition-transform duration-300 ease-in-out",
        !isOpen && "-translate-x-full"
      )}
    >
      {/* Header / Logo */}
      <div className="relative px-6 py-5 bg-white/5 backdrop-blur-xl border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-brand-primary/10 pointer-events-none" />
        
        <div className="flex flex-col items-center justify-center text-center relative">
          <img
            src={witiLogo}
            alt="WiTI"
            className="w-[130px] h-[80px] object-contain drop-shadow-lg"
          />
          <div className="text-xs uppercase tracking-[0.15em] text-gray-300/80">Panel</div>
          <span className="text-lg font-bold text-white tracking-tight leading-tight">
            Administración ICER
          </span>
        </div>
        
        <button 
          onClick={toggle} 
          className="absolute right-4 top-4 lg:hidden p-2 text-gray-300 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
        <div className="px-4 mb-4 mt-2 text-[11px] font-bold text-gray-400/80 uppercase tracking-[0.12em]">
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
          "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl group",
          isActive 
            ? "text-white bg-white/10 shadow-inner shadow-brand-primary/20 ring-1 ring-white/10" 
            : "text-gray-300 hover:bg-white/5 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <span className={clsx(
              isActive ? "text-brand-accent" : "text-gray-400 group-hover:text-brand-accent"
          )}>
              {group.icon}
          </span>
          <span>{group.name}</span>
        </div>
        {expanded ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>

      {expanded && (
        <div className="mt-1 space-y-1">
          {group.items.map((subItem) => (
            <NavLink
              key={subItem.to}
              to={subItem.to}
              className={({ isActive }) =>
                clsx(
                  "relative flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg pl-12",
                  isActive
                    ? "text-white bg-brand-accent/15 font-semibold border border-white/10 shadow-inner"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )
              }
            >
              {({ isActive }) => (
                  <>
                    {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-brand-accent shadow-[0_0_12px_rgba(238,114,28,0.5)]" />
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
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl mb-1 group border border-transparent",
                    isActive
                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/25 border-white/10"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                )
            }
        >
            {item.icon}
            <span>{item.name}</span>
        </NavLink>
    )
}

export default Sidebar;
