import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
newMediaType:any;
@Output() close = new EventEmitter<void>();
@Output() created = new EventEmitter<any>();

constructor(private mediatypeService:MediaTypeService,
 private utilityService:UtilityService,
 private fb:FormBuilder
){}

 ngOnInit() {
    this.mediaTypeForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
    });
  }
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
          this.newMediaType=res.body.data;
          this.utilityService.success(res.body.message);
            this.created.emit(this.newMediaType);
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
