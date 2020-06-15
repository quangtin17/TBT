import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'k-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  counter = 5; // set second
  constructor(private router: Router) {}

  ngOnInit() {
    // this.startCountdown();
  }

  startCountdown() {
    let interval = setInterval(() => {
      console.log(this.counter);
      this.counter--;

      if (this.counter < 0) {
        // The code here will run when
        // the timer has reached zero.

        this.router.navigate(['/home']);

        clearInterval(interval);
        console.log('Ding!');
      }
    }, 1000);
  }
}
