import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaTypeService } from '../../../Service/MediaTypeService/media-type-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';

@Component({
  selector: 'app-add-media-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-media-type.html',
  styleUrl: './add-media-type.css'
})
export class AddMediaType {

mediaTypeForm!:FormGroup;
@Output() close = new EventEmitter<void>();

constructor(private mediatypeService:MediaTypeService,
 private utilityService:UtilityService
){}

submitMediaType(){
     const form = this.mediaTypeForm;
    const formValue = form.value;
    const payload = {
      description: formValue.description,
    };
    if (this.mediaTypeForm.invalid) {
      this.mediaTypeForm.markAllAsTouched();
      return;
    }
      this.mediatypeService.createMediaType(payload).subscribe({
        next: (res) => {
          this.utilityService.success(res.body.message);
           this.close.emit();
        },
        error: err => {
          this.utilityService.showError(err.status, err.error.message);
        }
      });
}
 closeModal(){
      this.close.emit();
    }
}
