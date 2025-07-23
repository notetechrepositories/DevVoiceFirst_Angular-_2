import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnswerTypeService } from '../../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';


@Component({
  selector: 'app-add-answer-type',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-answer-type.html',
  styleUrl: './add-answer-type.css'
})
export class AddAnswerType {

  answerTypeForm!: FormGroup;
@Output() close = new EventEmitter<void>();
  constructor(
    private fb: FormBuilder,
    private utilityService: UtilityService,
    private answerTypeSevice: AnswerTypeService
  ) { }


  ngOnInit() {
    this.answerTypeForm = this.fb.group({
      id: [''],
      answerTypeName: ['', Validators.required],
    });
  }

   submitAnswerType() {
    const form = this.answerTypeForm;
    const formValue = form.value;
    const payload = {
      answerTypeName: formValue.answerTypeName,

    };
    if (this.answerTypeForm.invalid) {
      this.answerTypeForm.markAllAsTouched();
      return;
    }

      this.answerTypeSevice.createAnswertype(payload).subscribe({
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

