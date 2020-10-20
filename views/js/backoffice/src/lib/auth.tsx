import React, { useEffect, useState, createContext, useContext } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { REGISTER, TOKEN_AUTH, VERIFY_TOKEN } from "../api/mutations";
import { Register, RegisterVariables } from "../api/types/Register";
import { TokenAuth, TokenAuthVariables } from "../api/types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "../api/types/VerifyToken";
import { ME } from "../api/queries";
import { Me } from "../api/types/Me";

interface Profile {
  email: string;
  name: string;
  logo?: string;
}

export const TOKEN_KEY = "yownesToken";

interface IAuth {
  login: (variables: TokenAuthVariables) => Promise<void>;
  register: (variables: RegisterVariables) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  token: string | undefined;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<Partial<IAuth>>({});

export const useAuth = () => useContext(AuthContext);

function useAuthLogic() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string>();

  function login(variables: TokenAuthVariables) {
    return tokenAuth({
      variables,
    }).then(({ data }) => {
      if (data?.tokenAuth?.success && data.tokenAuth.token) {
        localStorage.setItem(TOKEN_KEY, data.tokenAuth.token);
        setToken(data.tokenAuth.token);
        if (data.tokenAuth.user?.isStaff) {
          setIsAdmin(true);
        }
      }
    });
  }

  function register(variables: RegisterVariables) {
    return registerMutation({
      variables,
    }).then(({ data }) => {
      if (data?.register?.success && data.register.token) {
        localStorage.setItem(TOKEN_KEY, data.register.token);
        setToken(data.register.token);
      }
    });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(undefined);
  }
  const [tokenAuth] = useMutation<TokenAuth, TokenAuthVariables>(TOKEN_AUTH);
  const [registerMutation] = useMutation<Register, RegisterVariables>(REGISTER);
  const [verifyToken] = useMutation<VerifyToken, VerifyTokenVariables>(
    VERIFY_TOKEN
  );
  const [me] = useLazyQuery<Me>(ME, {
    onCompleted({ me }) {
      if (me?.isStaff) {
        setIsAdmin(true);
      }
    },
  });

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);

    if (t) {
      verifyToken({ variables: { token: t } }).then((result) => {
        if (result.data?.verifyToken?.success) {
          me();
          setToken(t);
        }
      });
    }
  }, [me, verifyToken]);

  return {
    login,
    logout,
    register,
    isAuthenticated: !!token || false,
    token,
    isAdmin,
  };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthLogic();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

class Auth {
  _isAuthenticated: boolean;
  _isAdmin: boolean;
  profile?: Profile;

  constructor() {
    this._isAuthenticated = false;
    this._isAdmin = false;
  }

  isAuthenticated() {
    return this._isAuthenticated;
  }
  isAdmin() {
    return this._isAdmin;
  }

  login(cb: () => void) {
    this._isAuthenticated = true;
    cb();
  }

  makeAdmin(cb: () => void) {
    this._isAdmin = true;
    cb();
  }

  logout(cb: () => void) {
    this._isAuthenticated = false;
    this._isAdmin = false;
    cb();
  }

  setProfile(profile: Profile) {
    this.profile = profile;
  }
}

const namespace = {
  getSingleton: (function () {
    let singleton: Auth;
    return function () {
      if (!singleton) {
        singleton = new Auth();
      }
      return singleton;
    };
  })(),
};

export default namespace;
