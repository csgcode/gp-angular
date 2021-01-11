import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  pages;

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log("dashboard loaed")
    this.authService.test();
    console.log('test finished');
    this.getPagesList();
  }

onUpdate(about, bio, website, id){
  console.log('data', about.value, bio.value, website.value, id); 
  
  if(website.value){
    if(!this.checkWebvalidation(website.value)){return;}
  }

  var params = {
    about: about.value || '',
    bio: bio.value || '',
    website: website.value || '',
  }

  var data = {
    'id': id,
    'data': params
  }

  console.log('data', params, data);
  this.updatePages(data)

} 


checkWebvalidation(url){
  var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
  if (!re.test(url)) { 
    alert("Enter Valid website");
    return false;
  }
  return true;
}



getPagesList() {
  console.log('pages list')
  this.authService.get('accounts/fb-pages-list/').subscribe(
    data => {
      this.pages = data;
      console.log('hhaha', this.pages);
    },
    error => {
      alert("something went worng! Try Again Later");
      console.log("error on fb-pages-get", error);
    }
  )
}

updatePages(data) {
  console.log('inside update', data)
  this.authService.post('accounts/fb-page-update/', data).subscribe(
    data => {
      this.pages = data['data'];
      console.log('hhaha updated', this.pages);
    },
    error => {
      alert("something went wrong! Try Again Later");
      console.log("error on fb-pages-update", error);
    }
  )
}

}
