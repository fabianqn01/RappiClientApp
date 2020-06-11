import { Component, OnInit, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForCreation } from './../../interfaces/user-for-creation.model';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { RepositoryService } from './../../shared/services/repository.service';
import { Router } from '@angular/router';
import { TypeForLoad } from './../../interfaces/type-for-load';
 
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
  public errorMessage: string = '';
  public types: TypeForLoad [];
  public userForm: FormGroup;
 
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router) { }
 
  ngOnInit() {

    this.getTypes();

    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(60)]),
      typeIdentificationId: new FormControl('', [Validators.required]),
      numberId: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20),]),
      email: new FormControl('', [Validators.required, Validators.maxLength(80),,Validators.email])
    });


  }

  public getTypes = () => {
    let apiAddress: string = "api/typeIdentification";
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.types = res as TypeForLoad[];
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })
  }
 
  public validateControl = (controlName: string) => {
    if (this.userForm.controls[controlName].invalid && this.userForm.controls[controlName].touched)
      return true;
 
    return false;
  }
 
  public hasError = (controlName: string, errorName: string) => {
    if (this.userForm.controls[controlName].hasError(errorName))
      return true;
 
    return false;
  }
 
  public createUser = (userFormValue) => {
    if (this.userForm.valid) {
      this.executeUserCreation(userFormValue);
    }
  }
 
  private executeUserCreation = (userFormValue) => {
    const user: UserForCreation = {
      UserId: 0,
      firstName: userFormValue.firstName,
      lastName: userFormValue.lastName,
      typeIdentificationId: userFormValue.typeIdentificationId,
      numberId: userFormValue.numberId,
      password: userFormValue.password,
      email: userFormValue.email
    }
 
    const apiUrl = 'api/user';
    this.repository.create(apiUrl, user)
      .subscribe(res => {
        $('#successModal').modal();
      },
      (error => {
        $('#errorModal').modal();
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
    )
  }
 
  public redirectToUserList(){
    this.router.navigate(['/user/list']);
  }
 
}
