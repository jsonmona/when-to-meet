import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getCsrfToken } from '../apis/auth';

interface IAuthInfo {
  update: (newUserId: Omit<IAuthInfo, 'update'>) => void;

  userId: string | null;
}

const AuthContext = createContext<IAuthInfo | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<Omit<IAuthInfo, 'update'>>({
    userId: null,
  });

  useEffect(() => {
    getCsrfToken();
  }, []);

  const update = useCallback(
    (info: Omit<IAuthInfo, 'update'>) => {
      setData(info);
    },
    [setData]
  );

  return (
    <AuthContext.Provider value={{ ...data, update }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthInfo = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('must be used within a provider');
  }

  return context;
};
