import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'k-video-youtube',
  templateUrl: './video-youtube.component.html',
  styleUrls: ['./video-youtube.component.scss']
})
export class VideoYoutubeComponent implements OnInit {
  @Input() youtubeVideo;
  playedVideo: boolean;
  player: YT.Player;

  constructor() {
    this.playedVideo = false;
  }

  ngOnInit() {}

  clickOverlay() {
    this.playedVideo = true;
    this.player.playVideo();
  }

  savePlayer(player) {
    this.player = player;
    // console.log('player instance', player);
  }

  onStateChange(event) {
    // console.log('player state', event.data);
  }
}
