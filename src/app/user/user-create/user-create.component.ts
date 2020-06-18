import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { RepositoryService } from './../../shared/services/repository.service';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from './../../interfaces/user.model';
import { UserForCreation } from './../../interfaces/user-for-creation.model';
import { TypeForLoad } from './../../interfaces/type-for-load';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Area } from 'src/app/interfaces/area.model';
import { SubArea } from 'src/app/interfaces/subArea.model';
 
@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  public errorMessage: string = '';
  public user: User;
  public userForm: FormGroup;
  public types: TypeForLoad [];
  public areas: Area [];
  public subAreas: SubArea [];
  public subArea: SubArea;
  selectedTypeValue = 0; // Iniciamos
  selectedAreaValue = 0; // Iniciamos
  selectedSubAreaValue = 0; // Iniciamos
 
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router,
    private activeRoute: ActivatedRoute) { }
 
  ngOnInit() {

    this.getTypes();
    this.getAreas();
    this.getSubAreas();

    this.userForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      idTypeIdentification: new FormControl('', [Validators.required]),
      numberDocument: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern("^[0-9]*$")]),
      idArea: new FormControl('', [Validators.required]),
      idSubArea: new FormControl('', [Validators.required])
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

  public getAreas = () => {
    let apiAddress: string = "api/area";
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.areas = res as Area[];
      
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })
  }

  public getSubAreas = () => {
    let apiAddress: string = `api/area/${this.selectedAreaValue}/`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.subAreas = res as SubArea[];
      this.selectedSubAreaValue = this.user.idSubArea;
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })
  }

  public onOptionsSelectedArea = (userFormValue) => {
    let apiAddress: string = `api/area/${userFormValue.idArea}/`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.subAreas = res as SubArea[];
      this.selectedSubAreaValue = this.subAreas.length < 1 ? null : this.subAreas[0].idSubArea;
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
    const user: User = {
      idEmployee: 0,
      firstName: userFormValue.firstName,
      lastName: userFormValue.lastName,
      idTypeIdentification: userFormValue.idTypeIdentification,
      numberDocument: userFormValue.numberDocument,
      idSubArea: userFormValue.idSubArea
    }
 
    const apiUrl = 'api/employee';
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
