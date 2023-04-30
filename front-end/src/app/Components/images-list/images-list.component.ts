import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImagesListService } from '../../Services/images-list.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css']
})
export class ImagesListComponent implements OnInit, OnDestroy {

  imagesList: any[] = [];
  isLoading: boolean = false;
  nbImages: number = 0;
  //totalImages: number = 0;
  startIndex: number = 0;
  limit: number = 10;

  private subscription: Subscription = new Subscription(); // pour gérer le cycle de vie du composant

  constructor(
    public imagesListService: ImagesListService,
    private router: Router,
  ) { }

  ngOnDestroy(): void {
    // désabonnement à la fin du cycle de vie du composant
    this.subscription.unsubscribe();
  }


  ngOnInit(): void {
    //this.getImages();
    this.loadImages();
  }


  onDeleteImage(imageId: string): void {
    this.imagesListService.deleteImage(imageId).subscribe(() => {
      this.getImages();
    });
  }

  getImages(): void {
    this.isLoading = true;
    this.imagesListService.getImagesList().subscribe(data => {
      this.imagesList = data.images;
      this.nbImages = data.images.length;
      this.isLoading = false;
    });
  }

  onScroll(event: any) {
    //const scrollPosition = window.pageYOffset; // position de défilement actuelle
    //const windowSize = window.innerHeight; // hauteur de la fenêtre du navigateur
    //const bodyHeight = document.body.offsetHeight; // hauteur totale du corps de la page

    // si la position de défilement + la hauteur de la fenêtre du navigateur est supérieure à la hauteur totale du corps de la page
    // cela signifie que l'utilisateur a atteint le bas de la page et il faut charger plus d'images
    // if (scrollPosition + windowSize >= bodyHeight && !this.isLoading && this.imagesList.length <= this.nbImages) {
    //   this.startIndex += this.limit; // on met à jour l'index de départ
    //   this.loadImages(); // on charge les images suivantes
    // }

    const tableViewHeight = event.target.offsetHeight; // Hauteur de la table visible
    const tableScrollHeight = event.target.scrollHeight; // Hauteur totale de la table
    const scrollLocation = event.target.scrollTop; // Position de l'utilisateur dans la table

    // Si l'utilisateur est proche de la fin de la table et qu'il n'y a pas de chargement en cours
    if (tableViewHeight + scrollLocation >= tableScrollHeight && !this.isLoading) {
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
    const images$ = this.imagesListService.getImagesListWithPagination(this.startIndex, this.limit);

    this.subscription.add(images$.subscribe(data => {
      const images = data.images;
      if (images.length === 0) {
        this.isLoading = false;
        return;
      }
      // ajout des images à la liste éxistante
      this.imagesList = [...this.imagesList, ...images];

      // update nb images
      this.nbImages = this.imagesList.length;
      console.log("total  nb images ", this.nbImages);
      // fin de chargement
      this.isLoading = false;

    }, error => {
      console.log(error);
      this.isLoading = false;
    }))
  }


}
