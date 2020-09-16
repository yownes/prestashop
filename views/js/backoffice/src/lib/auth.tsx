class Auth {
  _isAuthenticated: boolean;
  _isAdmin: boolean;

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
    cb();
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
