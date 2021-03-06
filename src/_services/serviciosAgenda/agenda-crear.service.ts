import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../http.service';

import { AgendaCrear } from 'src/_models/models_Agenda/agenda-crear.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaCrearService extends HttpService{

  constructor(protected http: HttpClient) { 
    super(http);
    this.apiURL += 'addAgendaProcedimiento';
  }

  /**
    * Crea una agenda y recibe muchos json 
    */
   create(agendaCrear: AgendaCrear){
    return this.http.post<any>(
      `${this.apiURL}`,agendaCrear.parseToJSON(),{
        headers:new HttpHeaders({
          'Authorization':  `Token ${localStorage.getItem('token')}`,
        })
        });
  }
}
