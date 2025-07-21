import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-issue-type',
  imports: [FormsModule,ReactiveFormsModule,RouterLink],
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
