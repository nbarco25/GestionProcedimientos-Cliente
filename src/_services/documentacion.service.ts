import { Injectable, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpService } from '../_services/http.service';
import { DocumentoRequerido, editarDocumentos, previsualizarDocumentos } from '../_models/documento.model';
import { Observable } from 'rxjs';


@Injectable()
export class DocumentoService extends HttpService{
    constructor(protected http: HttpClient) { 
    super(http);
  }

  getDocumentoRequerido(idAgendaProcedimiento: number): Observable<DocumentoRequerido[]>{
    return this.http.get<DocumentoRequerido[]>(`${this.apiURL}listDocAdjunto/${idAgendaProcedimiento}`);
      /*return this.http.get<DocumentoRequerido[]>(`${this.apiURL}getDocumentosProc/${idProcedimiento}/${idModalidad}`);*/
  } 
  
  getDocumentosProcedimiento(idProcedimiento: number, idModalidad: number): Observable<DocumentoRequerido[]>{
    return this.http.get<DocumentoRequerido[]>(`${this.apiURL}getDocumentosProc/${idProcedimiento}/${idModalidad}`);
  }

  editarDocumentoServicio(documentoEditado: editarDocumentos): Observable<editarDocumentos>{
    return this.http.put<editarDocumentos>(`${this.apiURL}editDocumentoAdjunto`, documentoEditado);

  }

  getAllDocumentos(): Observable<DocumentoRequerido[]>{
    return this.http.get<DocumentoRequerido[]>(`${this.apiURL}getAllDocumentos`);

  }
 
  addDocumento(documentoEditado: editarDocumentos): Observable<editarDocumentos> { 
    return this.http.post<editarDocumentos>(`${this.apiURL}addDocumentoAdjunto`, documentoEditado);
  }

  deleteDocumento(documentoElimId: number): Observable<any> {
    const url=this.apiURL+"deleteDocumentoAdjunto/"+documentoElimId.toString();
    return this.http.delete(`${url}`);
  }

  generarAcuseRecibido(idAgendaProcedimiento: number): Observable<Blob>{
    const url=this.apiURL+"generateRecibido/"+idAgendaProcedimiento.toString();

    const options = {
      responseType: 'blob' as 'json',
      headers:new HttpHeaders({
        'Authorization':  `Token ${localStorage.getItem('token')}`,
      })
    };

    return this.http.get<any>((`${url}`),options);
  }
}
