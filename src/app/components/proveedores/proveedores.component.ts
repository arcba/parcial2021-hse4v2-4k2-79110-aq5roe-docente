import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Proveedores } from '../../models/proveedores';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  Titulo = 'Proveedores';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de Proveedores (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Proveedores: Proveedores[] = null;
  RegistrosTotal: number;
  Pagina = 1; // inicia pagina 1
  submitted: boolean = false;
  FormReg: FormGroup;

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;
  SinBusquedasRealizadas = true;
 // ProveedoresService: any;

  constructor(
    public formBuilder: FormBuilder,
    private ProveedoresService: ProveedoresService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.Buscar();
    this.Resetear();
  }

  Resetear() {
    this.FormReg = this.formBuilder.group({
      PoveedorID: [0],
      ProveedorRazonSocial: [
        '',
        [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)]
      ],
      ProveedorFecha: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProveedorCodigo: [
        '',
        [Validators.required, Validators.pattern('[0-9]{1,7}')]
      ]
    });
  }
  Agregar() {
    this.AccionABMC = 'A';
    this.Resetear();
    this.FormReg.reset(this.FormReg.value);
    this.submitted = false;
    this.FormReg.markAsUntouched();
  }
  Modificar(e) {
    this.submitted = false;
    this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
    // this.BuscarPorId(e, "M");
  }

  Volver() {
    this.AccionABMC = 'L';
  }
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormReg.invalid) {
      return;
    }
    const itemCopy = { ...this.FormReg.value };
    var arrFecha = itemCopy.ProveedorFecha.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.ProveedorFecha= new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();
    // agregar post
    if (itemCopy.PoveedorID == 0 || itemCopy.PoveedorID == null) {
      this.ProveedoresService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    } else {
      // modificar put
      this.ProveedoresService.put(itemCopy.PoveedorID, itemCopy).subscribe(
        (res: any) => {
          this.Volver();
          this.modalDialogService.Alert('Registro modificado correctamente.');
          this.Buscar();
        }
      );
    }
  }
  Buscar() {
    this.SinBusquedasRealizadas = false;
    this.ProveedoresService.get().subscribe((res: Proveedores[]) => {
      this.Proveedores = res;
    });
  }
  Eliminar(e) {
    this.modalDialogService.Confirm(
      'Esta seguro de eliminar esta empresa?',
      undefined,
      undefined,
      undefined,
      () =>
        this.ProveedoresService.delete(e.PoveedorID).subscribe((res: any) =>
          this.Buscar()
        ),
      null
    );
  }
  Consultar() {}
}
