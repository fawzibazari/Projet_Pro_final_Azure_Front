import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild("fileUpload", {static: false}) fileUpload!: ElementRef;

  DJANGO_SERVER: string = "https://azuroo-api.azurewebsites.net";
  imageSrc: string = "";
  fileName: any;
  fileType: any;
  base64Image: any;
  loaded: boolean = false;
  loading: boolean = false;
  alertMessage: string = "";


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
    this.loaded = false;
  }

  _handleReaderLoaded(e: any) {
      let reader = e.target;
      this.imageSrc = reader.result;

      this.base64Image =this.imageSrc.split(",")[1];
      this.fileType = this.imageSrc.split("/")[1].split(";")[0];
      //console.log("file type --------->"+ fileType);
      console.log(this.base64Image);
  }

  handleSubmit(e: any){
    const url = this.DJANGO_SERVER + "/api/create";
    this.loading = true;

      this.httpClient.post(url, {filename: this.fileName.split(".")[0] + Date.now(), extension: this.fileType,img: this.base64Image}).subscribe(
        res => {
          console.log(res);
          //console.log(__filename);
          this.loaded = true;
          this.loading = false;
          this.fileUpload.nativeElement.value = "";
          this.alertMessage = "L'image a été chargée avec succès !";
        },
        err => {
          console.log(err);
          this.alertMessage = "Une erreur est survenue lors du chargement de l'image !";
        }
      );
  }



}
