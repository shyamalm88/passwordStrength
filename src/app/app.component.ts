import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  signupForm!: FormGroup;
  config: any = {
    length: 8,
    minimumSpecialCharacter: 2,
    minimumDIgit: 3,
    minimumUpperCase: 2,
    minimumLowerCase: 1,
  };
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.signupForm = this.fb.group({
      fullName: new FormControl('', Validators.compose([Validators.required])),
      email: new FormControl('', Validators.compose([Validators.required])),
      pwd: new FormControl('', Validators.compose([Validators.required])),
      confirmPwd: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }
}
