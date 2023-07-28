import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ImagesListService } from '../../Services/images-list.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { VoiceRecognitionService } from '../../Services/voice-recognition.service';

declare var window: any;

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css'],
  providers: [VoiceRecognitionService],
})
export class ImagesListComponent implements OnInit, OnDestroy {
  @ViewChild('EditNameModal') EditNameModal: any;
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;
  @ViewChild('speechButton') speechButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('iframe') iframe!: ElementRef;

  imagesList: any[] = [];
  isLoading: boolean = false;
  nbImages: number = 0;
  startIndex: number = 0;
  limit: number = 10;
  isList: boolean = false;
  isGrid: boolean = true;
  isChecked: boolean = true;
  isListening: boolean = false;
  selectedImages: string[] = [];

  searchPhrase: string = '';

  EditImageNameForm = new FormGroup({
    imageName: new FormControl('', Validators.required),
  });

  private subscription: Subscription = new Subscription(); // pour gérer le cycle de vie du composant

  constructor(
    public imagesListService: ImagesListService,
    private router: Router,
    private modalService: NgbModal,
    public voiceRecognitionService: VoiceRecognitionService
  ) {
    this.voiceRecognitionService.init();
  }

  ngOnDestroy(): void {
    // désabonnement à la fin du cycle de vie du composant
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadImages();
  }

  onDeleteImage(imageId: string): void {
    this.imagesListService.deleteImage(imageId).subscribe(() => {
      this.getImages();
    });
  }

  onDeleteSelectedImages(): void {
    console.log('selected images', this.selectedImages);
    this.selectedImages.forEach((imageId) => {
      this.imagesListService.deleteImage(imageId).subscribe(() => {
        console.log('deleted image id', imageId);
        this.getImages();
      });
    });
  }

  onCheckboxChange(event: any, value: string): void {
    if (event.target.checked) {
      // La case à cocher est cochée, ajoutez la valeur à votre liste selectedImages
      this.selectedImages.push(value);
    } else {
      // La case à cocher est décochée, retirez la valeur de votre liste selectedImages
      const index = this.selectedImages.indexOf(value);
      if (index > -1) {
        this.selectedImages.splice(index, 1);
      }
    }
  }

  getImages(): void {
    this.isLoading = true;
    this.imagesListService.getImagesList().subscribe((data) => {
      this.imagesList = data.images;
      this.nbImages = data.images.length;
      this.isLoading = false;
    });
  }

  onScroll(event: any) {
    const tableViewHeight = event.target.offsetHeight; // Hauteur de la table visible
    const tableScrollHeight = event.target.scrollHeight; // Hauteur totale de la table
    const scrollLocation = event.target.scrollTop; // Position de l'utilisateur dans la table

    // Si l'utilisateur est proche de la fin de la table et qu'il n'y a pas de chargement en cours
    if (
      tableViewHeight + scrollLocation >= tableScrollHeight &&
      !this.isLoading
    ) {
      // Augmentez le numéro de page pour charger la page suivante
      this.startIndex++;
      // Chargez les images suivantes
      this.loadImages();
    }
  }

  loadImages(): void {
    this.startIndex = this.imagesList.length;
    this.isLoading = true;
    //  appel pour récupérer les images de la page courante
    const images$ = this.imagesListService.getImagesListWithPagination(
      this.startIndex,
      this.limit
    );

    this.subscription.add(
      images$.subscribe(
        (data) => {
          const images = data.images;
          if (images.length === 0) {
            this.isLoading = false;
            return;
          }
          // ajout des images à la liste éxistante
          this.imagesList = [...this.imagesList, ...images];

          // update nb images
          this.nbImages = this.imagesList.length;
          // fin de chargement
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      )
    );
  }

  // Edit image name
  openEditImageModal() {
    this.modalService.open(this.EditNameModal, { centered: true });
  }

  // text search
  onSearch(): void {
    if (this.searchPhrase.trim() === '') {
      this.getImages();
      console.log('empty search');
    } else {
      this.isLoading = true;
      this.imagesListService
        .searchImages(this.searchPhrase)
        .subscribe((data) => {
          console.log('data', data);
          this.imagesList = data.similarity;
          this.nbImages = data.similarity.length;
          this.isLoading = false;
        });
      console.log('search', this.searchPhrase);
    }
  }

  // voice search
  toggleVoiceRecognition(): void {
    const iframe = document.getElementById('da-iframe') as HTMLIFrameElement;
    const iframeWin = iframe.contentWindow;

    try {
      if (this.isListening === false) {
        this.isListening = true;

        if (iframeWin) {
          iframeWin.postMessage('hello', 'http://127.0.0.1:5500');
          window.addEventListener('message', (ev: any) => {
            if (ev.origin == 'http://127.0.0.1:5500') {
              console.log(ev.data.message);
              this.searchPhrase = ev.data.message;
              this.onSearch();
              this.voiceRecognitionService.text = '';
            }
          });
        }
      } else {
        if (iframeWin) {
          iframeWin.postMessage('done', 'http://127.0.0.1:5500');
          this.isListening = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
