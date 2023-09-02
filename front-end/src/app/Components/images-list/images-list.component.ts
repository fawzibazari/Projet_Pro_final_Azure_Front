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
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

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
  @ViewChild('DeleteSelectedImageModal') DeleteSelectedImageModal: any;

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
  isAscending: boolean = true;
  sortByProperty: string = 'date';
  deletingInProgress = false;

  searchPhrase: string = '';
  imagesSimilarity: any[] = [];
  imagesProperty: string = 'all';

  EditImageNameForm = new FormGroup({
    imageName: new FormControl('', Validators.required),
  });

  private subscription: Subscription = new Subscription(); // pour gérer le cycle de vie du composant

  constructor(
    public imagesListService: ImagesListService,
    private router: Router,
    private modalService: NgbModal,
    public voiceRecognitionService: VoiceRecognitionService,
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
    this.deletingInProgress = true;

    this.imagesListService.deleteMultipleImages(this.selectedImages).subscribe(() => {
      console.log('deleted images', this.selectedImages);
      this.getImages();
      this.selectedImages = [];
      this.deletingInProgress = false;
      this.modalService.dismissAll();
    },
      (error) => {
        console.error('Une errur s\'est produite lors de la suppression des images sélectionnées', error);
        this.deletingInProgress = false;
      }
    );
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

  openDeleteSelectedImageModal() {
    this.modalService.open(this.DeleteSelectedImageModal, { centered: true });
  }

  // text search
  onSearch(): void {
    if (this.searchPhrase.trim() === '' || this.searchPhrase === null) {
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
          iframeWin.postMessage('hello', 'https://audio-visualizer-weld.vercel.app');
          window.addEventListener('message', (ev: any) => {
            if (ev.origin == 'https://audio-visualizer-weld.vercel.app') {
              console.log(ev.data.message);
              this.searchPhrase = ev.data.message;
              this.onSearch();
              this.voiceRecognitionService.text = '';
            }
          });
        }
      } else {
        if (iframeWin) {
          iframeWin.postMessage('done', 'https://audio-visualizer-weld.vercel.app');
          this.isListening = false;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  onSelectAllImages(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    // Si la case à cocher "Tout sélectionner" est cochée, sélectionnez toutes les images
    if (checkbox.checked) {
      this.selectedImages = this.imagesList.map(image => image._id.$oid);
    } else {
      // Sinon, désélectionnez toutes les images
      this.selectedImages = [];
    }
  }

  toggleSortOrder(event: any): void {
    this.isAscending = !this.isAscending;
    console.log('isAscending', this.isAscending);
    this.sortData();
  }
  onSortBy(event: any): void {
    this.sortByProperty = event.target.value;
    this.sortData();
  }

  sortData(): void {
    switch (this.sortByProperty) {
      case 'date':
        this.imagesList.sort((a, b) => {
          const dateA = new Date(a.datetime).getTime(); // convertir la date en timestamp
          const dateB = new Date(b.datetime).getTime();
          return dateA - dateB;
        });
        break;
      case 'confidence':
        this.imagesList.sort((a, b) => {
          const confidenceA = a.description.captions[0].confidence;
          const confidenceB = b.description.captions[0].confidence;
          return confidenceA - confidenceB;
        });
        break;
      case 'description':
        this.imagesList.sort((a, b) => {
          const descriptionA = a.description.captions[0].text.toUpperCase();
          const descriptionB = b.description.captions[0].text.toUpperCase();
          if (descriptionA < descriptionB) {
            return -1;
          }
          if (descriptionA > descriptionB) {
            return 1;
          }
          return 0;
        });
        break;
    }
    // Inverser l'ordre de tri si nécessaire
    if (!this.isAscending) {
      this.imagesList.reverse();
    }
  }
}
