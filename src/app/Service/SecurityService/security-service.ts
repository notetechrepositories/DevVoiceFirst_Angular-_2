import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  private readonly SECRET_KEY = '+ANR9KWQck6EWL7eduUrXo6IF+M7HrssyQDwWz4i5nwPIwvrDXASlzaqGxN2V98U'; 

  constructor() {}

  encrypt(data: string): string {
    try {
      const ciphertext = CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
      return ciphertext;
    } catch (e) {
      console.error('Encryption failed', e);
      return '';
    }
  }

  decrypt(ciphertext: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error('Decryption failed', e);
      return '';
    }
  }

  // Optional: Encrypt & decrypt JSON objects
  encryptObject(obj: any): string {
    const jsonString = JSON.stringify(obj);
    return this.encrypt(jsonString);
  }

  decryptObject(ciphertext: any): any {
    const jsonString = this.decrypt(ciphertext);
    return JSON.parse(jsonString);
  }
}
