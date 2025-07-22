import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AnswerTypeService } from '../../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';
import { MediaTypeService } from '../../../Service/MediaTypeService/media-type-service';

@Component({
  selector: 'app-add-issue-type',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './add-issue-type.html',
  styleUrl: './add-issue-type.css'
})
export class AddIssueType {

  issueTypeForm!: FormGroup;
  isPhotoDisabled: boolean = false;
  isVideoDisabled: boolean = false;
  selectedPhotoTypes: string[] = [];
  selectedVideoTypes: string[] = [];
  selectedPhotoTypesId: number[] = [];
  selectedVideoTypesId: number[] = [];
  addPopupVisible: boolean = false;
  addPopupphotoVisible: boolean = false;

  videoTypeList: any;
  answerTypeList: any[] = [];
  selectedAnswerTypes: any[] = [];
  mediaTypeList: any[] = [];


  attachmentType = [
    { id: "1", name: 'Photo' },
    { id: "2", name: 'Video' },
    { id: "3", name: 'Pdf' },
  ];

  selectedAttachments: any[] = [];
  constructor(private fb: FormBuilder,
    private answerTypeSevice: AnswerTypeService,
    private utilityService: UtilityService,
    private mediaTypeService: MediaTypeService
  ) {

  }
  ngOnInit() {
    this.initalizeform();
    this.getAnswerType();
    this.getMediaType();

  }
  initalizeform() {
    this.issueTypeForm = this.fb.group({
      issueType: ['', Validators.required],
      answerTypeIds: [[]],
      mediaRequireds: this.fb.array([])
    });

  }
  addMediaRequirement(mediaType: string) {
    const control = this.fb.group({
      mediaType: [mediaType, Validators.required],
      maximum: ['', [Validators.required]],
      maximumSize: ['', [Validators.required]],
      mediaTypeIds: this.fb.array([])
    });

    (this.issueTypeForm.get('mediaRequireds') as FormArray).push(control);
  }

  addMediaTypeId(index: number, id: string, mandatory: boolean) {
    const mediaTypeIdsArray = ((this.issueTypeForm.get('mediaRequireds') as FormArray).at(index).get('mediaTypeIds') as FormArray);

    mediaTypeIdsArray.push(this.fb.group({
      mediaTypeId: [id, Validators.required],
      mandatory: [mandatory]
    }));
  }

  // -------------------------
  getAnswerType() {
    this.answerTypeSevice.getAnswerType().subscribe({
      next: res => {
        this.answerTypeList = res.body.data;
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }
  selectAllAnswerType() {
    const allIds = this.answerTypeList.map(type => type.id);
    this.issueTypeForm.get('answerTypeIds')?.setValue(allIds);
    this.issueTypeForm.get('answerTypeIds')?.markAsDirty();
  }
  clearAllAnswerType() {
    this.issueTypeForm.get('answerTypeIds')?.setValue([]);
    this.issueTypeForm.get('answerTypeIds')?.markAsDirty();
  }

  onAnswerTypeToggle(type: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const answerTypeIds = this.issueTypeForm.get('answerTypeIds')?.value || [];

    if (checked) {
      if (!answerTypeIds.includes(type.id)) {
        answerTypeIds.push(type.id);
      }
    } else {
      const index = answerTypeIds.indexOf(type.id);
      if (index > -1) {
        answerTypeIds.splice(index, 1);
      }
    }

    this.issueTypeForm.get('answerTypeIds')?.setValue(answerTypeIds);
    this.issueTypeForm.get('answerTypeIds')?.markAsDirty();
  }
  isAnswerTypeSelected(id: string): boolean {
    return this.issueTypeForm.get('answerTypeIds')?.value?.includes(id);
  }
  // ------------------------
  getMediaType() {
    this.mediaTypeService.getMediatype().subscribe({
      next: res => {
        this.mediaTypeList = res.body.data;
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }


  toggleMediaType(type: any, event: any) {
    const isChecked = event.target.checked;
    const currentIndex = this.selectedPhotoTypes.indexOf(type.description);
    if (isChecked && currentIndex === -1) {
      this.selectedPhotoTypes.push(type.description);
    } else if (!isChecked && currentIndex !== -1) {
      this.selectedPhotoTypes.splice(currentIndex, 1);
    }
  }

  toggleMandatory(type: any) {
    console.log('Toggled mandatory for:', type.name);
    // Implement logic to track mandatory status
  }
  isAttachmentSelected(id: string): boolean {
  return this.selectedAttachments.some(t => t.id === id);
}

  onMediaTypeChange(formIndex: number, type: any, event: any) {
    const checked = event.target.checked;
    const control = this.issueTypeForm.get('mediaRequireds') as FormArray;
    const group = control.at(formIndex).get('mediaTypeIds') as FormArray;

    if (checked) {
      group.push(this.fb.group({
        mediaTypeId: [type.id, Validators.required],
        mandatory: [false]
      }));
    } else {
      const indexToRemove = group.controls.findIndex(c => c.value.mediaTypeId === type.id);
      if (indexToRemove !== -1) group.removeAt(indexToRemove);
    }
  }

  onMandatoryToggle(formIndex: number, type: any, event: any) {
    const checked = event.target.checked;
    const group = this.issueTypeForm.get('mediaRequireds') as FormArray;
    const mediaTypes = group.at(formIndex).get('mediaTypeIds') as FormArray;
    const control = mediaTypes.controls.find(c => c.value.mediaTypeId === type.id);
    if (control) {
      control.patchValue({ mandatory: checked });
    }
  }


  toggleAttachment(type: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  const formArray = this.issueTypeForm.get('mediaRequireds') as FormArray;

  if (checked) {
    if (!this.selectedAttachments.some(t => t.id === type.id)) {
      this.selectedAttachments.push(type);

      formArray.push(this.fb.group({
        mediaType: [type.name, Validators.required],
        maximumSize: ['', Validators.required],
        maximum: ['', Validators.required],
        mediaTypeIds: this.fb.array([])
      }));
    }
  } else {
    const index = this.selectedAttachments.findIndex(t => t.id === type.id);
    if (index > -1) {
      this.selectedAttachments.splice(index, 1);
      formArray.removeAt(index);
    }
  }
}




  selectAll() {
    this.selectedPhotoTypes = this.mediaTypeList.map(m => m.description);
  }

  clearAll() {
    this.selectedPhotoTypes = [];
  }
  addPhotoPopup() {
    console.log("working");

    this.addPopupphotoVisible = true;
  }

  removePhotoType(tag: string) {
    const index = this.selectedPhotoTypes.indexOf(tag);
    if (index > -1) {
      this.selectedPhotoTypes.splice(index, 1);
    }
  }

  submit() {
    console.log(this.issueTypeForm.value);

  }
}
