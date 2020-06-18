import { Component, OnInit } from '@angular/core';
import { RepositoryService } from './../../shared/services/repository.service';
import { User } from './../../interfaces/user.model';
import { Filter } from './../../interfaces/filter.models';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { strict } from 'assert';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public users: User[];
  public userFilter: FormGroup;

  
  public errorMessage: string = '';
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService,private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
    this.userFilter = new FormGroup({
      numberDocumentFilter: new FormControl(""),
      firstNameFilter: new FormControl(""),
      lastNameFilter: new FormControl(""),
      
      });
  }

  public getUsers = () => {
    let apiAddress: string = "api/employee";
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.users = res as User[];
      
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })
  }

  public getUsersFilters = (userFilter) => {
    let numberDocumentFilter: string = userFilter.numberDocumentFilter ;
    let firstNameFilter: string = userFilter.firstNameFilter;
    let lastNameFilter: string = userFilter.lastNameFilter;

    let apiAddress: string = `api/employee?numberDocument=${numberDocumentFilter}&firstName=${firstNameFilter}&lastName=${lastNameFilter}`;
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.users = res as User[];
    $('#numberDocumentFilter').val("");
    $('#firstNameFilter').val("");
    $('#lastNameFilter').val("");
    
      
      
    },
    (error) => {
      this.errorHandler.handleError(error);
      this.errorMessage = this.errorHandler.errorMessage;
    })
  }

  public getUserDetails = (id) => { 
    const detailsUrl: string = `user/details/${id}`; 
    this.router.navigate([detailsUrl]); 
  }

  public redirectToUpdatePage = (id) => { 
    const updateUrl: string = `/user/update/${id}`; 
    this.router.navigate([updateUrl]); 
}

public redirectToDeletePage = (id) => { 
  const deleteUrl: string = `/user/delete/${id}`; 
  this.router.navigate([deleteUrl]); 
}

}
