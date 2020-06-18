import { Component, OnInit } from '@angular/core';
import { User } from './../../interfaces/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { RepositoryService } from './../../shared/services/repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { TypeForLoad } from './../../interfaces/type-for-load';
import { Area } from 'src/app/interfaces/area.model';
import { SubArea } from 'src/app/interfaces/subArea.model';
 
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  public user: User;
  public errorMessage: string = '';
  public types: TypeForLoad [];
  public areas: Area [];
  public subAreas: SubArea [];
  public subArea: SubArea;
  public nameType:string; 
  selectedTypeValue = 0; // Iniciamos
  selectedAreaValue = 0; // Iniciamos
  selectedSubAreaValue = 0; // Iniciamos
 
  constructor(private repository: RepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }
 
  ngOnInit() {
    this.getTypes();
    this.getUserDetails();
    this.getAreas();
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

  public getSubAreaByID = () => {
    let apiAddress: string = `api/area/getSubAreaByID/${this.user.idSubArea}/`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
        this.subArea = res as SubArea;
        this.selectedAreaValue = this.subArea.idArea;
        this.getSubAreas();
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })
  }

  public getSubAreas = () => {
    let apiAddress: string = `api/area/${this.subArea.idArea}/`;
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
 
  getUserDetails = () => {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/employee/GetEmployeeByID/${id}/`;
 
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.user = res as User;
      this.getSubAreaByID();
      this.selectedTypeValue =  this.user.idTypeIdentification;
      this.selectedSubAreaValue = this.user.idSubArea;
      this.onOptionsSelectedArea(this.selectedSubAreaValue);
      
      
    },
    (error) =>{
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })

    
    
    
  }

  public onOptionsSelectedArea = (id: number) =>{

    let apiAddress: string = `api/area/${id}/`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.subAreas = res as SubArea[];
      this.subAreas.forEach(obj =>{
        if(obj.idSubArea = this.selectedSubAreaValue)
        this.selectedAreaValue = obj.idArea;
      });
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })

  }

  public redirectToUserList(){
    this.router.navigate(['/user/list']);
  }
 
}
