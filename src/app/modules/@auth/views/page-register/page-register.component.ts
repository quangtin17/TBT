import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../@core/services/user.service';
@Component({
  selector: 'k-page-register',
  templateUrl: './page-register.component.html',
  styleUrls: ['./page-register.component.scss']
})
export class PageRegisterComponent implements OnInit {
  returnUrl: string;
  currentUserSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toastService: ToastrService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    // console.log('[Page Register] this.returnUrl : ', this.returnUrl);

    // redirect to home if already logged in
    this.currentUserSubscription = this.userService.currentUser.subscribe(
      user => {
        // console.log('[Page Register] subscribe - Current User: ', user);
        if (user !== null) {
          this.toastService.success(`User already login!`, 'Login');
          this.router.navigate([this.returnUrl]);
        }
      }
    );
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  // convenience getter for easy access to form fields
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }
}
