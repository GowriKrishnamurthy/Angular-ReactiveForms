import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Customer } from './customer';

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmControl.value) {
    return null;
  }
  return { match: true };
}

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { range: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;
  emailMessage: string;

  private validationMessages = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(private formBuilder:FormBuilder) { }
 
  ngOnInit() {

    this.customerForm = this.formBuilder.group({
      firstName: ['',[Validators.required,Validators.minLength(3)]],
      lastName: ['',[Validators.required,Validators.maxLength(50)]],
      emailGroup: this.formBuilder.group(
        {
          email: ['', [Validators.required,Validators.email]],
          confirmEmail: ['', [Validators.required]],    
        }, {validator: emailMatcher}
      ),
      phone:'',
      notification:'email',
      rating: [null, ratingRange(1, 5)],
      //rating: [null, [Validators.min(1),Validators.max(5)]],
      sendCatalog: true,
      addresses: this.buildAddress()

    });

    this.customerForm.get('notification').valueChanges.subscribe(
      value => this.setNotification(value)
    );

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(
      debounceTime(2000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );

    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   phone: new FormControl(),
    //   notification: new FormControl('email'),
    //   sendCatalog: new FormControl(true),
    // });
  }

  buildAddress():FormGroup {
    return this.formBuilder
    .group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip:''
    })
  }
    
  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }
  populateTestData(){
    this.customerForm.setValue({
      firstName: 'Gowri',
      lastName: 'K',
      email: 'Gowrik@something.com',
      sendCatalog: false
    });
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }


}
