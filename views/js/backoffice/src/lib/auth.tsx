import React, { useEffect, createContext, useContext, useReducer } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { REGISTER, TOKEN_AUTH, VERIFY_TOKEN } from "../api/mutations";
import { Register, RegisterVariables } from "../api/types/Register";
import { TokenAuth, TokenAuthVariables } from "../api/types/TokenAuth";
import { VerifyToken, VerifyTokenVariables } from "../api/types/VerifyToken";
import { ME } from "../api/queries";
import { Me } from "../api/types/Me";
import Loading from "../components/atoms/Loading";

export const TOKEN_KEY = "yownesToken";

interface Error {
  code: string;
  message: string;
}

export interface Errors {
  nonFieldErrors?: Error[];
  [key: string]: Error[] | undefined;
}



interface AuthState {
  isAdmin: boolean;
  token?: string;
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
        token: string;
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
      return {
        ...state,
        isAdmin: action.payload.isAdmin || false,
        token: action.payload.token,
        loading: false,
        isAuthenticated: !!action.payload.token,
      };
    case "LOGOUT":
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

function useAuthLogic(): IAuth {
  const [state, dispatch] = useReducer(reducer, initialState);

  function login(variables: TokenAuthVariables) {
    return tokenAuth({
      variables,
    }).then(({ data }) => {
      if (data?.tokenAuth?.success && data.tokenAuth.token) {
        localStorage.setItem(TOKEN_KEY, data.tokenAuth.token);
        dispatch({
          type: "LOGIN",
          payload: {
            token: data.tokenAuth.token,
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
        localStorage.setItem(TOKEN_KEY, data.register.token);
        dispatch({ type: "LOGIN", payload: { token: data.register.token } });
      } else {
        dispatch({type: "ERROR", payload: data?.register?.errors})
      }
    });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    dispatch({ type: "LOGOUT" });
  }
  const [tokenAuth] = useMutation<TokenAuth, TokenAuthVariables>(TOKEN_AUTH);
  const [registerMutation] = useMutation<Register, RegisterVariables>(REGISTER);
  const [verifyToken] = useMutation<VerifyToken, VerifyTokenVariables>(
    VERIFY_TOKEN
  );
  const [me] = useLazyQuery<Me>(ME, {
    onCompleted({ me }) {
      const token = localStorage.getItem(TOKEN_KEY);
      dispatch({
        type: "LOGIN",
        payload: { isAdmin: me?.isStaff, token: token || "" },
      });
    },
  });

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);

    if (t) {
      verifyToken({ variables: { token: t } })
        .then((result) => {
          if (result.data?.verifyToken?.success) {
            me();
          } else {
            dispatch({ type: "ERROR", payload: result.data?.verifyToken?.errors });
          }
        });
    } else {
      dispatch({ type: "LOADING", payload: false });
    }
  }, [me, verifyToken]);

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
