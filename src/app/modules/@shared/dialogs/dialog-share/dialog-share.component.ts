import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NbDialogRef } from "@nebular/theme";
import { TrackingService } from "../../services/tracking.service";

@Component({
  selector: "k-dialog-share",
  templateUrl: "./dialog-share.component.html",
  styleUrls: ["./dialog-share.component.scss"]
})
export class DialogShareComponent implements OnInit {
  currentTitle: string;
  constructor(
    private titleService: Title,
    private dialogRef: NbDialogRef<any>,
    private trackingService: TrackingService
  ) {
    this.currentTitle = this.titleService.getTitle();
    // console.log('[currentTitle]: ', this.currentTitle);
  }

  ngOnInit() {}

  closeDialog(rs: any) {
    this.dialogRef.close(rs);
  }
  openShareDialog() {
    this.dialogRef.close({ shareByEmail: true });
  }

  shareSocialTracking(name: string) {
    this.trackingService.shareSocialTracking(name);
  }

  shareMailTracking(event) {
    const shareName = event.target.getAttribute("aria-label");
    this.trackingService.shareMailTracking(shareName);
  }
}
