import decode from "jwt-decode";

class AuthService {
  //retrieve data saved in token
  getProfile() {
    return decode(this.getToken());
  }

  /**
   * Checks if the user is still logged in
   * Checks if there is a saved token and it's still valid
   * use type coersion to check if token is NOT undefined and the token is NOT expired
     !! converts truthy or falsy values to true or false. given anythig other than a boolen will convert to boolean and negate
     In the case of undefined -> it is converted to false and then negated
   * @return {Boolean} 
   * @memberof AuthService
   */

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if the token has expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  // set token to localStorage and reload page to homepage
  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);

    window.location.assign("/");
  }

  // clear token from localStorage and force logout with reload
  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    // this will reload the page and reset the state of the application
    window.location.assign("/");
  }
}

export default new AuthService();
