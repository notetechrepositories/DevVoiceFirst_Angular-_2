import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

@Injectable({
  providedIn: 'root'
})
export class Deviceinfo {

  constructor(private deviceService: DeviceDetectorService) {}

   async getFullDeviceInfo(): Promise<any> {
    // Get device fingerprint
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const fingerprint = result.visitorId;

    // Get readable device info
    const deviceInfo = this.deviceService.getDeviceInfo();

    return {
      fingerprint,
      os: deviceInfo.os,
      osVersion: deviceInfo.os_version,
      browser: deviceInfo.browser,
      browserVersion: deviceInfo.browser_version,
      deviceType: deviceInfo.deviceType,
      userAgent: deviceInfo.userAgent,
      isMobile: this.deviceService.isMobile(),
      isTablet: this.deviceService.isTablet(),
      isDesktop: this.deviceService.isDesktop()
    };
  }
}
