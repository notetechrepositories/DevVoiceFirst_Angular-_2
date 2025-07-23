import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CountryService } from '../../Service/CountryService/country-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { NavigationStateService } from '../../Service/SharedService/navigation-state-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-divisions',
  imports: [RouterLink,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './divisions.html',
  styleUrl: './divisions.css'
})
export class Divisions {

  countryId:string|null='';
  country:any;

  divisionOneList:any[]=[];
  originalDivisionOneList: any[] = [];

  divisionTwoList:any[]=[];
  originalDivisionTwoList: any[] = [];

  divisionThreeList:any[]=[];
  originalDivisionThreeList: any[] = [];

  selectedDivisionOneId:string|null='';
  selectedDivisionOneIds:string[]=[];
  selectedDivisionTwoId:string|null='';
  selectedDivisionTwoIds:string[]=[];
  selectedDivisionThreeId:string|null='';
  selectedDivisionThreeIds:string[]=[];

  searchTermDivisionOne:string='';
  searchTermDivisionTwo:string='';
  searchTermDivisionThree:string='';

  isEditMode: boolean = false;
  isDivisionOneModalVisible: boolean = false;
  isDivisionTwoModalVisible: boolean = false;
  isDivisionThreeModalVisible: boolean = false;

  divisionOneForm!:FormGroup;
  divisionTwoForm!:FormGroup;
  divisionThreeForm!:FormGroup;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private countryService:CountryService,
    private utilityService:UtilityService,
    private fb:FormBuilder,
    private navigationStateService:NavigationStateService
  ){}

  ngOnInit() {
    this.countryId = this.route.snapshot.paramMap.get('id');
    this.country = this.navigationStateService.getCountry();
    console.log(this.country);
    this.getDivisionOne();
    this.formInit();
  }

  formInit(){
    this.divisionOneForm=this.fb.group({
      divisionOne:['',Validators.required],
    });
    this.divisionTwoForm=this.fb.group({
      divisionTwo:['',Validators.required],
    });
    this.divisionThreeForm=this.fb.group({
      divisionThree:['',Validators.required],
    });
  }

  closeModal(){
    this.isDivisionOneModalVisible=false;
    this.isDivisionTwoModalVisible=false;
    this.isDivisionThreeModalVisible=false;
    this.isEditMode=false;
    this.divisionOneForm.reset();
    this.divisionTwoForm.reset();
    this.divisionThreeForm.reset();
  }

  openDivisionModal(level: 'one' | 'two' | 'three', editItem?: any): void {
    this.isEditMode = !!editItem;
  
    switch (level) {
      case 'one':
        this.isDivisionOneModalVisible = true;
        this.selectedDivisionOneId = editItem?.id || null;
  
        if (editItem) {
          this.divisionOneForm.patchValue({
            divisionOne:editItem.divisionOne,
            countryId:this.countryId
          });
        }
        break;
  
      case 'two':
        this.isDivisionTwoModalVisible = true;
        this.selectedDivisionTwoId = editItem?.id || null;
  
        if (editItem) {
          this.divisionTwoForm.patchValue({
            divisionTwo:editItem.divisionTwo,
            divisionOneId:this.selectedDivisionOneId
          });
        }
        break;
  
      case 'three':
        this.isDivisionThreeModalVisible = true;
        this.selectedDivisionThreeId = editItem?.id || null;
  
        if (editItem) {
          this.divisionThreeForm.patchValue({
            divisionThree: editItem.divisionThree,
            divisionTwoId: this.selectedDivisionTwoId
          });
        }
        break;
  
      default:
        console.error('Invalid division level');
    }
  }



  // ------------- Division One --------------
  

  getDivisionOne(){
    this.countryService.getDivisionOne(this.countryId).subscribe({
      next:(res)=>{
        this.divisionOneList=res.body.data;
        this.originalDivisionOneList = [...res.body.data]; 
        if (this.divisionOneList.length > 0 && this.country?.divisionTwoLabel!=='') {
          this.selectedDivisionOneId = this.divisionOneList[0].id;
          this.getDivisionTwo(this.selectedDivisionOneId); // load second-level data
        }// keep a copy of the original list
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.showError(err.status,err.error?.message);
      }
    })
  }

  onSearchDivisionOne(){
    const term = this.searchTermDivisionOne.toLowerCase();
    if (term) {
      this.divisionOneList = this.originalDivisionOneList.filter((item)=>item.divisionOne.toLowerCase().includes(term));
    } else {
      this.divisionOneList = [...this.originalDivisionOneList];
    }
  }

  toggleDivisionOneSelection(id:string, event:Event){
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDivisionOneIds.push(id);
    } else {
      this.selectedDivisionOneIds = this.selectedDivisionOneIds.filter(selectedId => selectedId !== id);
    }
  }

  submitDivisionOne(){
    this.divisionOneForm.value.countryId=this.countryId;
    if(this.divisionOneForm.invalid){
      this.divisionOneForm.markAllAsTouched();
      return;
    }
    if(this.isEditMode){
      const updatedFields: any = { id: this.selectedDivisionOneId };
      this.utilityService.setIfDirty(this.divisionOneForm, 'divisionOne', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      
      this.countryService.updateDivisionOne(updatedFields).subscribe({
        next:(res)=>{
          if(res.status===200){
            const updatedItem = res.body?.data;
            const index = this.divisionOneList.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
              this.divisionOneList[index] = updatedItem;
            }
            this.utilityService.success(res.body?.message || 'Activity updated.');
            this.closeModal();
          }
          else{
              this.utilityService.warning(res.body?.message);
            }
        },
        error:(err)=>{
          this.utilityService.showError(err.status,err.error?.message);
        }
      });
    }
 
    this.countryService.createDivisionOne(this.divisionOneForm.value).subscribe({
      next:(res)=>{
        if(res.status===201){
          this.utilityService.success(res.body?.message);
          this.divisionOneList.push(res.body?.data);
          this.selectedDivisionOneId=this.divisionOneList[0].id;
          this.closeModal();
        }
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.showError(err.status,err.error?.message);
      }
    })
  }

  async deleteDivisionOne(): Promise<void> {
    const message = `Delete ${this.selectedDivisionOneIds.length} Division(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if(result.isConfirmed){
    this.countryService.deleteDivisionOne(this.selectedDivisionOneIds).subscribe({
      next:(res)=>{
          const deletedIds: string[] = res.body?.data || [];
          this.divisionOneList = this.divisionOneList.filter(item => !deletedIds.includes(item.id));
          this.selectedDivisionOneIds = [];
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
        this.selectedDivisionOneIds = [];
      }
  }


  // ------------- Division Two --------------
  

  getDivisionTwo(id:string|null){
    this.originalDivisionThreeList=[];
    this.divisionThreeList=[];
    this.selectedDivisionOneId=id;

    this.countryService.getDivisionTwo(id).subscribe({
      next:(res)=>{
        if(res.status===200){
          this.divisionTwoList=res.body?.data;
          this.originalDivisionTwoList = [...res.body?.data];
          if (this.divisionTwoList.length > 0 && this.country?.divisionThreeLabel!=='') {  // if division three label is not empty, then load division three
            this.selectedDivisionTwoId = this.divisionTwoList[0].id;
            this.getDivisionThree(this.selectedDivisionTwoId); // load second-level data
          }

        }
        else{
            this.originalDivisionTwoList=[];
            this.divisionTwoList=[];
        }
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.showError(err.status,err.error?.message);
      }
    })
  }

  onSearchDivisionTwo(){
    const term = this.searchTermDivisionTwo.toLowerCase();
    if (term) {
      this.divisionTwoList = this.originalDivisionTwoList.filter((item)=>item.divisionTwo.toLowerCase().includes(term));
    } else {
      this.divisionTwoList = [...this.originalDivisionTwoList];
    }
  }

  submitDivisionTwo(){
    this.divisionTwoForm.value.divisionOneId=this.selectedDivisionOneId;
    if(this.divisionTwoForm.invalid){
      this.divisionTwoForm.markAllAsTouched();
      return;
    }
  if(this.isEditMode){
    const updatedFields: any = { id: this.selectedDivisionTwoId };
      this.utilityService.setIfDirty(this.divisionTwoForm, 'divisionTwo', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      
      this.countryService.updateDivisionTwo(updatedFields).subscribe({
        next:(res)=>{
          if(res.status===200){
          const updatedItem = res.body?.data;
          const index = this.divisionTwoList.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
              this.divisionTwoList[index] = updatedItem;
            }
            this.utilityService.success(res.body?.message || 'Activity updated.');
            this.closeModal();
            }
          else{
            this.utilityService.warning(res.body?.message);
          }
        },
        error:(err)=>{
          this.utilityService.showError(err.status,err.error?.message);
        }
      });
  }
  else{
    this.countryService.createDivisionTwo(this.divisionTwoForm.value).subscribe({
      next:(res)=>{
        if(res.status===201){
          this.utilityService.success(res.body?.message);
          this.divisionTwoList.push(res.body?.data);
          this.selectedDivisionTwoId=this.divisionTwoList[0].id;
          this.closeModal();
        }
        else{
          this.utilityService.error(res.body?.message);
        }
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.showError(err.status,err.error?.message);
        }
      })
    }
  }

  toggleDivisionTwoSelection(id:string, event:Event){
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDivisionTwoIds.push(id);
    } else {
      this.selectedDivisionTwoIds = this.selectedDivisionTwoIds.filter(selectedId => selectedId !== id);
    }
  }

  async deleteDivisionTwo(): Promise<void> {
    const message = `Delete ${this.selectedDivisionTwoIds.length} Division(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if(result.isConfirmed){
    this.countryService.deleteDivisionTwo(this.selectedDivisionTwoIds).subscribe({
      next:(res)=>{
          const deletedIds: string[] = res.body?.data || [];
          this.divisionTwoList = this.divisionTwoList.filter(item => !deletedIds.includes(item.id));
          this.selectedDivisionTwoIds = [];
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
        this.selectedDivisionTwoIds = [];
      }
  }


  // ------------- Division Three --------------

  getDivisionThree(id:string|null){
    this.selectedDivisionTwoId=id;
    this.countryService.getDivisionThree(id).subscribe({
      next:(res)=>{
        if(res.status===200){
          this.divisionThreeList=res.body?.data;
          this.originalDivisionThreeList = [...res.body?.data];
        }
        else{
          this.originalDivisionThreeList=[];
          this.divisionThreeList=[];
        }
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.showError(err.status,err.error?.message);
      }
    })
  }

  onSearchDivisionThree(){
    const term = this.searchTermDivisionThree.toLowerCase();
    if (term) {
      this.divisionThreeList = this.originalDivisionThreeList.filter((item)=>item.divisionThree.toLowerCase().includes(term));
    } else {
      this.divisionThreeList = [...this.originalDivisionThreeList];
    }
  }

  submitDivisionThree(){
    this.divisionThreeForm.value.divisionTwoId=this.selectedDivisionTwoId;
    if(this.divisionThreeForm.invalid){
      this.divisionThreeForm.markAllAsTouched();
      return;
    }
    if(this.isEditMode){
      const updatedFields: any = { id: this.selectedDivisionThreeId };
      this.utilityService.setIfDirty(this.divisionThreeForm, 'divisionThree', updatedFields);
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.countryService.updateDivisionThree(updatedFields).subscribe({
        next:(res)=>{
          if(res.status===200){
            const updatedItem = res.body?.data;
            const index = this.divisionThreeList.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
              this.divisionThreeList[index] = updatedItem;
            }
            this.utilityService.success(res.body?.message || 'Activity updated.');
            this.closeModal();
          }
          else{
            this.utilityService.warning(res.body?.message);
          }
        },
        error:(err)=>{
          this.utilityService.showError(err.status,err.error?.message);
        }
      });
    }
    else{
      this.countryService.createDivisionThree(this.divisionThreeForm.value).subscribe({
        next:(res)=>{
          if(res.status===201){
            this.utilityService.success(res.body?.message);
            this.divisionThreeList.push(res.body?.data);
            this.closeModal();
          }
          else{
            this.utilityService.error(res.body?.message);
          }
        },
        error:(err)=>{
          console.log(err);
          this.utilityService.showError(err.status,err.error?.message);
          }
        })
      }
  }

  toggleDivisionThreeSelection(id:string, event:Event){
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedDivisionThreeIds.push(id);
    } else {
      this.selectedDivisionThreeIds = this.selectedDivisionThreeIds.filter(selectedId => selectedId !== id);
    }
  }

  async deleteDivisionThree(): Promise<void> {
    const message = `Delete ${this.selectedDivisionThreeIds.length} Division(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if(result.isConfirmed){
    this.countryService.deleteDivisionThree(this.selectedDivisionThreeIds).subscribe({
      next:(res)=>{
          const deletedIds: string[] = res.body?.data || [];
          this.divisionThreeList = this.divisionThreeList.filter(item => !deletedIds.includes(item.id));
          this.selectedDivisionThreeIds = [];
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }
      });
        this.selectedDivisionThreeIds = [];
      }
  }


  // ------------- Status Toggle --------------

  async toggleDivisionStatus(item: any, level: 'one' | 'two' | 'three') {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus,
    };
  
    const message = `Are you sure you want to set this division as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');
  
    if (result.isConfirmed) {
      let updateCall: Observable<any>;
  
      switch (level) {
        case 'one':
          updateCall = this.countryService.updateDivisionOneStatus(payload);
          break;
        case 'two':
          updateCall = this.countryService.updateDivisionTwoStatus(payload);
          break;
        case 'three':
          updateCall = this.countryService.updateDivisionThreeStatus(payload);
          break;
        default:
          this.utilityService.showError(400, 'Invalid division level.');
          return;
      }
  
      updateCall.subscribe({
        next: (res) => {
          if(res.status===200){
            item.status = updatedStatus;
            this.utilityService.success('Status updated successfully');
          }
          else{
            this.utilityService.warning(res.body?.message);
          }
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to update status.');
        }
      });
    }
  }
}
