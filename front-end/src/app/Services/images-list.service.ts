import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagesListService {

  DJANGO_SERVER_URL = "https://azuroo-api.azurewebsites.net/api";

  constructor(
    private http: HttpClient,
  ) { }

  getImagesList(): Observable<any> {
    return this.http.get(`${this.DJANGO_SERVER_URL}/list`);
  }

  deleteImage(imageId: string): Observable<any> {
    // delete by id
    return this.http.delete(`${this.DJANGO_SERVER_URL}/actions/${imageId}`);
  }

  getImagesListWithPagination(number: number, limit: number): Observable<any> {
    return this.http.get(`${this.DJANGO_SERVER_URL}/list/${number}/${limit}`);
  }

  updateImageName(id: string, fileName: string, oldFile: string, extension: string, img: string): Observable<any> {
    return this.http.put(`${this.DJANGO_SERVER_URL}/actions/${id}`, {filename: fileName, oldFile: oldFile, extension: extension, img: img});
  }

}
