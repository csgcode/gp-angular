import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from './../../environments/environment';
import { AccountService } from './../_services/account.service';
import { AuthenticationService } from './../_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private accountService: AccountService,
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.fbLibrary();
  }
  
  fbLibrary() {
 
    (window as any).fbAsyncInit = function() {
      window['FB'].init({
        appId      : environment.facebookAppId,
        cookie     : true,
        xfbml      : true,
        version    : 'v8.0'
      });
      window['FB'].AppEvents.logPageView();
    };
  
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  
  }


  login() {
    window['FB'].login((response) => {
        console.log('login response',response);
        if (response.authResponse) {
 
          window['FB'].api('/me', {
            fields: 'last_name, first_name, email'
          }, (userInfo) => {
 
            console.log("user information");
            console.log(userInfo);
          });
          this.loginToApi(response.authResponse.accessToken);
           
        } else {
          console.log('User login failed');
        }
    }, {scope: 'email'});
    window['FB'].getLoginStatus(function(response) {
      if (response.status === 'connected') {
        console.log(response.authResponse.accessToken);
        console.log('this is tooken')
      }
    });
}

loginToApi(access_token){
  console.log('callig with token', access_token);
  this.authService.login(access_token).pipe(first()).subscribe(
    data => {
      console.log('resopnse@@ login sucess', data);
      this.router.navigate(['/']);
    }, 
    error =>{
      console.log('error', error);
    },
  );
}

}
