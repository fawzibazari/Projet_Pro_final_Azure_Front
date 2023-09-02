import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesListService {

  DJANGO_SERVER_URL = "https://projet-pro-final-azure-back.vercel.app/api";

  constructor(
    private http: HttpClient,
  ) { }

  // get image info
  getImageInfo(imageId: string): Observable<any> {
    return this.http.get(`${this.DJANGO_SERVER_URL}/actions/${imageId}`);
  }

  getImagesList(): Observable<any> {
    return this.http.get(`${this.DJANGO_SERVER_URL}/list`);
  }

  getImagesStats(): Observable<any> {
    return this.http.get(`${this.DJANGO_SERVER_URL}/stats`);
  }

  deleteImage(imageId: string): Observable<any> {
    // delete by id
    return this.http.delete(`${this.DJANGO_SERVER_URL}/actions/${imageId}`);
  }

  deleteMultipleImages(imagesIds: string[]): Observable<any> {
    // delete by id
    return this.http.delete(`${this.DJANGO_SERVER_URL}/delete-multi`, {body: {images_id: imagesIds}}); // images_id = {images_id: [id1, id2, id3]}
  }

  getImagesListWithPagination(number: number, limit: number): Observable<any> {
    return this.http.get(`${this.DJANGO_SERVER_URL}/list/${number}/${limit}`);
  }

  updateImageName(id: string, fileName: string, oldFile: string, extension: string, img: string): Observable<any> {
    return this.http.put(`${this.DJANGO_SERVER_URL}/actions/${id}`, { filename: fileName, oldFile: oldFile, extension: extension, img: img });
  }

  // search similar images
  searchImages(phrase: string): Observable<any> {
    const searchData = { phrase: phrase };
    return this.http.post(`${this.DJANGO_SERVER_URL}/search`, searchData);
  }

}
