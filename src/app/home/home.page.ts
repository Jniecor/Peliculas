import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  peliculaEditando: Pelicula;
  arrayColeccionPeliculas: any = [{

    id: "",
    data: {} as Pelicula

  }];


  constructor(private firestoreService: FirestoreService) {

    this.peliculaEditando = {} as Pelicula;
    this.obtenerListaPeliculas();

  }

  clickBotonInsertar(){
    this.firestoreService.insertar("peliculas", this.peliculaEditando).then(
      () => { 
        console.log("Pelicula creada correctamente");
        //Limpiamos el contenido de la pelicula que se estaba editando
        this.peliculaEditando = {} as Pelicula
      }, (error) => {
        console.log(error);
      }
    );
  }

  obtenerListaPeliculas(){
    this.firestoreService.consultar("peliculas").subscribe((resultadoConsultaPeliculas) => {
      this.arrayColeccionPeliculas = [];
      resultadoConsultaPeliculas.forEach((datosPelicula: any) =>
      {
        this.arrayColeccionPeliculas.push({
          id: datosPelicula.payload.doc.id,
          data: datosPelicula.payload.doc.data()
        })
      })
    })
  }
}
