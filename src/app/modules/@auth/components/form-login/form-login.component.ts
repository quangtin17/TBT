import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '../../../@core/services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'k-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss']
})
export class FormLoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.fb.control('admin', [Validators.required]),
      password: this.fb.control('OurBetterW0r1d.@rg!', [Validators.required])
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.userService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        data => {
          let user = data.username || 'User';
          this.toastService.success(`Welcome, ${user} !`, 'Login successful');
        },
        error => {
          this.toastService.error(error, 'Error', {
            timeOut: 3000
          });
        }
      );
  }

  signInWithFB(): void {
    // this.authService.signInWithFB();
  }

  signInWithTwitter(): void {
    // this.authService.signInWithTwitter();
  }

  signInWithGoogle(): void {
    // this.authService.signInWithGoogle();
  }
}
