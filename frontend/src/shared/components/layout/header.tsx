import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../app/store';
import { logoutUser } from '../../../features/auth/store/auth-slice';
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Generate breadcrumbs based on path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  return (
    <header className="h-16 sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-slate-600 hover:bg-white/70 hover:text-brand-primary rounded-lg lg:hidden border border-transparent hover:border-slate-200"
        >
          <Menu size={24} />
        </button>
        
        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center text-sm text-slate-500">
          <Link to="/" className="hover:text-brand-primary font-semibold">
            Inicio
          </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
            return (
              <span key={to} className="flex items-center">
                <span className="mx-2 text-slate-300">/</span>
                {isLast ? (
                  <span className="font-semibold text-slate-900 capitalize px-2 py-1 bg-brand-primary/5 rounded-lg">
                    {value.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-brand-primary capitalize">
                    {value.replace(/-/g, ' ')}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <UserDropdown user={user} />
      </div>
    </header>
  );
};

const UserDropdown = ({ user }: { user: any }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                  "flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full backdrop-blur border shadow-sm hover:shadow-md",
                  isOpen 
                    ? "bg-white border-brand-primary/30" 
                    : "bg-white/60 border-white/70"
                )}
            >
                {/* Avatar with gradient border */}
                <div className="relative p-0.5 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent">
                  <div className="w-8 h-8 rounded-full bg-white text-brand-primary flex items-center justify-center">
                      <UserIcon size={16} />
                  </div>
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                        {user?.name || 'Usuario'}
                    </p>
                </div>
                <ChevronDown size={16} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-xl shadow-[var(--shadow-card)] border border-white/80 py-2">
                    <div className="px-4 py-3 border-b border-slate-100 md:hidden">
                        <p className="text-sm font-semibold text-slate-900">
                             {user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                        to="/perfil" 
                        className="flex items-center w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-brand-primary/5"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserIcon size={16} className="mr-3 text-brand-primary" />
                        Perfil
                    </Link>
                    <button
                        onClick={() => dispatch(logoutUser())}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogOut size={16} className="mr-3" />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header;
