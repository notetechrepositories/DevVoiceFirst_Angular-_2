import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Swal, { SweetAlertResult } from 'sweetalert2';

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


  // ----------- Confirmation Messages ------------

  confirmDialog(message: string,action:string): Promise<SweetAlertResult<any>> {

    if(action === 'delete'){
      return Swal.fire({
        title: 'Are you sure?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#eb1313',
        cancelButtonColor: '#565656',
        confirmButtonText: 'Yes, delete it!'
      });
    }

    if(action === 'update'){
      return Swal.fire({
        title: 'Change Status',
        text: message,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2daf1f',
        cancelButtonColor: '#565656',
        confirmButtonText: 'Yes, update it!'
      });
    }

    if(action === 'discard'){
      return Swal.fire({
        title: 'Discard Changes',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2daf1f',
        cancelButtonColor: '#565656',
        confirmButtonText: 'Yes, discard!'
      });
    }

    return Promise.resolve({ isConfirmed: false } as SweetAlertResult<any>);

  }


  // ----------- Error Messages ------------

  showError(statusCode: number , message?:string) {

    if(statusCode === 500 || statusCode === 400){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }

    if(statusCode === 404){
      Swal.fire({
        icon: "error",
        title: "Not Found",
        text: `${message}`,
      });
    }

    if(statusCode === 409){
      Swal.fire({
        icon: "info",
        title: "Conflict",
        text: `${message}`,
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

  // ------------ Keyboard Event ------------

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  
  preventPasteNonNumeric(event: ClipboardEvent): void {
    const pastedInput: string = event.clipboardData?.getData('text') || '';
    if (!/^\d+$/.test(pastedInput)) {
      event.preventDefault();
    }
  }
}
