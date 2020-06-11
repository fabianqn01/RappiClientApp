import { Component, OnInit } from '@angular/core';
import { RepositoryService } from './../../shared/services/repository.service';
import { User } from './../../interfaces/user.model';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  public users: User[];

  
  public errorMessage: string = '';
  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService,private router: Router) { }

  ngOnInit(): void {
    this.getUsers();
  }

  public getUsers = () => {
    let apiAddress: string = "api/user";
    this.repository.getData(apiAddress)
    .subscribe(res => {
      this.users = res as User[];
      
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
