class Auth {
  _isAuthenticated: boolean;

  constructor() {
    this._isAuthenticated = false;
  }

  isAuthenticated() {
    return this._isAuthenticated;
  }

  login(cb: () => void) {
    this._isAuthenticated = true;
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
