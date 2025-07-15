import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  // ----------- Toast Messages ------------

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  show(icon: 'success' | 'error' | 'info' | 'warning', title: string) {
    this.toast.fire({ icon, title });
  }

  success(message: string) {
    this.show('success', message);
  }

  error(message: string) {
    this.show('error', message);
  }

  info(message: string) {
    this.show('info', message);
  }

  warning(message: string) {
    this.show('warning', message);
  }


  // ----------- Error Messages ------------

  showError(statusCode: number) {

    if(statusCode === 500){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }

    if(statusCode === 400){
      Swal.fire({
        icon: "error",
        title: "Bad Request",
        text: "Please check your request and try again.",
      });
    }
  }

  // ----------- Set If Dirty ------------

  setIfDirty(form: FormGroup, key: string, target: any): void {
    const control = form.get(key);
    if (control?.dirty) {
      target[key] = control.value;
    }
  }
}
