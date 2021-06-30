import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { of } from 'rxjs';
import { Proveedores } from '../models/proveedores';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  resourceUrl: string;
  constructor(private httpClient: HttpClient) {
    this.resourceUrl = 'https://pymesbackend.azurewebsites.net/api/proveedores';
    //this.resourceUrl = 'https://localhost:44349/api/articulos/';
  }

  get() {
  return this.httpClient.get(this.resourceUrl);
  }
  //getById(Id: number) {
  //return this.httpClient.get(this.resourceUrl + Id);
  //}
  post(obj:Proveedores) {
  return this.httpClient.post(this.resourceUrl, obj);
  }
  put(Id: number, obj:Proveedores) {
  return this.httpClient.put(this.resourceUrl + Id, obj);
  }
  delete(Id) {
  return this.httpClient.delete(this.resourceUrl + Id);
  }
  }
  