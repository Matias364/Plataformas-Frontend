export function getEmailFromToken(token: string | null): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.email || null;
    } catch {
      return null;
    }
  }

  export function getNameFromEmail(email: string | null): string {
    if (!email) return '';
    const [user] = email.split('@');
    const [nombre, apellidoRaw] = user.split('.');
    if (nombre && apellidoRaw) {
      const apellido = apellidoRaw.replace(/\d+$/, '');
      return `${nombre.charAt(0).toUpperCase() + nombre.slice(1)} ${apellido.charAt(0).toUpperCase() + apellido.slice(1)}`;
    }
    return email;
  }