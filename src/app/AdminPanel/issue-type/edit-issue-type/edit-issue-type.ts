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
import { AttachmentSevice } from '../../../Service/AttachmentService/attachment-sevice';

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
  answerTypeList: any[] = [];
  selectedAnswerTypes: any[] = [];
  mediaTypeList: any[] = [];
  answerTypeIds: any[] = [];
// -------------
issueTypeId:any='';


  isAnswerModalVisible: boolean = false;
  attachmentType :any[]=[];

  selectedAttachments: any[] = [];

  issueTypeData :any;
  issueAnswerType:any;

  deletedAnswerTypeIds: string[] = [];
  removedAttachments: any[] = [];
  isEdit:Boolean=false;
  originalFormState:any


  constructor(private fb: FormBuilder,
    private answerTypeSevice: AnswerTypeService,
    private utilityService: UtilityService,
    private mediaTypeService: MediaTypeService,
    private issueTypeService: IssueTypeService,
    private router: Router,
    private route:ActivatedRoute,
    private attachmentService:AttachmentSevice
  ) {

  }
  ngOnInit() {
      this.issueTypeId = this.route.snapshot.paramMap.get('id');
      console.log(this.issueTypeId);
      
    this.initalizeform();
    this.getAnswerType();
    this.getMediaType();
    this.getIssueTypeById();
    this.getAttachment();
  }

  initalizeform() {
    this.issueTypeForm = this.fb.group({
      id: [''],
      issueType: ['', Validators.required],
      status: [true],
      answerTypeIds: this.fb.array([]),
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

  get mediaRequired(): FormArray {
    return this.issueTypeForm.get('mediaRequired') as FormArray;
  }

  private setAnswerTypeArray(data: any[]): void {
    const answerTypeArray = this.issueTypeForm.get('answerTypeIds') as FormArray;
    answerTypeArray.clear();
  
    (data || []).forEach(item => {
      answerTypeArray.push(this.fb.group({
        issueAnswerTypeId: [item.issueAnswerTypeId],
        answerTypeId: [item.answerTypeId],
        answerTypeName: [item.answerTypeName],
        issueTypeId: [item.issueTypeId],
        status: [item.status ?? true]
      }));
    });
  }

  private setMediaRequiredArray(data: any[]): void {
    const mediaRequiredArray = this.issueTypeForm.get('mediaRequired') as FormArray;
    mediaRequiredArray.clear();
    this.selectedMediaTypeList = [];
  
    (data || []).forEach((item: any) => {
      const mediaGroup = this.fb.group({
        mediaRequiredId: [item.mediaRequiredId],
        attachmentTypeId: [item.attachmentTypeId, Validators.required],
        maximum: [item.maximum, Validators.required],
        maximumSize: [item.maximumSize, Validators.required],
        status: [item.status ?? true],
        issueMediaType: this.fb.array([])
      });
  
      const issueMediaTypeArray = mediaGroup.get('issueMediaType') as FormArray;
      const selectedMediaTypes: any[] = [];
  
      (item.issueMediaType || []).forEach((mt: any) => {
        issueMediaTypeArray.push(this.fb.group({
          issueMediaTypeId: [mt.issueMediaTypeId],
          mediaTypeId: [mt.mediaTypeId, Validators.required],
          description: [mt.description],
          mandatory: [mt.mandatory],
          status: [mt.status ?? true]
        }));
  
        selectedMediaTypes.push({
          mediaTypeId: mt.mediaTypeId,
          description: mt.description,
          mandatory: mt.mandatory,
          status: mt.status
        });
      });
  
      mediaRequiredArray.push(mediaGroup);
      this.selectedMediaTypeList.push(selectedMediaTypes);
    });
  }
  

  enableEdit() {
    this.isEdit = true;
    this.issueTypeForm.enable();
  }

  cancelEdit() {
    this.isEdit = false;
  
    if (!this.originalFormState?.form) return;
  
    const formValue = this.originalFormState.form;
  
    // Restore simple fields
    this.issueTypeForm.patchValue({
      id: formValue.id,
      issueType: formValue.issueType,
      status: formValue.status
    });
  
    // Restore answerTypeIds FormArray
    this.setAnswerTypeArray(formValue.answerTypeIds);
  
    // Restore mediaRequired FormArray
    this.setMediaRequiredArray(formValue.mediaRequired);
  
    // Restore selectedMediaTypeList
    this.selectedMediaTypeList = JSON.parse(JSON.stringify(this.originalFormState.selectedMediaTypeList));

  }
  
  
  getIssueTypeById() {
    this.issueTypeService.getIssueTypeBYId(this.issueTypeId).subscribe({
      next: res => {
        const data = res.body.data;
        console.log(data);
  
        this.issueAnswerType = data.answerTypeIds || [];
        this.selectedAttachments = data.mediaRequired || [];
  
        this.issueTypeForm.patchValue({
          id: data.id,
          issueType: data.issueType,
          status: data.status ?? true,
          answerTypeIds: this.issueAnswerType.map((a: any) => a.answerTypeId)
        });
  
        // Populate answerTypeIds FormArray
        this.setAnswerTypeArray(data.answerTypeIds);
  
        // Populate mediaRequired FormArray
        this.setMediaRequiredArray(this.selectedAttachments);
  
        // Save original form state
        this.originalFormState = {
          form: this.issueTypeForm.getRawValue(),
          selectedMediaTypeList: JSON.parse(JSON.stringify(this.selectedMediaTypeList)),
        };
      },
      error: err => this.utilityService.showError(err.status, err.error?.message || 'Fetch failed.')
    });
  }

  get answerTypeListFromForm(): any[] {
    return (this.issueTypeForm.get('answerTypeIds') as FormArray).controls.map(c => c.value);
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
    const answerArray = this.issueTypeForm.get('answerTypeIds') as FormArray;
    answerArray.clear();
  
    this.issueAnswerType = []; // Clear old list
  
    this.answerTypeList.forEach(type => {
      const group = this.fb.group({
        issueAnswerTypeId: [null],
        answerTypeId: [type.id],
        answerTypeName: [type.answerTypeName],
        issueTypeId: [this.issueTypeForm.value.id],
        status: [true]
      });
  
      answerArray.push(group);
  
      // Also update the visual preview array
      this.issueAnswerType.push(group.value);
    });
  
    answerArray.markAsDirty();
  }
  
  clearAllAnswerType() {
    const answerArray = this.issueTypeForm.get('answerTypeIds') as FormArray;
    answerArray.clear();
    answerArray.markAsDirty();
    this.issueAnswerType=[];
  }
  
  onAnswerTypeToggle(type: any, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const answerArray = this.issueTypeForm.get('answerTypeIds') as FormArray;
  
    if (checked) {
      const exists = answerArray.controls.some(ctrl => ctrl.value.answerTypeId === type.id);
      if (!exists) {
        const group = this.fb.group({
          issueAnswerTypeId: [null],
          answerTypeId: [type.id],
          answerTypeName: [type.answerTypeName],
          issueTypeId: [this.issueTypeForm.value.id],
          status: [true]
        });
  
        answerArray.push(group);
        this.issueAnswerType.push(group.value); // ✅ add to visual list
      }
    }else {
      const index = answerArray.controls.findIndex(ctrl => ctrl.value.answerTypeId === type.id);
      if (index > -1) {
        const removedItem = answerArray.at(index).value;
        answerArray.removeAt(index);
    
        // ✅ Track for deletion if it has issueAnswerTypeId
        if (removedItem.issueAnswerTypeId) {
          this.deletedAnswerTypeIds.push(removedItem.issueAnswerTypeId);
        }
      }
    
      // Remove from display list
      const visualIndex = this.issueAnswerType.findIndex((item:any) => item.answerTypeId === type.id);
      if (visualIndex > -1) {
        this.issueAnswerType.splice(visualIndex, 1);
      }
    }
  
    answerArray.markAsDirty();
  }
  
  

  isAnswerTypeSelected(id: string): boolean {
    const answerArray = this.issueTypeForm.get('answerTypeIds') as FormArray;
    return answerArray.controls.some(ctrl => ctrl.value.answerTypeId === id);
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
        // Track deletion if it previously existed in the DB
        const original = this.selectedAttachments.find((a: any) => a.attachmentTypeId === type.id);
        if (original?.mediaRequiredId) {
          this.removedAttachments.push(original.mediaRequiredId);
        }
  
        this.selectedAttachments.splice(index, 1);
        this.mediaRequired.removeAt(index);
        this.selectedMediaTypeList.splice(index, 1);
      }
    }
  
    this.mediaRequired.markAsDirty();
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
      // Add to FormArray
      mediaTypeIds.push(this.fb.group({
        mediaTypeId: [type.id, Validators.required],
        mandatory: [false]
      }));

      if (!this.selectedMediaTypeList[index]) {
        this.selectedMediaTypeList[index] = [];
      }
  
      // Push a consistent object shape to the visual list
      this.selectedMediaTypeList[index].push({
        mediaTypeId: type.id,
        description: type.description,
        status: true
      });
      
  
    } else if (!checked && exists) {
      const idx = mediaTypeIds.controls.findIndex(c => c.value.mediaTypeId === type.id);
      mediaTypeIds.removeAt(idx);
  
      // Remove from visual list using mediaTypeId
      this.selectedMediaTypeList[index] = this.selectedMediaTypeList[index].filter(
        (t: any) => t.mediaTypeId !== type.id
      );
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
      (t: any) => t.mediaTypeId !== tag.mediaTypeId
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



isAttachmentSelected(id: string): boolean {
  return this.selectedAttachments?.some((item: any) => item.attachmentTypeId === id);
}

onAttachmentToggle(type: any, event: Event) {
  const checked = (event.target as HTMLInputElement).checked;
  const formArray = this.issueTypeForm.get('mediaRequired') as FormArray;

  if (checked) {
    // Prevent duplicates
    if (!this.selectedAttachments.some((a: any) => a.attachmentTypeId === type.id)) {
      const newAttachment = {
        attachmentTypeId: type.id,
        attachmentType: type.attachmentType,
        maximum: 1,
        maximumSize: 1,
        issueMediaType: []
      };

      this.selectedAttachments.push(newAttachment);

      formArray.push(this.fb.group({
        attachmentTypeId: [type.id, Validators.required],
        maximum: [1, Validators.required],
        maximumSize: [1, Validators.required],
        issueMediaType: this.fb.array([])
      }));

      this.selectedMediaTypeList.push([]);
    }
  } else {
    // Find the attachment to be removed
    const index = this.selectedAttachments.findIndex((a: any) => a.attachmentTypeId === type.id);
    const removedAttachment = this.selectedAttachments[index];

    if (index > -1) {
      // Track the removed item so mediaRequiredId is not lost
      if (removedAttachment?.mediaRequiredId) {
        this.removedAttachments.push(removedAttachment);
      }

      this.selectedAttachments.splice(index, 1);
    }

    // Remove form control by matching attachmentTypeId, not index
    const formIndex = formArray.controls.findIndex(
      ctrl => ctrl.get('attachmentTypeId')?.value === type.id
    );
    if (formIndex > -1) {
      formArray.removeAt(formIndex);
      this.selectedMediaTypeList.splice(formIndex, 1);
    }
  }
}

// ------------SUBMIT------------------------------------------------------------


generateUpdatePayload(): any {
  const form = this.issueTypeForm;
  const payload: any = {
    id: this.issueTypeId,
    issueAnswerTypes: [], // handled separately
    mediaRequired: []
  };

  // ---------- Handle issueType ----------
  if (form.get('issueType')?.dirty) {
    payload.issueType = form.get('issueType')?.value;
  }

  // ---------- Handle Answer Types ----------
  const answerArray = form.get('answerTypeIds') as FormArray;
  const originalAnswers = this.issueAnswerType;
  const answerTypeChanges: any[] = [];

  answerArray.controls.forEach(ctrl => {
    const val = ctrl.value;
    const original = originalAnswers.find((o: any) => o.answerTypeId === val.answerTypeId);

    if (val.issueAnswerTypeId) {
      if (original && original.status !== val.status) {
        answerTypeChanges.push({
          issueAnswerTypeId: val.issueAnswerTypeId
        });
      }
    } else {
      answerTypeChanges.push({
        answerTypeId: val.answerTypeId
      });
    }
  });

  // ✅ Add deletions
  this.deletedAnswerTypeIds.forEach(id => {
    answerTypeChanges.push({
      issueAnswerTypeId: id
    });
  });

  if (answerTypeChanges.length > 0) {
    payload.issueAnswerTypes = answerTypeChanges;
  }

  // ---------- Handle Media Required ----------
  const formArray = form.get('mediaRequired') as FormArray;
  const formAttachmentIds = formArray.controls.map(ctrl => ctrl.get('attachmentTypeId')?.value);
  const removedMediaRequired = this.removedAttachments || [];

  const mediaRequiredChanges: any[] = [];

  removedMediaRequired.forEach((item: any) => {
    if (item.mediaRequiredId) {
      mediaRequiredChanges.push({
        mediaRequiredId: item.mediaRequiredId,
        issueMediaType: []
      });
    }
  });

  formArray.controls.forEach((group, index) => {
    const groupValue = group.value;
    const original = this.selectedAttachments.find(
      (orig: any) => orig.attachmentTypeId === groupValue.attachmentTypeId
    );
  
    const mediaArray = group.get('issueMediaType') as FormArray;
    const formMediaList = mediaArray.controls.map(c => c.value);
    const originalMedia = original?.issueMediaType || [];
  
    const issueMediaTypeChanges: any[] = [];
  
    const removedMedia = originalMedia.filter(
      (om: any) => !formMediaList.find((fm: any) => fm.mediaTypeId === om.mediaTypeId)
    );
  
    removedMedia.forEach((rm: any) => {
      if (rm.issueMediaTypeId) {
        issueMediaTypeChanges.push({ issueMediaTypeId: rm.issueMediaTypeId });
      }
    });
  
    formMediaList.forEach((fm: any) => {
      const originalMatch = originalMedia.find((om: any) => om.mediaTypeId === fm.mediaTypeId);
  
      if (!originalMatch || originalMatch.mandatory !== fm.mandatory) {
        issueMediaTypeChanges.push({
          mediaTypeId: fm.mediaTypeId,
          mandatory: fm.mandatory
        });
      }
    });
  
    const isNew = !original || !original.mediaRequiredId;
    const maxChanged = isNew || original.maximum !== groupValue.maximum;
    const sizeChanged = isNew || original.maximumSize !== groupValue.maximumSize;
    const statusChanged = isNew || original.status !== groupValue.status;
  
    const itemPayload: any = {};
  
    if (isNew) {
      itemPayload.attachmentTypeId = groupValue.attachmentTypeId;
    } else {
      itemPayload.mediaRequiredId = original.mediaRequiredId;
    }
  
    if (isNew || issueMediaTypeChanges.length > 0) {
      itemPayload.issueMediaType = issueMediaTypeChanges;
    }
  
    if (maxChanged) itemPayload.maximum = groupValue.maximum;
    if (sizeChanged) itemPayload.maximumSize = groupValue.maximumSize;
    if (statusChanged) itemPayload.status = groupValue.status ?? true;
  
    if (
      isNew ||
      issueMediaTypeChanges.length > 0 ||
      maxChanged ||
      sizeChanged ||
      statusChanged
    ) {
      if (!itemPayload.issueMediaType) {
        itemPayload.issueMediaType = [];
      }
      mediaRequiredChanges.push(itemPayload);
    }
  });
  

  if (mediaRequiredChanges.length > 0) {
    payload.mediaRequired = mediaRequiredChanges;
  }

  this.removedAttachments = [];

  return payload;
}


  async submit() {

  const payload= await this.generateUpdatePayload()

  this.issueTypeService.updateIssueType(payload).subscribe({
    next: (res) => {
      if(res.status==200){
        this.utilityService.success(res.body.message);
      } 
    },
    error: err => {
      this.utilityService.showError(err.status, err.error.message);
    }
  });
}


}
