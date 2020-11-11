import React, { useEffect, createContext, useContext, useReducer } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { REFRESH_TOKEN, REGISTER, TOKEN_AUTH } from "../api/mutations";
import { Register, RegisterVariables } from "../api/types/Register";
import { TokenAuth, TokenAuthVariables } from "../api/types/TokenAuth";
import { ME } from "../api/queries";
import { Me } from "../api/types/Me";
import Loading from "../components/atoms/Loading";
import { RefreshToken, RefreshTokenVariables } from "../api/types/RefreshToken";

export const TOKEN_KEY = "yownesToken";

interface Error {
  code: string;
  message: string;
}

interface Token {
  token: string;
  expiry: number;
}

export interface Errors {
  nonFieldErrors?: Error[];
  [key: string]: Error[] | undefined;
}

interface AuthState {
  isAdmin: boolean;
  token?: Token;
  loading: boolean;
  errors?: Errors;
  isAuthenticated: boolean;
}

interface IAuth extends AuthState {
  login: (variables: TokenAuthVariables) => Promise<void>;
  register: (variables: RegisterVariables) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

type AuthStateAction =
  | {
      type: "LOGIN";
      payload: {
        isAdmin?: boolean;
        token?: Token;
      };
    }
  | {
      type: "LOADING";
      payload: boolean;
    }
  | {
      type: "ERROR";
      payload: Errors;
    }
  | {
      type: "LOGOUT";
    };

const AuthContext = createContext<Partial<IAuth>>({});

export const useAuth = () => useContext(AuthContext);

const initialState: AuthState = {
  loading: true,
  isAdmin: false,
  isAuthenticated: false,
};


let inMemoryToken: string;

export function getToken() {
  return inMemoryToken;
}

function reducer(state: AuthState, action: AuthStateAction): AuthState {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        errors: action.payload,
        loading: false,
        isAuthenticated: false,
      };
    case "LOGIN":
      if (action.payload.token) {
        inMemoryToken = action.payload.token.token;
      }
      return {
        ...state,
        isAdmin: action.payload.isAdmin || false,
        token: action.payload.token || state.token,
        loading: false,
        isAuthenticated: action.payload.token ? true : !!state.token,
      };
    case "LOGOUT":
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

function parseToken(token: string): Token {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload.exp;
  return {
    token,
    expiry,
  };
}

function useAuthLogic(): IAuth {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tokenAuth] = useMutation<TokenAuth, TokenAuthVariables>(TOKEN_AUTH);
  const [registerMutation] = useMutation<Register, RegisterVariables>(REGISTER);
  const [refreshTokenMutation] = useMutation<
    RefreshToken,
    RefreshTokenVariables
  >(REFRESH_TOKEN);
  const [me] = useLazyQuery<Me>(ME, {
    onCompleted({ me }) {
      dispatch({
        type: "LOGIN",
        payload: { isAdmin: me?.isStaff },
      });
    },
  });

  function login(variables: TokenAuthVariables) {
    return tokenAuth({
      variables,
    }).then(({ data }) => {
      if (data?.tokenAuth?.success && data.tokenAuth.token) {
        if (data.tokenAuth.refreshToken) {
          localStorage.setItem(TOKEN_KEY, data.tokenAuth.refreshToken);
        }
        const token = parseToken(data.tokenAuth.token);
        setTimeout(refreshToken, token.expiry * 1000 - new Date().getTime());
        dispatch({
          type: "LOGIN",
          payload: {
            token,
            isAdmin: data.tokenAuth.user?.isStaff ?? false,
          },
        });
      } else {
        //TODO: Error handling
        dispatch({ type: "ERROR", payload: data?.tokenAuth?.errors });
      }
    });
  }

  function register(variables: RegisterVariables) {
    return registerMutation({
      variables,
    }).then(({ data }) => {
      if (data?.register?.success && data.register.token) {
        if (data.register.refreshToken) {
          localStorage.setItem(TOKEN_KEY, data.register.refreshToken);
        }
        dispatch({
          type: "LOGIN",
          payload: { token: parseToken(data.register.token) },
        });
      } else {
        dispatch({ type: "ERROR", payload: data?.register?.errors });
      }
    });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    dispatch({ type: "LOGOUT" });
  }

  function refreshToken() {
    const thRefreshToken = localStorage.getItem(TOKEN_KEY);
    if (thRefreshToken) {
      refreshTokenMutation({
        variables: { refreshToken: thRefreshToken },
        fetchPolicy: "no-cache",
      }).then(({ data }) => {
        if (data?.refreshToken?.success && data.refreshToken.token) {
          const token = parseToken(data.refreshToken.token);
          const ms = token.expiry * 1000 - new Date().getTime();

          setTimeout(refreshToken, ms);

          dispatch({
            type: "LOGIN",
            payload: { token },
          });

          me();

          if (data.refreshToken.refreshToken) {
            localStorage.setItem(TOKEN_KEY, data.refreshToken.refreshToken);
          }
        } else {
          dispatch({ type: "ERROR", payload: data?.refreshToken?.errors });
        }
      });
    }
  }

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      refreshToken();
    } else {
      dispatch({ type: "LOADING", payload: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    login,
    logout,
    register,
    ...state,
  };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthLogic();
  if (auth.loading) {
    return <Loading />;
  }
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
