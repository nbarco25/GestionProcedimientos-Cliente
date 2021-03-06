import { Component, OnInit, ViewChild } from '@angular/core';
import swal from 'sweetalert2';


import { ProcedimientoComponent } from '../procedimiento/procedimiento.component';
import { PacienteComponent } from 'src/app/components/paciente/paciente.component';
import { AcudienteComponent } from 'src/app/components/acudiente/acudiente.component';
import { HoraFechaComponent } from 'src/app/components/hora-fecha/hora-fecha.component';
import { AgendaCrear } from 'src/_models/models_Agenda/agenda-crear.model';
import { AgendaCrearService } from 'src/_services/serviciosAgenda/agenda-crear.service';
import {AuxiliarDocumentacionComponent} from '../../components/auxiliar-documentacion/auxiliar-documentacion.component';
import {AuxiliarMaterialesComponent} from '../../components/auxiliar-materiales/auxiliar-materiales.component' 

import { AuxiliarInstrumentosEquiposComponent } from '../auxiliar-Equipos/auxiliar-instrumentos-equipos/auxiliar-instrumentos-equipos.component';
import { UtilityServiceService } from 'src/_services/utility-service.service';
import { AuxiliarEspecialistaComponent } from '../auxiliar-especialidad/auxiliar-especialista/auxiliar-especialista.component';
import { EditarComponentesService } from 'src/_services/serviciosComponentes/editar-componentes.service';
import { NumeroNotificacionesService } from 'src/_services/numero-notificaciones.service';
import { Paciente } from 'src/_models/paciente.model';
import { Acudiente } from 'src/_models/acudiente.model';
import { Procedimiento } from 'src/_models/procedimiento.model';
import { Agendamiento } from 'src/_models/agendamiento.models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-auxiliar-crear-programacion',
  templateUrl: './auxiliar-programacion.component.html',
  styleUrls: ['./auxiliar-programacion.component.css']
})
export class AuxiliarCrearProgramacionComponent implements OnInit {
  
  @ViewChild(AuxiliarInstrumentosEquiposComponent) listarInstrumentos: AuxiliarInstrumentosEquiposComponent;
  @ViewChild(AuxiliarEspecialistaComponent) listarEspecialidad: AuxiliarEspecialistaComponent;
  @ViewChild(AuxiliarDocumentacionComponent) listarDocumentos: AuxiliarDocumentacionComponent; 
  @ViewChild(AuxiliarMaterialesComponent) listarMateriales: AuxiliarMaterialesComponent;
  @ViewChild(ProcedimientoComponent) procedimientoCmp: ProcedimientoComponent;
  @ViewChild(PacienteComponent) pacienteCmp: PacienteComponent;
  @ViewChild(AcudienteComponent) acudienteCmp: AcudienteComponent;
  @ViewChild(HoraFechaComponent) horaFechaCmp: HoraFechaComponent;

  /**Variables de reinicio de los componentes */
  public RcodigoProcedimiento:string='';
  public RidPacienteAgendado:string='';
  public RidAcudienteAgendado:string='';
  public RidAgendaProcedimiento:string='';
  public Robservacion:string='';
  //** */

  public agendaNueva : AgendaCrear;

  public idProcedimientoInstrumento: string;  //variable para obtener el id del procedimiento
  public edadPaciente:number;
  public activoAcudiente:boolean; 
  public message:boolean;
  public codigoProcedimiento:string='';
  public idProcedimiento: string;
  public idAgendaProcedimiento: number;

  public iniciarComp:boolean=true;
  public banderaRequerido: Boolean;
  public banderaBotonAnadir: Boolean;

  bandera: number;

  constructor(
    private agendaCrearService:AgendaCrearService, 
    private utilityService: UtilityServiceService,
    private editarComponentesService:EditarComponentesService,
    private numNotificacion: NumeroNotificacionesService,
    private router: Router,
    private dialogo: MatDialog
  ) {
  }

  receiveMessage($event) {
    this.message = $event
    //($event);
  } 

  ngOnInit(): void {
    this.editarComponentesService.cambiarEsCrear(true);
    this.actualizarIds();
    this.utilityService.customIdProcedimiento.subscribe(msg => this.idProcedimiento=msg);
    this.utilityService.customIdAgendaProcedimiento.subscribe(msg => this.idAgendaProcedimiento=msg);
    this.numNotificacion.customBandera.subscribe(msg=>this.bandera=msg);
    this.utilityService.customBanderaRequerido.subscribe(msg => this.banderaRequerido = msg);
    this.utilityService.customBanderaBotonAnadir.subscribe(msg=>this.banderaBotonAnadir=msg);
    this.utilityService.changeBanderaBotonAnadir(true);
    this.utilityService.changeBanderaRequerido(true);
  } 

  listarInstrumentosDesdeProgramacion(){
    this.listarInstrumentos.listarIntrumentEquip();
    this.listarEspecialidad.listarEspecialidades();
  }

  listarDocumentosDesdeProgramacion(){
    //this.listarDocumentos.listarDocumentosRequeridos();
    //this.listarDocumentos.listarDocumentosPorCodigoModalidad();
    this.listarDocumentos.listarDocumentos();
  }

  listarMaterialesDesdeProgramacion(){
    //this.listarMateriales.listarMaterialesPorCodigoModalidad();
    this.listarMateriales.listarMateriales();
  }

  crearAgendaonClick(){
    /**Actualiza el codigo de procedimiento de las tablas */
    this.codigoProcedimiento=this.procedimientoCmp.getCodigoProcedimiento();
    this.utilityService.changeIdProcedimiento(this.codigoProcedimiento);
    /**Captura de campos */
    let paciente = this.pacienteCmp.getObjPaciente();
    let observacion = this.pacienteCmp.getObservacion();
    let acudiente = this.acudienteCmp.getObjAcudiente();
    let procedimiento = this.procedimientoCmp.getObjProcedimiento();
    let estadoCama = this.procedimientoCmp.getestadoCama();
    let agendamiento = this.horaFechaCmp.getAgendamiento();
  
    if (this.validarCampos(paciente,acudiente,procedimiento,agendamiento)){
      /**Creacion del modelo */
      let agenda:AgendaCrear = AgendaCrear.fromOBJECTS(paciente,acudiente,procedimiento,agendamiento,observacion,estadoCama,'1');

      this.crearAgenda(agenda);
      this.listarInstrumentosDesdeProgramacion();
      this.listarDocumentosDesdeProgramacion();
      this.listarMaterialesDesdeProgramacion(); 
    }
  }
  /** Validacion de campos*/
  public validarCampos(paciente:Paciente,acudiente:Acudiente,procedimiento:Procedimiento,agendamiento:Agendamiento){
    if (paciente==null || paciente.identificacion==null) {
      swal.fire('¡Error!', '¡Verifica los datos del paciente!', 'error');
      return false;
    }
    if (acudiente == null || acudiente.identificacion==null) {
      swal.fire('¡Error!', '¡Verifica los datos del acudiente!', 'error');
      return false;
    }
    if (procedimiento == null || procedimiento.codigoProcedimiento==null) {
      swal.fire('¡Error!', '¡Verifica los datos del procedimiento!', 'error');
      return false;
    }
    if (agendamiento.fecha==null || agendamiento.hora==null) {
      swal.fire('¡Error!', '¡Verifica los datos del agendamiento!', 'error');
      return false;
    }
    return true;
  }

  /**Peticiones */
  public async crearAgenda(agenda:AgendaCrear){
    let res:any = await this.agendaCrearService.create(agenda).toPromise();
    this.idAgendaProcedimiento=res.idAgendaProcedimiento;
    this.utilityService.changeIdAgendaProcedimiento(this.idAgendaProcedimiento);
    console.log("idAgenda: "+this.idAgendaProcedimiento);
    this.listarInstrumentosDesdeProgramacion();
    this.listarDocumentosDesdeProgramacion();
    this.listarMaterialesDesdeProgramacion();

    if(res!=null){
      this.codigoProcedimiento=this.procedimientoCmp.getCodigoProcedimiento();
      //console.log("desde crear agenda, código que se recibe: "+JSON.stringify(res.idAgendaProcedimiento));
      this.idAgendaProcedimiento=res.idAgendaProcedimiento;
      //console.log("desde crear agenda, código que se recibe: "+this.idAgendaProcedimiento);
      this.utilityService.changeIdAgendaProcedimiento(this.idAgendaProcedimiento);
      this.utilityService.changeBanderaRequerido(false);
      this.utilityService.changeBanderaBotonAnadir(false);
      this.numNotificacion.changeBandera(this.bandera);
      this.listarInstrumentosDesdeProgramacion();
      this.listarDocumentosDesdeProgramacion();

    }
  }

  /**Envios */
  public actualizarIds(){
    this.editarComponentesService.cambiarIdPac(this.RidPacienteAgendado);
    this.editarComponentesService.cambiarIdAcu(this.RidAcudienteAgendado);
    this.editarComponentesService.cambiarIdProc(this.RcodigoProcedimiento);
    this.editarComponentesService.cambiaridAgendaProc(this.RidAgendaProcedimiento);
    this.editarComponentesService.cambiarObservacion(this.Robservacion);
  }

  public gestionProcedimientoOnclick() {
    this.dialogo
      .open(ConfirmationDialogComponent, {
        data: `¿Desea salir de la ventana creación de procedimiento?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          console.log("entre");
          this.router.navigateByUrl('/programacion');
        }
      });
  }
}
