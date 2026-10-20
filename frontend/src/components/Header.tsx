import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

const navClass = ({ isActive }: { isActive: boolean }) => 'nav-link' + (isActive ? ' active' : '');

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <NavLink to="/" className="logo">🔗 Links</NavLink>
        <nav className="nav">
          <NavLink to="/" end className={navClass}>Просмотр ссылок</NavLink>
          <NavLink to="/manage" className={navClass}>Добавить / удалить</NavLink>
          <NavLink to="/contacts" className={navClass}>Контакты</NavLink>
          {user ? (
            <button type="button" className="nav-link nav-link-button" onClick={handleLogout}>
              Выйти ({user.username})
            </button>
          ) : (
            <NavLink to="/login" className={navClass}>Войти</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
