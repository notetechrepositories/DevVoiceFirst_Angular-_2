import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AnswerTypeService } from '../../../Service/AnswerTypeService/answer-type-service';
import { UtilityService } from '../../../Service/UtilityService/utility-service';
import { MediaTypeService } from '../../../Service/MediaTypeService/media-type-service';
import { IssueTypeService } from '../../../Service/IssueTypeService/issue-type-service';
import { AddAnswerType } from '../../sys-answer-type/add-answer-type/add-answer-type';
import { AddMediaType } from "../../media-type/add-media-type/add-media-type";
import { AttachmentSevice } from '../../../Service/AttachmentService/attachment-sevice';
import { IssueStatusModel } from '../../../Models/IssueStatusModel';
import { IssueStatusService } from '../../../Service/IssueStatusService/issue-status-service';
import { AddIssueStatus } from '../../sys-issue-status/add-issue-status/add-issue-status';

@Component({
  selector: 'app-add-issue-type',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule, AddAnswerType, AddMediaType, AddIssueStatus],
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
  isMediaModalVisible: boolean = false;
  selectedMediaTypeList: any[][] = [];
  answerTypeList: any[] = [];
  issueStatusList : IssueStatusModel[]=[];
  selectedAnswerTypes: any[] = [];
  mediaTypeList: any[] = [];



  isAnswerModalVisible: boolean = false;
  attachmentType :any[ ]=[];
  selectedAttachments: any[] = [];

  selectedIssueStatus: string[] = [];

  isIssueStatusModalVisible:boolean=false;


  constructor(private fb: FormBuilder,
    private answerTypeSevice: AnswerTypeService,
    private utilityService: UtilityService,
    private mediaTypeService: MediaTypeService,
    private issueTypeService: IssueTypeService,
    private router: Router,
    private attachmentService:AttachmentSevice,
    private issueStatusService : IssueStatusService
  ) {

  }
  ngOnInit() {
    this.initalizeform();
    this.getAnswerType();
    this.getMediaType();
    this.getIssueStatus();
    this.getAttachment();
  }

  initalizeform() {
    this.issueTypeForm = this.fb.group({
      issueType: ['', Validators.required],
      issueStatus: [[]],
      issueAnswerType: [[]],
      mediaRequired: this.fb.array([])
    });
  }

  addMediaRequirement(attachmentTypeId: string) {
    const control = this.fb.group({
      attachmentTypeId: [attachmentTypeId],
      maximum: [''],
      maximumSize: [''],
      issueMediaType: this.fb.array([])
    });

    (this.issueTypeForm.get('mediaRequired') as FormArray).push(control);
  }

  addMediaTypeId(index: number, id: string, mandatory: boolean) {
    const mediaTypeIdsArray = ((this.issueTypeForm.get('mediaRequired') as FormArray).at(index).get('issueMediaType') as FormArray);

    mediaTypeIdsArray.push(this.fb.group({
      mediaTypeId: [id],
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
    this.issueTypeForm.get('issueAnswerType')?.setValue(allIds);

  }
  clearAllAnswerType() {
    this.issueTypeForm.get('issueAnswerType')?.setValue([]);
    this.issueTypeForm.get('issueAnswerType')?.markAsDirty();
  }

  onAnswerTypeToggle(type: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const issueAnswerType = this.issueTypeForm.get('issueAnswerType')?.value || [];

    if (checked) {
      if (!issueAnswerType.includes(type.id)) {
        issueAnswerType.push(type.id);
      }
    } else {
      const index = issueAnswerType.indexOf(type.id);
      if (index > -1) {
        issueAnswerType.splice(index, 1);
      }
    }

    this.issueTypeForm.get('issueAnswerType')?.setValue(issueAnswerType);
    this.issueTypeForm.get('issueAnswerType')?.markAsDirty();
  }

  isAnswerTypeSelected(id: string): boolean {
    return this.issueTypeForm.get('issueAnswerType')?.value?.includes(id);
  }

  getSelectedAnswerTypeNames(): string {
    const selectedIds: string[] = this.issueTypeForm.get('issueAnswerType')?.value || [];

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
  getAttachment(){
     this.attachmentService.getAttachment().subscribe({
      next: res => this.attachmentType = res.body.data,
      error: err => this.utilityService.showError(err.status, err.error?.message || 'Get failed.')
    });
  }

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
          attachmentTypeId: [type.id],
          maximum: [''],
          maximumSize: [''],
          issueMediaType: this.fb.array([])
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

  get selectedAttachmentLabel(): string {
    if (!this.selectedAttachments || this.selectedAttachments.length === 0) {
      return 'Select Attachment Types';
    }
    const names = this.selectedAttachments.map(t => t.attachmentType); // or t.name if applicable
    const maxVisible = 3;

    if (names.length <= maxVisible) {
      return names.join(', ');
    }
    const visibleNames = names.slice(0, maxVisible).join(', ');
    const remainingCount = names.length - maxVisible;
    return `${visibleNames}, +${remainingCount} more`;
  }

  // ---------------------- Issue Status --------------------------------

  getIssueStatus(){
    this.issueStatusService.getIssueStatus().subscribe({
     next: res => this.issueStatusList = res.body.data,
     error: err => this.utilityService.showError(err.status, err.error?.message || 'Get failed.')
   });
 }

 selectAllIssueStatus() {
   const allIds = this.issueStatusList.map(type => type.id);
    this.issueTypeForm.get('issueStatus')?.setValue(allIds);
}

clearAllIssueStatus() {
  this.issueTypeForm.get('issueStatus')?.setValue([]);
    this.issueTypeForm.get('issueStatus')?.markAsDirty();
}

onIssueStatusToggle(type: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  const issueStatus = this.issueTypeForm.get('issueStatus')?.value || [];

  if (checked) {
    if (!issueStatus.includes(type.id)) {
      issueStatus.push(type.id);
    }
  } else {
    const index = issueStatus.indexOf(type.id);
    if (index > -1) {
      issueStatus.splice(index, 1);
    }
  }

  this.issueTypeForm.get('issueStatus')?.setValue(issueStatus);
  this.issueTypeForm.get('issueStatus')?.markAsDirty();
}

isIssueStatusSelected(id: string): boolean {
  return this.issueTypeForm.get('issueStatus')?.value?.includes(id);
}

getSelectedIssueStatusNames(): string {
  const selectedIds: string[] = this.issueTypeForm.get('issueStatus')?.value || [];

  if (selectedIds.length === 0) {
    return 'Select Issue Status';
  }

  const selectedNames = this.issueStatusList
    .filter(type => selectedIds.includes(type.id))
    .map(type => type.issueStatus);

  const maxDisplay = 3;

  if (selectedNames.length > maxDisplay) {
    const visible = selectedNames.slice(0, maxDisplay).join(', ');
    return `${visible},... +${selectedNames.length - maxDisplay} more`;
  }

  return selectedNames.join(', ');
}

addNewIssueStatusToList(newType: any) {
  this.issueStatusList.push(newType);
}

openIssueStatusModal(){
  this.isIssueStatusModalVisible=true;
}

closeIssueStatusModal(){
  this.isIssueStatusModalVisible=false;
}


  // ------------------------MediaType--------------------------------------

  getMediaType() {
    this.mediaTypeService.getMediatype().subscribe({
      next: res => this.mediaTypeList = res.body.data,
      error: err => this.utilityService.showError(err.status, err.error?.message || 'Get failed.')
    });
  }

  selectAllMediaType(index: number) {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaType') as FormArray;

    this.mediaTypeList.forEach(type => {
      const exists = mediaTypeIds.controls.some(c => c.value.mediaTypeId === type.id);
      if (!exists) {
        mediaTypeIds.push(this.fb.group({
          mediaTypeId: [type.id],
          mandatory: [false]
        }));
      }
    });

    this.selectedMediaTypeList[index] = [...this.mediaTypeList];
  }

  clearAllMediaType(index: number) {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaType') as FormArray;
    while (mediaTypeIds.length !== 0) mediaTypeIds.removeAt(0);
    this.selectedMediaTypeList[index] = [];
  }

  isMediaTypeChecked(index: number, id: string): boolean {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaType') as FormArray;
    return mediaTypeIds.controls.some(c => c.value.mediaTypeId === id);
  }

  onMediaTypeChange(index: number, type: any, event: any) {
    const checked = event.target.checked;
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaType') as FormArray;
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
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaType') as FormArray;
    const control = mediaTypeIds.controls.find(c => c.value.mediaTypeId === mediaTypeId);
    return control?.value.mandatory || false;
  }

  onMandatoryToggle(index: number, type: any, event: any) {
    const mediaTypeIds = this.mediaRequired.at(index).get('issueMediaType') as FormArray;
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
    const mediaTypeIdsArray = formArray.at(formIndex).get('issueMediaType') as FormArray;

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




}
