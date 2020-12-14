import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class EstadoAgendaService extends HttpService{

  constructor(protected http: HttpClient) {
    super(http);
    this.apiURL += 'getEstadosAgendaProc';
   }

   /**
    * Obtiene una lista de estados de cama
    */
   get(){
    return this.http.get(
     `${this.apiURL}`,{
      headers:new HttpHeaders({
        'Authorization':  `Token ${localStorage.getItem('token')}`,
      })
      });
  }
}
