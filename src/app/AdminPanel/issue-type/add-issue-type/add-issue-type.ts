import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-issue-type',
  imports: [FormsModule,ReactiveFormsModule,RouterLink,CommonModule],
  templateUrl: './add-issue-type.html',
  styleUrl: './add-issue-type.css'
})
export class AddIssueType {

issueTypeForm!:FormGroup;
isPhotoDisabled:boolean=false;
isVideoDisabled:boolean=false;
selectedPhotoTypes: string[] = [];
selectedVideoTypes: string[] = [];
selectedPhotoTypesId: number[] = [];
selectedVideoTypesId: number[] = [];
addPopupVisible:boolean=false;
addPopupphotoVisible:boolean=false;
photoTypeList:any;
videoTypeList:any;
constructor( private fb:FormBuilder){
    
}
ngOnInit(){
this.initalizeform();
}
  initalizeform(){
    this.issueTypeForm = this.fb.group({
      t1_company_id: 'COMPANY001',
      issue_name: ['', [Validators.required]],
      media_type_photo: [''],
      media_type_video: [''],
      photorequirement:[''],
      photo_max_size:[''],
      photo_max_numbers:['',[Validators.max(4)]],
      photoType:[''],
      video_max_size:[''],
      video_max_numbers:[''],
      videoType:[''],
      videorequirement:[''],
      t9_3_description:['']
    });
   
  }

  onPhotoToggle(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const value = isChecked ? 'y' : 'n';
    this.issueTypeForm.get('media_type_photo')?.setValue(value);
    this.isPhotoDisabled = value === 'n';
  }
  onVideoToggle(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    const value = isChecked ? 'y' : 'n';
    this.issueTypeForm.get('media_type_video')?.setValue(value);
    this.isVideoDisabled = value === 'n';
  }
  selectAll(){

  }
  clearAll(){

  }
  onPhotoTypeChange(event: any, type: any) {
  const id = Number(type.id_12_issue_type_photo_video_of);
  const name = type.t12_description;

  if (event.target.checked) {
    if (!this.selectedPhotoTypesId.includes(id)) {
      this.selectedPhotoTypesId.push(id);
      this.selectedPhotoTypes.push(name);
    }
  } else {
    this.selectedPhotoTypesId = this.selectedPhotoTypesId.filter(i => i !== id);
    this.selectedPhotoTypes = this.selectedPhotoTypes.filter(n => n !== name);
  }
}
  addVideoPopup() {
    console.log("working");
    
    this.addPopupVisible = true;
  }
  addPhotoPopup() {
    console.log("working");
    
    this.addPopupphotoVisible = true;
  }

  removePhotoType(tag: string) {
 
}

removeVideoType(tag: string) {

}
 selectAllVideo() {
   
  }

  // Clear All
  clearAllVideo() {
    this.selectedVideoTypes = [];
    this.selectedVideoTypesId = [];
  }
  onVideoTypeChange(event: any, type: any) {
  const id = type.id_12_issue_type_photo_video_of;
  const name = type.t12_description;

  if (event.target.checked) {
    if (!this.selectedVideoTypesId.includes(id)) {
      this.selectedVideoTypes.push(name);
      this.selectedVideoTypesId.push(id);
    }
  } else {
    this.selectedVideoTypes = this.selectedVideoTypes.filter(item => item !== name);
    this.selectedVideoTypesId = this.selectedVideoTypesId.filter(item => item !== id);
  }
}
submit(){

}
}
