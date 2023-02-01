import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../firestore.service';
import { Pelicula } from '../pelicula';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  id: string = "";
  nueva: boolean;

  document: any = {
    id: "",
    data: {} as Pelicula
  };

  roleMessage: boolean;
  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService,
     private router: Router, private alertController: AlertController, private loadingController: LoadingController,
     private toastController: ToastController, private imagePicker: ImagePicker) { }

  ngOnInit() {

    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id == "nueva") {
      this.nueva = true;
      this.document.data = {} as Pelicula;

    } else {
      this.nueva = false;
      this.firestoreService.consultarPorId("peliculas", this.id).subscribe((resultado) => {
        // Preguntar si se hay encontrado un document con ese ID
        if (resultado.payload.data() != null) {
          this.document.id = resultado.payload.id
          this.document.data = resultado.payload.data();
          // Como ejemplo, mostrar el título de la tarea en consola
          console.log(this.document.data.Titulo);
        } else {
          // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
          this.document.data = {} as Pelicula;
        }
      });
    }

  }

  clickBotonInsertar() {
    this.firestoreService.insertar("peliculas", this.document.data).then(
      () => {
        console.log("Pelicula creada correctamente");
        //Limpiamos el contenido de la pelicula que se estaba editando
        this.document.data = {} as Pelicula
      }, (error) => {
        console.log(error);
      }
    );
    this.router.navigate(['/home']);
  }

  clickBotonVolver() {
    this.router.navigate(['/home']);
  }
  clickBotonBorrar() {

    this.firestoreService.borrar("peliculas", this.id).then(() => {
      this.clickBotonVolver();
    })
  }

  clickBotonModificar() {
    this.firestoreService.actualizar("peliculas", this.id, this.document.data).then(() => {
      this.clickBotonVolver();
    })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Borrar esta pelicula?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Sí',
          role: 'confirm',
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();

    if(role=="confirm") {
      this.clickBotonBorrar();
    }
    
  }

  async uploadImagePicker() {
    const loading = await this.loadingController.create({
      message: 'Espere un momento...',
    });

    const toast = await this.toastController.create({
      message: 'Imagen actualizada con éxito',
      duration: 3000,
      
    });

    this.imagePicker.hasReadPermission().then(
      (result) => {
        if (result == false) {
          this.imagePicker.requestReadPermission();
        } else {
          this.imagePicker
            .getPictures({
              maximumImagesCount: 1,
              outputType: 1,
            })
            .then(
              (results) => {
                let nombreCarpeta = 'imagenes';

                for (let i = 0; i < results.length; i++) {
                  loading.present();

                  let nombreImagen = `${new Date().getTime()}`;

                  this.firestoreService
                    .subirImagen(nombreCarpeta, nombreImagen, results[i])

                    .then((snapshot) => {
                      snapshot.ref.getDownloadURL().then((downloadURL) => {
                        console.log('downloadURL:' + downloadURL);
                        this.document.data.Imagen = downloadURL;
                        toast.present();
                        loading.dismiss();
                      });
                    });
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  async deleteFile(fileURL){

    const toast = await this.toastController.create({
      message:"Archivo borrado con éxtio",
      duration: 3000
    });

    this.firestoreService.eliminarImagen(fileURL)
      .then(() => {

        toast.present();
      }, (err) => {
        console.log(err)

      });
  }

}