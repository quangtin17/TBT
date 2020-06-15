import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

import { UserService } from '../../../@core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'k-form-register',
  templateUrl: './form-register.component.html',
  styleUrls: ['./form-register.component.scss']
})
export class FormRegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required])
    });
  }
  get f() {
    return this.registerForm.controls;
  }
  onSubmit() {
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.userService
      .register(this.registerForm.value)
      // .pipe(first())
      .subscribe(
        data => {
          // let user = data.firstName || 'User';
          // console.log('register: ', data);
          // this.toastService.success(`Welcome, ${user} !`, 'Login successful');
        },
        error => {
          this.toastService.error(error, 'Error', {
            timeOut: 3000
          });
        }
      );
  }
}
