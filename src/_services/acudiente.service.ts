import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from './http.service';

@Injectable()

export class AcudienteService extends HttpService{

  constructor(protected http: HttpClient) {
    super(http);
    this.apiURL += 'getPersonaIdentificacion';
   }

   /**
    * Obtiene una persona
    * @param id identificador de la persona
    */
   get(id: string){
    return this.http.get(
      `${this.apiURL}/${id}`,{
        headers:new HttpHeaders({
          'Authorization':  `Token ${localStorage.getItem('token')}`,
        })
        });
  }
}
