import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { NbDialogRef } from '@nebular/theme';
import { UserService } from '../../../@core/services/user.service';
import { User } from '../../../@core/models/user';
import { excludeValuesValidator } from '../../../../validators/exclude-values.validator';

@Component({
  selector: 'k-dialog-text-field',
  templateUrl: './dialog-text-field.component.html',
  styleUrls: ['./dialog-text-field.component.scss']
})
export class DialogTextFieldComponent implements OnInit {
  shareForm: FormGroup;

  submitted: boolean;
  currentUserData: User;
  isCreate: boolean;
  btnText: string;
  defaultValue: string;
  namePattern: string;
  excludeValues: string[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<any>,
    private userService: UserService,
    public toastrService: ToastrService
  ) {
    this.submitted = false;
    this.currentUserData = this.userService.getCurrentUser;
    this.isCreate = true;
    this.btnText = 'Create';
    this.defaultValue = '';
    this.namePattern = "^[a-zA-Z0-9]+(([',. -][a-zA-Z0-9])?[a-zA-Z0-9]*)*$";
    this.excludeValues = [];
  }

  ngOnInit() {
    this.shareForm = this.fb.group({
      list_name: this.fb.control(this.defaultValue, [
        Validators.required,
        // Validators.pattern(this.namePattern),
        excludeValuesValidator(this.excludeValues)
        // Validators.maxLength(40)
      ])
    });
  }

  /**
   * Convenience getter for easy access to form fields
   */
  get f() {
    return this.shareForm.controls;
  }

  closeDialog(rs: any) {
    this.dialogRef.close(rs);
  }

  /**
   * Funct handle submit action
   * Post Form Values to server
   */
  submitForm() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.shareForm.invalid) {
      // console.log('[createBookmark form] is invalid !');
      return;
    }

    const postData = {
      isCreate: this.isCreate,
      data: {
        ...this.shareForm.value,
        uid: this.currentUserData.id
      }
    };

    // console.log('[TODO] post Create bookmarklist Data: ', postData);
    this.dialogRef.close(postData);
  }
}
