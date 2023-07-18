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

  constructor(
    private route: ActivatedRoute,
    private imagesListService: ImagesListService,
    ) { }

  ngOnInit(): void {
    this.getImageInfo();
  }

  imageInfo: any = {};

  getImageInfo(): void {
    const id = this.route.snapshot.paramMap.get('imageId');
    this.imagesListService.getImageInfo(id!).subscribe((response: any) => {
      this.imageInfo = response;
    });
  }

}
