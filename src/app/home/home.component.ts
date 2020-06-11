import { Component, OnInit, Type } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserForCreation } from './../interfaces/user-for-creation.model';
import { ErrorHandlerService } from './../shared/services/error-handler.service';
import { RepositoryService } from './../shared/services/repository.service';
import { Router } from '@angular/router';
import { TypeForLoad } from './../interfaces/type-for-load';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public errorMessage: string = '';
  public userForm: FormGroup;
  public homeText: string;
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router) { }

  ngOnInit(): void {
    //inicio del componente
    this.homeText = "Bienvenidos";
    this.userForm = new FormGroup({
      numberId: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]),
      password: new FormControl('', [Validators.required, Validators.maxLength(20),])
    });
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
 
  public loginUser = (userFormValue) => {
    if (this.userForm.valid) {
      this.getLoginUser(userFormValue);
    }
  }
 
  private getLoginUser = (userFormValue) => {
    const apiUrl = `api/user/${ userFormValue.numberId}/${ userFormValue.password}`;
    this.repository.getData(apiUrl)
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
