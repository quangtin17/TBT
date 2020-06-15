import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TrackingService {
  constructor() {}

  shareSocialTracking(name: string) {
    const dataL = {
      event: "content_participate",
      eventCategory: "Stories",
      contentParticipates: 1,
      eventAction: "share",
      eventLabel: name,
      socialMediaPlatform: name,
      socialShares: 1,
      timestamp: Date.now()
    };
    (window as any).dataLayer.push(dataL);
  }

  shareMailTracking(name: string) {
    const dataL = {
      event: "content_participate",
      eventCategory: "Stories",
      contentParticipates: 1,
      eventAction: "share",
      eventLabel: name,
      socialMediaPlatform: name,
      socialShares: 1,
      timestamp: Date.now()
    };
    (window as any).dataLayer.push(dataL);
  }
}
