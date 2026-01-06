import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { loginUser } from '../../features/auth/store/auth-slice';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import loginBackground from '../../assets/witi-background.svg';


const formatBuildDate = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: `url(${loginBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
      />
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-10 backdrop-blur-[2px]" />

      <div className="max-w-md w-full space-y-8 p-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl z-20 border border-white/20">
        <div className="text-center">
          <h2 className="mt-6 text-4xl font-bold text-white tracking-tight">
            Bienvenido
          </h2>
          <p className="mt-2 text-sm text-gray-200">
            Plataforma de Administración ICER
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-1 ml-1">Correo Electrónico</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@icer.com"
                  className="bg-white/10 border-gray-500 text-white placeholder-gray-400 focus:ring-brand-accent focus:border-brand-accent"
                />
            </div>
            <div className="group">
                <label className="block text-sm font-medium text-gray-200 mb-1 ml-1">Contraseña</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="bg-white/10 border-gray-500 text-white placeholder-gray-400 focus:ring-brand-accent focus:border-brand-accent"
                />
            </div>
          </div>

          {error && (
            <div className="text-red-200 text-sm text-center bg-red-900/50 p-3 rounded border border-red-500/30">
              {error}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            isLoading={loading}
            className="bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold py-3 shadow-lg transform transition hover:scale-[1.02]"
          >
            Ingresar
          </Button>
        </form>
        
        {/* Build date info */}
        <div className="text-center mt-4">
          <p className="text-xs text-gray-300/70">
            Build Date: {formatBuildDate(__BUILD_DATE__)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;