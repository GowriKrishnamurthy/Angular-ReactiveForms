import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Customer } from './customer';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm: FormGroup;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit() {

    this.customerForm = this.formBuilder.group({
      firstName: ['',Validators.required,Validators.minLength(3)],
      lastName: ['',Validators.required,Validators.minLength(50)],
      email: ['',Validators.required,Validators.email],
      sendCatalog: true      
    });

    // this.customerForm = new FormGroup({
    //   firstName: new FormControl(),
    //   lastName: new FormControl(),
    //   email: new FormControl(),
    //   sendCatalog: new FormControl(true),
    // });
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

}
