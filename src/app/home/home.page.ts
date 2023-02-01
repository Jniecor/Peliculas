import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';
import { Router } from '@angular/router';

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
  idPeliculaSelec: string;


  constructor(private firestoreService: FirestoreService, private router: Router) {

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

  selecPelicula(peliculaSelec) {
    console.log("Pelicula seleccionada: ");
    
    if (peliculaSelec == false){
      console.log("Nueva");
      this.router.navigate(['/detalle', "nueva"]);
    } else{
      console.log(peliculaSelec);
      this.idPeliculaSelec = peliculaSelec.id;
      this.peliculaEditando.Titulo = peliculaSelec.data.Titulo;
      this.peliculaEditando.Director = peliculaSelec.data.Director;
      this.peliculaEditando.FechaDeEstreno = peliculaSelec.data.FechaDeEstreno;
      this.peliculaEditando.Genero = peliculaSelec.data.Genero;
      this.peliculaEditando.Vista = peliculaSelec.data.Vista;
      this.router.navigate(['/detalle', this.idPeliculaSelec]);
    }
    
  }


}
