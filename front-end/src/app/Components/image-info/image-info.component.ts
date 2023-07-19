import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImagesListService } from '../../Services/images-list.service';
@Component({
  selector: 'app-image-info',
  templateUrl: './image-info.component.html',
  styleUrls: ['./image-info.component.css']
})
export class ImageInfoComponent implements OnInit {
  isCollapsed = true;
  searchSimilarity: string = '';
  imagesList: any[] = [];
  imagesListSimilarity: any[] = [];
  description: string = '';
  confidence: string = '';
  imageUrl: string = '';
  tags: string[] = [];
  categories: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private imagesListService: ImagesListService,
  ) { }

  ngOnInit(): void {
    this.getImageInfo();
  }

  getImageInfo(): void {
    const id = this.route.snapshot.paramMap.get('imageId');
    this.imagesListService.getImageInfo(id!).subscribe((response: any) => {
      this.description = response.image.description.captions[0].text;
      this.imageUrl = response.image.url;
      this.confidence = response.image.description.captions[0].confidence;
      this.tags = response.image.description.tags;
      this.categories = response.image.categories;

      // search similarity
      this.searchSimilarity = this.description;
        this.imagesListService
          .searchImages(this.searchSimilarity)
          .subscribe((data) => {
            this.imagesListSimilarity = data.similarity.filter((image: any) => image._id !== id);
          });
    });
  }

  getImages(): void {
    this.imagesListService.getImagesList().subscribe((data) => {
      this.imagesList = data.images;
    });
  }

}
