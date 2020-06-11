import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { RepositoryService } from './../../shared/services/repository.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from './../../interfaces/user.model';
import { UserForCreation } from './../../interfaces/user-for-creation.model';
import { TypeForLoad } from './../../interfaces/type-for-load';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
 
@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {
 
  public errorMessage: string = '';
  public user: UserForCreation;
  public userForm: FormGroup;
  public userID: number=0;
  public types: TypeForLoad [];
 
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router,
    private activeRoute: ActivatedRoute) { }
 
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
     
      this.getUserById();
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

    private getUserById = () => {
       this.userID  = this.activeRoute.snapshot.params['id'];
        
      let userByIdUrl: string = `api/user/${this.userID}`;
     
      this.repository.getData(userByIdUrl)
        .subscribe(res => {
          this.user = res as UserForCreation;
          this.userForm.patchValue(this.user);
          
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
     
    
    public redirectToUserList = () => {
      this.router.navigate(['/user/list']);
    }

    public updateUser = (userFormValue) => {
      if (this.userForm.valid) {
        this.executeUserUpdate(userFormValue);
      }
    }
     
    private executeUserUpdate = (userFormValue) => {
     
      this.user.firstName = userFormValue.firstName;
      this.user.lastName = userFormValue.lastName;
      this.user.typeIdentificationId = userFormValue.typeIdentificationId;
      this.user.numberId = userFormValue.numberId;
      this.user.password = userFormValue.password;
      this.user.email = userFormValue.email;
     
      const apiUrl = `api/user/${this.userID}`;
      this.user.UserId = this.userID;
      this.repository.update(apiUrl, this.user)
        .subscribe(res => {
          $('#successModal').modal();
        },
        (error => {
          this.errorHandler.handleError(error);
          this.errorMessage = this.errorHandler.errorMessage;
        })
      )
    }
}