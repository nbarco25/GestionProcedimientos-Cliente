import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';
import { editInstrumentosEquipos, InstrumentosEquipos } from 'src/_models/modelInstrumento/instrumentos-equipos.model';
import { InstrumentosEquiposService } from 'src/_services/serviciosInstrumentos/instrumentos-equipos.service';
import { UtilityServiceService } from 'src/_services/utility-service.service';
import * as notificationService from 'src/_services/notification.service';

@Component({
  selector: 'app-modulo-instrumento',
  templateUrl: './modulo-instrumento.component.html',
  styleUrls: ['./modulo-instrumento.component.css']
})
export class ModuloInstrumentoComponent implements OnInit {

  data: Array<any>;
  arrayInstrumentos: InstrumentosEquipos[];
  opcionSeleccionado: string = '0';
  verSeleccion = '';
  datosSeleccionador: InstrumentosEquipos[] = [];
  editInstrument: editInstrumentosEquipos;  //variable utilizada para editar los 
  datosAdd: InstrumentosEquipos[] = [];
  idProcedimiento: number;

  displayedColumns: string[] = ['codigo', 'nombre', 'cantidad', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<InstrumentosEquipos>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(
    private serviceIntrumentosEquipos: InstrumentosEquiposService, 
    private notificationService: notificationService.NotificationService,
    private dialogo: MatDialog, 
    private utilityService: UtilityServiceService
    ) { }

  ngOnInit(): void {
    this.getAllInstrumentos();
    this.utilityService.customInstrumentoAdd.subscribe(msg => this.datosAdd = msg);
    this.utilityService.customIdAgendaProcedimiento.subscribe(msg => this.idProcedimiento = msg);

  }

  getAllInstrumentos() {
    this.serviceIntrumentosEquipos.getAllIntrumentos().subscribe((result: InstrumentosEquipos[]) => {

      this.arrayInstrumentos = InstrumentosEquipos.fromJSON(result);
      //console.log("desde añadir instrumento: " + this.arrayInstrumentos);
      if (this.arrayInstrumentos != null) {
        for (let i = 0; i < this.arrayInstrumentos.length; i++) {
          this.arrayInstrumentos[i].cantidad = 1;
        }
        //ordena el array por nombre
        this.arrayInstrumentos.sort(function (a, b) {
          return ((a.nombre < b.nombre) ? -1 : ((a.nombre > b.nombre) ? 1 : 0));
        })
      } else {
        this.notificationService.success('No hay instrumentos y/o equipos en la base de datos');
      }
    });
  }

  capturar() {
    this.verSeleccion = this.opcionSeleccionado;
    this.agregarDatoTabla();
  }

  agregarDatoTabla() {
    for (let i = 0; i < this.arrayInstrumentos.length; i++) {
      if (this.arrayInstrumentos[i].nombre == this.verSeleccion) {
        if (!this.datosSeleccionador.includes(this.arrayInstrumentos[i])) {
          this.datosSeleccionador.push(this.arrayInstrumentos[i]);
          this.dataSource = new MatTableDataSource(this.datosSeleccionador);
          this.dataSource.paginator = this.paginator;
          break;
        }
      }
    }
  }

  confirmacionLimpiar() {
    this.dialogo
      .open(ConfirmationDialogComponent, {
        data: `¿Seguro que desea eliminar TODOS los intrumentos y/o equipos que ha agregado en la tabla?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.limpiarLista();
        }
      });
  }

  limpiarLista() {
    this.datosSeleccionador = [];
    this.dataSource = new MatTableDataSource(this.datosSeleccionador);
    this.dataSource.paginator = this.paginator;
  }

  eliminarDato(datoAEliminar: InstrumentosEquipos) {
    this.dialogo
      .open(ConfirmationDialogComponent, {
        data: `¿Seguro que desea ELIMINAR el intrumentos y/o equipos de la lista?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          for (let i = 0; i < this.datosSeleccionador.length; i++) {
            if (this.datosSeleccionador[i] == datoAEliminar) {
              this.datosSeleccionador.splice(i, 1);
              this.dataSource = new MatTableDataSource(this.datosSeleccionador);
              this.dataSource.paginator = this.paginator;
              break;
            }
          }
        }
      });
  }

  keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  /*cerrarVentana() {
    this.dialogo
      .open(ConfirmationDialogComponent, {
        data: `¿Seguro que desea SALIR de la ventana añadir intrumentos y/o equipos puesto que si sale y tiene instrumentos en la vista previa estos no se añadirán y se borrará de la tabla?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.dialogo.closeAll();
        }
      });
  }

  //método para agregar instrumentos
  addInstruments() {
    this.dialogo
      .open(ConfirmationDialogComponent, {
        data: `¿Seguro que desea añadir todos los intrumentos y/o equipos que ha agregado en la tabla?`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          for (let i = 0; i < this.datosSeleccionador.length; i++) {
            const resultado = this.datosAdd.find( intrumento => intrumento.codigoEquipo === this.datosSeleccionador[i].codigoEquipo );
            if(!resultado){  //si no esta el instrimento al agregar en la lista de la agenda, se agrega
              this.editInstrument = new editInstrumentosEquipos(this.datosSeleccionador[i].id, this.idProcedimiento, this.datosSeleccionador[i].codigoEquipo.toString(), "PEND", this.datosSeleccionador[i].cantidad);
              let res = this.serviceIntrumentosEquipos.addInstrumento(this.editInstrument).subscribe();
            }else{ //si esta el instrimento al agregar en la lista de la agenda, se edita
              this.editInstrument = new editInstrumentosEquipos(resultado.id, this.idProcedimiento, resultado.codigoEquipo.toString(), "PEND", parseInt(resultado.cantidad.toString())+1);
              let res = this.serviceIntrumentosEquipos.editarInstrumentoEquipo(this.editInstrument).subscribe();
            }
            this.utilityService.changeIntrumentoAdd(this.datosAdd);
          }
          this.utilityService.changeIntrumentoAdd(this.datosAdd);
          this.dialogo.closeAll();
        }
      });

  }*/

}

