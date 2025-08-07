import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssueStatusService } from '../../../Service/IssueStatusService/issue-status-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-issue-status',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-issue-status.html',
  styleUrl: './add-issue-status.css'
})
export class AddIssueStatus {

issueStatusForm!: FormGroup;
newIssueStatus:any;

@Output() close = new EventEmitter<void>();
@Output() created = new EventEmitter<any>();

constructor(
  private fb: FormBuilder,
  private utilityService: UtilityService,
  private issueStatusService: IssueStatusService
){}

ngOnInit() {
  this.issueStatusForm = this.fb.group({
    id: [''],
    issueStatus: ['', Validators.required],
  });
}


submitIssueStatus() {
  if (this.issueStatusForm.invalid) {
    this.issueStatusForm.markAllAsTouched();
    return;
  }
  const form = this.issueStatusForm;
  const formValue = form.value;
  const payload = {
    issueStatus: formValue.issueStatus,

  };

    this.issueStatusService.createIssueStatus(payload).subscribe({
      next: (res) => {
        if(res.status==201){
          this.newIssueStatus=res.body.data;
          this.utilityService.success(res.body.message);
         this.created.emit(this.newIssueStatus);
         this.close.emit();
         this.issueStatusForm.reset();
        }
        
      },
      error: err => {
        this.utilityService.showError(err.status, err.error.message);
      }
    });
  }

  closeModal (){
    this.close.emit();
  }
  
}

