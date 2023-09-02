import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload!: ElementRef;
  @ViewChild('uploadModal') uploadModal: any;

  DJANGO_SERVER: string = 'https://projet-pro-final-azure-back.vercel.app';
  imageSrc: string = '';
  fileName: any;
  fileType: any;
  base64Image: any;
  loaded: boolean = false;
  loading: boolean = false;
  alertMessage: string = '';
  inputValue: string = '';
  closeModal: any;
  uploadedImages: any[] = [];

  constructor(private httpClient: HttpClient, private modalService: NgbModal) {}

  ngOnInit(): void {}

  handleInputChange(e: any) {

    this.uploadedImages = [];
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match(/image-*/)) {
        alert('Invalid format for file: ' + file.name);
        continue;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        this.uploadedImages.push(result); // Ajoute l'image chargée au tableau
      };
      reader.readAsDataURL(file);
    }
    // Réinitialisez le champ de fichier pour permettre de sélectionner à nouveau des images
    this.fileUpload.nativeElement.value = '';
    console.log(this.uploadedImages)
  }

  handleSubmit(e: any) {
    const url = this.DJANGO_SERVER + '/api/create';
    this.loading = true;

    for (let i = 0; i < this.uploadedImages.length; i++) {
      const imageSrc = this.uploadedImages[i];
      const fileName = 'image_' + Date.now() + '_' + i + '.png';
      const extension = imageSrc.split(';')[0].split('/')[1];

      // Supprimez le préfixe "data:image/png;base64,"
      const base64Image = imageSrc.split(',')[1];

      this.httpClient
        .post(url, {
          filename: fileName,
          extension: extension,
          img: base64Image,
        })
        .subscribe(
          (res) => {
            console.log(res);
          },
          (err) => {
            console.error(err);
          }
        );
    }

    // Réinitialisez l'état après le téléchargement
    this.loaded = true;
    this.loading = false;
    this.uploadedImages = []; // Effacez le tableau des images téléchargées
    this.alertMessage = "Les images ont été chargées avec succès !";
    this.inputValue = '';
  }
  openUploadModal() {
    this.modalService.open(this.uploadModal, { centered: true });
  }
}
