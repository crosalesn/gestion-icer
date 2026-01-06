import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import type { AppDispatch, RootState } from '../../../app/store';
import { logoutUser } from '../../../features/auth/store/auth-slice';
import { Menu, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Generate breadcrumbs based on path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu size={24} />
        </button>
        
        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
            return (
              <span key={to} className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                {isLast ? (
                  <span className="font-medium text-gray-900 capitalize">
                    {value.replace(/-/g, ' ')}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-blue-600 transition-colors capitalize">
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
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200"
            >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                    <UserIcon size={18} />
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">
                        {user?.name || 'Usuario'}
                    </p>
                </div>
                <ChevronDown size={16} className="text-gray-400" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                        <p className="text-sm font-medium text-gray-900">
                             {user?.name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                        to="/perfil" 
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <UserIcon size={16} className="mr-2" />
                        Perfil
                    </Link>
                    <button
                        onClick={() => dispatch(logoutUser())}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                        <LogOut size={16} className="mr-2" />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    )
}

export default Header;

