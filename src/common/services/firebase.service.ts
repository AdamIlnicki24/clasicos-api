import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  // create function to generate random password
  generateRandomPassword(length: number): string {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialCharacters = "!@#$%^&*()-_=+[]{}|;:',.<>?";

    const allCharacters = lowerCase + upperCase + numbers + specialCharacters;

    if (length < 4) {
      throw new Error(
        'Password length must be at least 4 to include all character types.',
      );
    }

    // Ensure at least one of each type of character
    const password = [
      lowerCase[Math.floor(Math.random() * lowerCase.length)],
      upperCase[Math.floor(Math.random() * upperCase.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      specialCharacters[Math.floor(Math.random() * specialCharacters.length)],
    ];

    // Fill the rest of the password with random characters
    for (let i = password.length; i < length; i++) {
      password.push(
        allCharacters[Math.floor(Math.random() * allCharacters.length)],
      );
    }

    // Shuffle the password array to randomize the order
    return password.sort(() => Math.random() - 0.5).join('');
  }

  async updateFirebaseUser(
    uid: string,
    email: string,
  ): Promise<admin.auth.UserRecord> {
    return await admin.auth().updateUser(uid, { email: email });
  }

  async createFirebaseUser(
    email: string,
    password: string,
  ): Promise<admin.auth.UserRecord> {
    return await admin.auth().createUser({
      email,
      password,
    });
  }

  async deleteFirebaseUser(uid: string): Promise<void> {
    return await admin.auth().deleteUser(uid);
  }
}
