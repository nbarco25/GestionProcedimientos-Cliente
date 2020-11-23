import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../http.service';


@Injectable({
  providedIn: 'root'
})
export class AgendaListarService extends HttpService{

  constructor(protected http: HttpClient) { 
    super(http);
    this.apiURL += 'listAgendaProcedimiento';
  }

  /**
   * Lista los procedimientos agendados
   */
  list(){
    return this.http.get<any>(`${this.apiURL}`,
    {
      headers: this.headers
    })
  }

}
