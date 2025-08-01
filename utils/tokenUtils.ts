import { jwtDecode } from 'jwt-decode';

export interface JwtPayload {
  sub: string; // subject (userId)
  username: string;
  profileId: string;
  roles: string[];
  iat: number; // issued at
  exp: number; // expiration
}

export class TokenUtils {
  /**
   * Decodifica o token JWT e retorna o payload
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  /**
   * Verifica se o token está expirado
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) return true;
      
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true;
    }
  }

  /**
   * Extrai o profileId do token
   */
  static getProfileIdFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.profileId || null;
  }

  /**
   * Extrai o userId do token
   */
  static getUserIdFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.sub || null;
  }

  /**
   * Extrai o username do token
   */
  static getUsernameFromToken(token: string): string | null {
    const decoded = this.decodeToken(token);
    return decoded?.username || null;
  }

  /**
   * Extrai as roles do token
   */
  static getRolesFromToken(token: string): string[] {
    const decoded = this.decodeToken(token);
    return decoded?.roles || [];
  }
}
