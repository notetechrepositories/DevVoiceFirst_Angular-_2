import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { AnswerTypeService } from '../../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { IssueTypeService } from '../../../Service/IssueTypeService/issue-type-service';
import { MediaTypeService } from '../../../Service/MediaTypeService/media-type-service';
import { AddAnswerType } from '../../sys-answer-type/add-answer-type/add-answer-type';
import { AddMediaType } from '../../media-type/add-media-type/add-media-type';

@Component({
  selector: 'app-edit-issue-type',
  imports: [ReactiveFormsModule,FormsModule,CommonModule,RouterLink,AddAnswerType,AddMediaType],
  templateUrl: './edit-issue-type.html',
  styleUrl: './edit-issue-type.css'
})
export class EditIssueType {
issueTypeForm!: FormGroup;
  isPhotoDisabled: boolean = false;
  isVideoDisabled: boolean = false;
  selectedPhotoTypes: string[] = [];
  selectedVideoTypes: string[] = [];
  selectedPhotoTypesId: number[] = [];
  selectedVideoTypesId: number[] = [];
  addPopupVisible: boolean = false;
  addPopupphotoVisible: boolean = false;
  isMediaModalVisible: boolean = false;
  selectedMediaTypeList: any[][] = [];
  videoTypeList: any;
  answerTypeList: any[] = [];
  selectedAnswerTypes: any[] = [];
  mediaTypeList: any[] = [];
// -------------
issueTypeId:any='';


  isAnswerModalVisible: boolean = false;
  attachmentType = [
    { id: "1", name: 'Photo' },
    { id: "2", name: 'Video' },
    { id: "3", name: 'Pdf' },
  ];

  selectedAttachments: any[] = [];
  constructor(private fb: FormBuilder,
    private answerTypeSevice: AnswerTypeService,
    private utilityService: UtilityService,
    private mediaTypeService: MediaTypeService,
    private issueTypeService: IssueTypeService,
    private router: Router,
    private route:ActivatedRoute
  ) {

  }
  ngOnInit() {
      this.issueTypeId = this.route.snapshot.paramMap.get('id');
      console.log(this.issueTypeId);
      
    this.initalizeform();
    this.getAnswerType();
    this.getMediaType();
    this.getIssueTypeById();

  }
  initalizeform() {
    this.issueTypeForm = this.fb.group({
      issueType: ['', Validators.required],
      answerTypeIds: [[]],
      mediaRequired: this.fb.array([])
    });

  }
  addMediaRequirement(mediaType: string) {
    const control = this.fb.group({
      mediaType: [mediaType, Validators.required],
      maximum: ['', [Validators.required]],
      maximumSize: ['', [Validators.required]],
      issueMediaTypeLinks: this.fb.array([])
    });

    (this.issueTypeForm.get('mediaRequired') as FormArray).push(control);
  }

  addMediaTypeId(index: number, id: string, mandatory: boolean) {
    const mediaTypeIdsArray = ((this.issueTypeForm.get('mediaRequired') as FormArray).at(index).get('issueMediaTypeLinks') as FormArray);

    mediaTypeIdsArray.push(this.fb.group({
      mediaTypeId: [id, Validators.required],
      mandatory: [mandatory]
    }));
  }

  // ------------------------

  get mediaRequired(): FormArray {
    return this.issueTypeForm.get('mediaRequired') as FormArray;
  }

  // -------------------------

  openAnswerModal() {
    this.isAnswerModalVisible = true;
  }



  closeModal() {
    this.isAnswerModalVisible = false;
  }


  getAnswerType() {
    this.answerTypeSevice.getAnswerType().subscribe({
      next: res => this.answerTypeList = res.body.data,
      error: err => this.utilityService.showError(err.status, err.error?.message || 'Get failed.')
    });
  }

  selectAllAnswerType() {
    const allIds = this.answerTypeList.map(type => type.id);
    this.issueTypeForm.get('answerTypeIds')?.setValue(allIds);

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

  getSelectedAnswerTypeNames(): string {
    const selectedIds: string[] = this.issueTypeForm.get('answerTypeIds')?.value || [];

    if (selectedIds.length === 0) {
      return 'Select Answer Types';
    }

    const selectedNames = this.answerTypeList
      .filter(type => selectedIds.includes(type.id))
      .map(type => type.answerTypeName);

    const maxDisplay = 3;

    if (selectedNames.length > maxDisplay) {
      const visible = selectedNames.slice(0, maxDisplay).join(', ');
      return `${visible},... +${selectedNames.length - maxDisplay} more`;
    }

    return selectedNames.join(', ');
  }

  addNewAnswerTypeToList(newType: any) {
    this.answerTypeList.push(newType);
  }
  //----------------------------

  selectAll() {
    this.selectedPhotoTypes = this.attachmentType.map(m => m.name);
  }

  clearAll() {
    this.selectedPhotoTypes = [];
  }
  toggleAttachment(type: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedAttachments.some(t => t.id === type.id)) {
        this.selectedAttachments.push(type);
        this.mediaRequired.push(this.fb.group({
          mediaType: [type.name, Validators.required],
          maximum: ['', Validators.required],
          maximumSize: ['', Validators.required],
          issueMediaTypeLinks: this.fb.array([])
        }));
        this.selectedMediaTypeList.push([]);
      }
    } else {
      const index = this.selectedAttachments.findIndex(t => t.id === type.id);
      if (index > -1) {
        this.selectedAttachments.splice(index, 1);
        this.mediaRequired.removeAt(index);
        this.selectedMediaTypeList.splice(index, 1);
      }
    }
  }



  // ------------------------MediaType--------------------------------------

  getMediaType() {
    this.mediaTypeService.getMediatype().subscribe({
      next: res => this.mediaTypeList = res.body.data,
      error: err => this.utilityService.showError(err.status, err.error?.message || 'Get failed.')
    });
  }

  selectAllMediaType(index: number) {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaTypeLinks') as FormArray;

    this.mediaTypeList.forEach(type => {
      const exists = mediaTypeIds.controls.some(c => c.value.mediaTypeId === type.id);
      if (!exists) {
        mediaTypeIds.push(this.fb.group({
          mediaTypeId: [type.id, Validators.required],
          mandatory: [false]
        }));
      }
    });

    this.selectedMediaTypeList[index] = [...this.mediaTypeList];
  }

  clearAllMediaType(index: number) {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaTypeLinks') as FormArray;
    while (mediaTypeIds.length !== 0) mediaTypeIds.removeAt(0);
    this.selectedMediaTypeList[index] = [];
  }

  isMediaTypeChecked(index: number, id: string): boolean {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaTypeLinks') as FormArray;
    return mediaTypeIds.controls.some(c => c.value.mediaTypeId === id);
  }

  onMediaTypeChange(index: number, type: any, event: any) {
    const checked = event.target.checked;
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaTypeLinks') as FormArray;
    const exists = mediaTypeIds.controls.find(c => c.value.mediaTypeId === type.id);

    if (checked && !exists) {
      mediaTypeIds.push(this.fb.group({
        mediaTypeId: [type.id, Validators.required],
        mandatory: [false]
      }));
      this.selectedMediaTypeList[index].push(type);
    } else if (!checked && exists) {
      const idx = mediaTypeIds.controls.findIndex(c => c.value.mediaTypeId === type.id);
      mediaTypeIds.removeAt(idx);
      this.selectedMediaTypeList[index] = this.selectedMediaTypeList[index].filter(t => t.id !== type.id);
    }
  }

  isMandatoryChecked(index: number, mediaTypeId: string): boolean {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaTypeLinks') as FormArray;
    const control = mediaTypeIds.controls.find(c => c.value.mediaTypeId === mediaTypeId);
    return control?.value.mandatory || false;
  }

  onMandatoryToggle(index: number, type: any, event: any) {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaTypeLinks') as FormArray;
    const control = mediaTypeIds.controls.find(c => c.value.mediaTypeId === type.id);
    if (control) {
      control.patchValue({ mandatory: event.target.checked });
    }
  }

  openMediaModal() {
    this.isMediaModalVisible = true;
  }

  closeMediaModal() {
    this.isMediaModalVisible = false;
  }
  addNewMediaTypeToList(newType: any) {
    this.mediaTypeList.push(newType);
  }

  removeMediaType(tag: any, formIndex: number) {
    const formArray = this.issueTypeForm.get('mediaRequired') as FormArray;
    const mediaTypeIdsArray = formArray.at(formIndex).get('issueMediaTypeLinks') as FormArray;

    this.selectedMediaTypeList[formIndex] = this.selectedMediaTypeList[formIndex].filter(
      (t: any) => t.id !== tag.id
    );
    const indexToRemove = mediaTypeIdsArray.controls.findIndex(
      c => c.value.mediaTypeId === tag.id
    );

    if (indexToRemove !== -1) {
      mediaTypeIdsArray.removeAt(indexToRemove);
      mediaTypeIdsArray.markAsDirty();
      mediaTypeIdsArray.markAsTouched();
    }
  }
// -------------------------------------------------------------------------------

// ------------SUBMIT------------------------------------------------------------
  submit() {
    const form = this.issueTypeForm.value;
    console.log(form);

    this.issueTypeService.createIssueType(form).subscribe({
      next: (res) => {
        console.log(res);
        this.utilityService.success(res.body.message);
        this.router.navigate(['admin/issue-type'])
      },
      error: err => {
        console.log(err);

        this.utilityService.showError(err.status, err.error.message);
      }
    });
  }
// -----------------------------
getIssueTypeById(){
this.issueTypeService.getIssueTypeBYId(this.issueTypeId).subscribe({
  next:(res)=>{
    console.log(res);
    
  }
})
}
}
