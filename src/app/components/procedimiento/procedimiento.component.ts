import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Procedimiento } from 'src/_models/procedimiento.model';
import { EstadoCama } from 'src/_models/estado-cama.model';

import { ProcedimientoService } from 'src/_services/procedimiento.service';
import { EstadoCamaService } from 'src/_services/estado-cama.service';



@Component({
  selector: 'app-procedimiento',
  templateUrl: './procedimiento.component.html',
  styleUrls: ['./procedimiento.component.css']
})
export class ProcedimientoComponent implements OnInit {
  keyword = 'name';
  data:Array<any>;

  public busquedaForm:FormGroup;
  public valorBusqueda:string;
  public estadosCama:Array<EstadoCama>;

  public procedimiento:Procedimiento;
  public codigoProc: number;
  public procedimientos:Array<Procedimiento>;

  constructor(
    private formBuilder:FormBuilder,
    private procedimientoService:ProcedimientoService,
    private estadoCamaService:EstadoCamaService
  ) { 
    this.buildbusquedaForm();
  }

  ngOnInit(): void {
<<<<<<< HEAD
    this.setEstadosCama();
=======
    this.codigoProc=0;
>>>>>>> 6d98c5e4db365f767a3030dea02adeab7f688979
  }

  private buildbusquedaForm(){
    this.busquedaForm = this.formBuilder.group({
      searchType:['',[Validators.required]],
      code:['',[]],
      name:['',[]],
      uciBed:['',[]],
      bloodBank:['',[]],
      stateBed:['PEND',[]]
    });
    this.busquedaForm.get('uciBed').valueChanges
    .subscribe(value=>{
      if(this.procedimiento!=null && this.procedimiento.modalidad.length>0){
        this.procedimiento.modalidad[0].camaUCI = value;
        console.log(this.procedimiento);
      }
    });
    this.busquedaForm.get('bloodBank').valueChanges
    .subscribe(value=>{
      if(this.procedimiento!=null && this.procedimiento.modalidad.length>0){
        this.procedimiento.modalidad[0].bancoSangre = value;
        console.log(this.procedimiento);
      }
    });
  } 

  private updateBusquedaForm(){
    this.busquedaForm.get('code').setValue(this.procedimiento.codigoProcedimiento);
    this.busquedaForm.get('name').setValue(this.procedimiento.nombre);
    if(this.procedimiento.modalidad.length>0){
      this.busquedaForm.get('uciBed').setValue(this.procedimiento.modalidad[0].camaUCI);
      this.busquedaForm.get('bloodBank').setValue(this.procedimiento.modalidad[0].bancoSangre);
    }else{
      this.busquedaForm.get('uciBed').setValue(false);
      this.busquedaForm.get('bloodBank').setValue(false);
    }
  }
  selectEvent(item) {
    this.valorBusqueda = item.id;
  }
  onChangeSearch($event){
    if(this.busquedaForm.get('searchType').value=='2'){
      this.valorBusqueda = $event;
      if(this.busquedaForm.get('searchType').value=='2'){
        this.setProcedimiento();
      }
    }
    this.valorBusqueda = $event;
  }

  public buscarClick(){
    this.busquedaForm.get('searchType').setValue('1');
    this.setProcedimiento();
    if(this.procedimiento!=null){
      this.updateBusquedaForm();
    }
  }

  public getCodigoProcedimiento(): number{
    this.codigoProc= parseInt(this.procedimiento.codigoProcedimiento)
    console.log("cod: "+this.codigoProc);
    return this.codigoProc;
  }
  
  cargarNombres(){
    this.data = new Array();
    this.procedimientos.forEach(procedimiento =>{
      this.data.push({id:procedimiento.codigoProcedimiento,name:procedimiento.nombre});
    });
  }

  /**Peticiones */
  async setProcedimiento(){
    if(this.busquedaForm.get('searchType').value==='1'){
      let res:any = await this.procedimientoService.getCodigo(this.valorBusqueda).toPromise();
      this.procedimiento = Procedimiento.fromJSON(res.procedimiento);
      this.procedimientos=new Array<Procedimiento>();
    }else{
      let res:any = await this.procedimientoService.getNombre(this.valorBusqueda).toPromise();
      this.procedimientos = new Array<Procedimiento>();
      res.procedimientos.forEach(procedimiento => {
        this.procedimientos.push(procedimiento);
      });
      this.procedimiento = null;
      this.data = this.procedimientos;
      if(this.procedimientos.length > 0){
        this.cargarNombres();
      }
    }
    console.log(this.procedimiento);
    console.log(this.procedimientos);
  }

  async setEstadosCama(){
    let res:any = await this.estadoCamaService.get().toPromise();
    this.estadosCama = EstadoCama.fromJSON(res);
  }
}
