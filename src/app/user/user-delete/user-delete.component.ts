import { Component, OnInit } from '@angular/core';
import { ErrorHandlerService } from './../../shared/services/error-handler.service';
import { RepositoryService } from './../../shared/services/repository.service';
import { User } from './../../interfaces/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserForCreation } from './../../interfaces/user-for-creation.model';
 
@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css']
})
export class UserDeleteComponent implements OnInit {
  public errorMessage: string = '';
  public user: UserForCreation;
  public userID: number=0;
 
constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService, private router: Router,
  private activeRoute: ActivatedRoute) { }
 
  ngOnInit() {
    this.getUserById();
  }
   
  private getUserById = () => {
    this.userID  = this.activeRoute.snapshot.params['id'];
    
    const userByIdUrl: string = `api/user/${this.userID}`;
   
    this.repository.getData(userByIdUrl)
      .subscribe(res => {
        this.user = res as UserForCreation;
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }
   
  public redirectToUserList = () => {
    this.router.navigate(['/user/list']);
  }

  public deleteUser = () => {
    const deleteUrl: string = `api/user/${this.userID}`;
    this.repository.delete(deleteUrl)
      .subscribe(res => {
        $('#successModal').modal();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }
}