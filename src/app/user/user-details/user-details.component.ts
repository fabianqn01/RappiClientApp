import { Component, OnInit } from '@angular/core';
import { User } from './../../interfaces/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { RepositoryService } from './../../shared/services/repository.service';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { TypeForLoad } from './../../interfaces/type-for-load';
 
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  public user: User;
  public errorMessage: string = '';
  public types: TypeForLoad [];
  public nameType:string; 
 
  constructor(private repository: RepositoryService, private router: Router, 
              private activeRoute: ActivatedRoute, private errorHandler: ErrorHandlerService) { }
 
  ngOnInit() {
    this.getTypes();
    this.getUserDetails()
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
 
  getUserDetails = () => {
    let id: string = this.activeRoute.snapshot.params['id'];
    let apiUrl: string = `api/user/${id}/`;
 
    this.repository.getData(apiUrl)
    .subscribe(res => {
      this.user = res as User;
      if(this.user.typeIdentificationId == 1){
        this.nameType = "CC";
      }
      if(this.user.typeIdentificationId == 2){
        this.nameType = "RC";
      }
      if(this.user.typeIdentificationId == 3){
        this.nameType = "TI";
      }
      if(this.user.typeIdentificationId == 4){
        this.nameType = "CE";
      }
      if(this.user.typeIdentificationId == 5){
        this.nameType = "PA";
      }
             
      
    

    },
    (error) =>{
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })

    
    
    
  }

  public redirectToUserList(){
    this.router.navigate(['/user/list']);
  }
 
}
