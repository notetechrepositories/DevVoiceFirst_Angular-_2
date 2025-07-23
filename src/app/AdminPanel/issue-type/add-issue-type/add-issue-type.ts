import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerTypeService } from '../../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';
import { MediaTypeService } from '../../../Service/MediaTypeService/media-type-service';
import { IssueType } from '../issue-type';
import { IssueTypeService } from '../../../Service/IssueTypeService/issue-type-service';
import { AddAnswerType } from '../../sys-answer-type/add-answer-type/add-answer-type';
import { AddMediaType } from "../../media-type/add-media-type/add-media-type";

@Component({
  selector: 'app-add-issue-type',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule, AddAnswerType, AddMediaType],
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
  isMediaModalVisible:boolean=false;
selectedMediaTypeList:any[]=[];
  videoTypeList: any;
  answerTypeList: any[] = [];
  selectedAnswerTypes: any[] = [];
  mediaTypeList: any[] = [];

isAnswerModalVisible:boolean=false;
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
    private issueTypeService:IssueTypeService,
    private router:Router
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

  openAnswerModal(){
    this.isAnswerModalVisible=true;
  }



  closeModal(){
    this.isAnswerModalVisible=false;
  }



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


//----------------------------

  selectAll() {
    this.selectedPhotoTypes = this.attachmentType.map(m => m.name);
  }

  clearAll() {
    this.selectedPhotoTypes = [];
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

onMediaTypeChange(formIndex: number, type: any, event: any) {
  const checked = event.target.checked;
  const control = this.issueTypeForm.get('mediaRequireds') as FormArray;
  const group = control.at(formIndex).get('mediaTypeIds') as FormArray;

  const existingIndex = group.controls.findIndex(c => c.value.mediaTypeId === type.id);

  if (checked) {
    // Add only if not already present
    if (existingIndex === -1) {
      group.push(this.fb.group({
        mediaTypeId: [type.id, Validators.required],
        mandatory: [false]
      }));
    }
     const alreadySelected = this.selectedMediaTypeList.some(t => t.id === type.id);
    if (!alreadySelected) {
      this.selectedMediaTypeList.push(type);
    }
  } else {
    // Remove from FormArray if unchecked
    if (existingIndex !== -1) {
      group.removeAt(existingIndex);
    }
     this.selectedMediaTypeList = this.selectedMediaTypeList.filter(t => t.id !== type.id);
  }
}
isMediaTypeChecked(index: number, mediaTypeId: string): boolean {
  const mediaTypeIds = this.issueTypeForm.get('mediaRequireds') as FormArray;
  const mediaTypes = mediaTypeIds.at(index).get('mediaTypeIds') as FormArray;
  return mediaTypes.controls.some(c => c.value.mediaTypeId === mediaTypeId);
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




isMandatoryChecked(formIndex: number, mediaTypeId: string): boolean {
  const group = this.issueTypeForm.get('mediaRequireds') as FormArray;
  const mediaTypes = group.at(formIndex).get('mediaTypeIds') as FormArray;
  const control = mediaTypes.controls.find(c => c.value.mediaTypeId === mediaTypeId);
  return control?.value.mandatory || false;
}



  selectAllMediaType(index: number) {
  const mediaTypeIdsArray = this.issueTypeForm.get('mediaRequireds') as FormArray;
  const mediaTypeIds = mediaTypeIdsArray.at(index).get('mediaTypeIds') as FormArray;

  this.mediaTypeList.forEach(type => {
    const alreadyExists = mediaTypeIds.controls.some(c => c.value.mediaTypeId === type.id);
    if (!alreadyExists) {
      mediaTypeIds.push(this.fb.group({
        mediaTypeId: [type.id, Validators.required],
        mandatory: [false]
      }));
    }
    this.selectedMediaTypeList = this.mediaTypeList;
 
    
  });
}

  clearAllMediaType(index: number) {
  const mediaTypeIdsArray = this.issueTypeForm.get('mediaRequireds') as FormArray;
  const mediaTypeIds = mediaTypeIdsArray.at(index).get('mediaTypeIds') as FormArray;

  while (mediaTypeIds.length !== 0) {
    mediaTypeIds.removeAt(0);
  }
   this.selectedMediaTypeList = [];
}
  openMediaModal() {
   this.isMediaModalVisible=true;
  }
  closeMediaModal(){
   this.isMediaModalVisible=false;
  }

removePhotoType(tag: any, formIndex: number) {
  // Remove from selectedMediaTypeList
  this.selectedMediaTypeList = this.selectedMediaTypeList.filter(t => t.id !== tag.id);

  // Remove from form array
  const mediaTypeIdsArray = (this.issueTypeForm.get('mediaRequireds') as FormArray)
    .at(formIndex)
    .get('mediaTypeIds') as FormArray;

  const indexToRemove = mediaTypeIdsArray.controls.findIndex(
    c => c.value.mediaTypeId === tag.id
  );

  if (indexToRemove !== -1) {
    mediaTypeIdsArray.removeAt(indexToRemove);
  }
}

  submit() {
    const form=this.issueTypeForm.value;
    console.log(form);
    
    this.issueTypeService.createIssueTypeService(form).subscribe({
    next:(res)=>{
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
}
