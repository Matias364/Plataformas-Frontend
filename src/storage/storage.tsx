// storage.tsx

// Guardar datos en localStorage
export const saveToStorage = (key: string, value: any) => {
    try {
      const stringifiedValue = JSON.stringify(value);
      localStorage.setItem(key, stringifiedValue);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  };
  
  // Leer datos desde localStorage
  export const readFromStorage = (key: string) => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error('Error al leer desde localStorage:', error);
      return null;
    }
  };
  
  // Eliminar datos de localStorage
  export const removeFromStorage = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar del localStorage:', error);
    }
  };
  
  // Guardar tokens y datos del usuario
  export const saveUserData = (userData: any, accessToken: string, refreshToken: string, expiresIn: number) => {
    saveToStorage('user_data', userData); // Guardamos los datos del usuario
    saveToStorage('access_token', accessToken); // Guardamos el access token
    saveToStorage('refresh_token', refreshToken); // Guardamos el refresh token
    saveToStorage('expires_at', expiresIn); // Guardamos la fecha de expiración del access token
  };
  
  // Leer los datos del usuario y tokens
  export const getUserData = () => {
    const userData = readFromStorage('user_data');
    const accessToken = readFromStorage('access_token');
    const refreshToken = readFromStorage('refresh_token');
    return { userData, accessToken, refreshToken };
  };
  
  // Eliminar todos los datos del usuario (logout)
  export const clearUserData = () => {
    removeFromStorage('user_data');
    removeFromStorage('access_token');
    removeFromStorage('refresh_token');
    removeFromStorage('expires_at');
  };
  