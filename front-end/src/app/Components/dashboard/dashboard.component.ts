import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  DJANGO_SERVER: string = "http://127.0.0.1:8000";
  imageSrc: string = "";
  fileName: any;


  constructor( 
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void {}

  handleInputChange(e: any) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    console.log(file);
    var pattern = /image-*/;
    var reader = new FileReader();
    //console.log("file name: "+file.name);

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
    this.fileName = file.name;
  }

  _handleReaderLoaded(e: any) {
      let reader = e.target;
      this.imageSrc = reader.result;

      const base64Image =this.imageSrc.split(",")[1];
      const fileType = this.imageSrc.split("/")[1].split(";")[0];
      //console.log("file type --------->"+ fileType);
      //console.log(base64Image);
      const url = this.DJANGO_SERVER + "/api/create";

      this.httpClient.post(url, {filename: this.fileName.split(".")[0], extension: fileType,img: base64Image}).subscribe( 
        res => {
          console.log(res);
        },
        err => {
          console.log(err);
        }
      );
  }



}
