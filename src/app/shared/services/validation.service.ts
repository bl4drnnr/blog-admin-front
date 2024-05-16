import { Injectable } from '@angular/core';
import { CheckLengthInterface } from '@interfaces/services/validation/check-length.interface';
import { MfaButtonDisableInterface } from '@interfaces/services/validation/mfa-button-disable.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  isEmailCorrect(email: string) {
    if (email) {
      const regex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );
      return regex.test(email);
    } else return email === '';
  }

  mfaButtonDisable({ isMfaRequired, mfaCode }: MfaButtonDisableInterface) {
    return isMfaRequired && mfaCode?.length !== 6;
  }

  async checkPasswordsRules(password: string) {
    const passwordRules = [
      { error: true, text: 'Password should be at least 8 characters long.' },
      {
        error: true,
        text: 'Password should have at least one lowercase letter.'
      },
      {
        error: true,
        text: 'Password should have at least one special character.'
      },
      { error: true, text: 'Password should have at least one digit.' },
      {
        error: true,
        text: 'Password should have at least one uppercase letter.'
      }
    ];

    if (password) {
      if (password.length >= 8) {
        passwordRules[0].error = false;
      }
      if (/[a-z]/.test(password)) {
        passwordRules[1].error = false;
      }
      if (/[#?!@$%^&*-]/.test(password)) {
        passwordRules[2].error = false;
      }
      if (/\d/.test(password)) {
        passwordRules[3].error = false;
      }
      if (/[A-Z]/.test(password)) {
        passwordRules[4].error = false;
      }
    }
    return passwordRules;
  }

  isFQDN(domain: string) {
    if (domain) {
      const regex = new RegExp(
        /^(?!.*?_.*?)(?!(?:[\w]+?\.)?\-[\w\.\-]*?)(?![\w]+?\-\.(?:[\w\.\-]+?))(?=[\w])(?=[\w\.\-]*?\.+[\w\.\-]*?)(?![\w\.\-]{254})(?!(?:\.?[\w\-\.]*?[\w\-]{64,}\.)+?)[\w\.\-]+?(?<![\w\-\.]*?\.[\d]+?)(?<=[\w\-]{2,})(?<![\w\-]{25})$/
      );
      return regex.test(domain);
    } else return domain === '' || domain === undefined || domain === null;
  }

  checkLength({ str, min, max }: CheckLengthInterface) {
    if (!str) return true;

    const length = str.length;

    if (min !== undefined && max !== undefined) {
      return length >= min && length <= max;
    } else if (min !== undefined) {
      return length >= min;
    } else if (max !== undefined) {
      return length <= max;
    }

    return false;
  }

  checkBase64PngImage(image: string) {
    if (image) {
      const regex = new RegExp(/data:image\/png;base64,([^\"]*)/);
      return regex.test(image);
    }
    return image === '';
  }

  checkRecoveryKeys(recoveryKeys: Array<string>) {
    let corruptedKey = false;

    if (recoveryKeys.length !== 5) return false;
    else recoveryKeys.forEach((key) => (corruptedKey = key.length !== 1024));

    return !corruptedKey;
  }
}