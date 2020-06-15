import { isPlatformBrowser } from "@angular/common";
import { Component, Inject, OnInit, PLATFORM_ID } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NbDialogService } from "@nebular/theme";
import { WINDOW } from "@ng-toolkit/universal";
import {
  DialogShareByEmailComponent,
  DialogShareComponent
} from "../../dialogs";
import { ShareGroupService } from "../../services/share-group.service";
import { TrackingService } from "../../services/tracking.service";

@Component({
  selector: "k-share",
  templateUrl: "./share.component.html",
  styleUrls: ["./share.component.scss"]
})
export class ShareComponent implements OnInit {
  show: boolean;
  currentHref: string;
  currentTitle: string;
  shareObj: any;

  autoSetMeta: boolean = false;
  constructor(
    private titleService: Title,
    private dialogService: NbDialogService,
    private shareGroupService: ShareGroupService,
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    private trackingService: TrackingService
  ) {}

  ngOnInit() {
    // console.log('[ShareComponent] ngOnInit');
    if (isPlatformBrowser(this.platformId)) {
      this.shareGroupService.showShare.subscribe(status => {
        // console.log('[ShareComponent] subscribe status: ', status);

        this.show = status;
        if (!!this.show) {
          setTimeout(() => {
            this.currentHref = this.window.location.href || "";
            this.currentTitle = this.titleService.getTitle();
          }, 500);
        }
      });
    }
  }

  clickShareMobileBtn() {
    this.dialogService.open(DialogShareComponent).onClose.subscribe(rs => {
      // console.log('rs: ', rs);

      if (!!rs.shareByEmail) {
        this.openShareDialog();
      }
    });
  }

  openShareDialog() {
    this.dialogService.open(DialogShareByEmailComponent);
  }

  shareSocialTracking(name: string) {
    this.trackingService.shareSocialTracking(name);
  }

  shareMailTracking(event) {
    const shareName = event.target.getAttribute("aria-label");
    this.trackingService.shareMailTracking(shareName);
  }
}
