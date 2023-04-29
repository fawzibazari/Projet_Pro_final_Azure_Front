import { Component, OnInit } from '@angular/core';
import { ImagesListService } from '../../Services/images-list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-images-list',
  templateUrl: './images-list.component.html',
  styleUrls: ['./images-list.component.css']
})
export class ImagesListComponent implements OnInit {

  imagesList: any[] = [];
  isLoading: boolean = false;

  constructor(
    public imagesListService: ImagesListService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.getImages();
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
      this.isLoading = false;
    });
  }

      

}
