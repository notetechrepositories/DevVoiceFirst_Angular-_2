import { Component, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CountryService } from '../../Service/CountryService/country-service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from '../../Service/UtilityService/utility-service';

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
    private fb:FormBuilder
  ){}


  

  ngOnInit() {
    this.countryId = this.route.snapshot.paramMap.get('id');
    const navigation = this.router.getCurrentNavigation();
    console.log(navigation);

    if (navigation?.extras.state) {
      this.country = navigation.extras.state['country'];
      console.log('Country from state:', this.country);
    }

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
  }

  closeModal(){
    this.isDivisionOneModalVisible=false;
    this.isDivisionTwoModalVisible=false;
    this.isDivisionThreeModalVisible=false;
    this.isEditMode=false;
    this.divisionOneForm.reset();
    this.divisionTwoForm.reset();
    // this.divisionThreeForm.reset();
  }

  openDivisionOneModal(editItem?:any) {
    this.isDivisionOneModalVisible = true;
    this.isEditMode=!!editItem;
    this.selectedDivisionOneId=editItem?.id ||null
    if(editItem){
      console.log("working");
      
      this.divisionOneForm.patchValue({
        divisionOne:editItem.divisionOne,
        countryId:this.countryId
      })
    }
  }

  getDivisionOne(){
    this.countryService.getDivisionOne(this.countryId).subscribe({
      next:(res)=>{
        this.divisionOneList=res.body.data;
        this.originalDivisionOneList = [...res.body.data]; 
        if (this.divisionOneList.length > 0) {
          this.selectedDivisionOneId = this.divisionOneList[0].id;
          this.getDivisionTwo(this.selectedDivisionOneId); // load second-level data
        }// keep a copy of the original list
        console.log(this.divisionOneList);
      },
      error:(err)=>{
        console.log(err);
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
    console.log(this.selectedDivisionOneIds);
  }

  submitDivisionOne(){
    this.divisionOneForm.value.countryId=this.countryId;
    if(this.divisionOneForm.invalid){
      this.divisionOneForm.markAllAsTouched();
      return;
    }
    if(this.isEditMode){
      this.countryService.updateDivisionOne(this.divisionOneForm.value).subscribe({
        next:(res)=>{
          console.log(res);
        }
      })
    }
 
    this.countryService.createDivisionOne(this.divisionOneForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.status===201){
          this.utilityService.success(res.body?.message);
          this.divisionOneList.push(res.body?.data);
          this.closeModal();
        }
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.error(err.error?.message);
      }
    })
  }
  deleteDivisionOne(){
    console.log(this.selectedDivisionOneIds);
    this.countryService.deleteDivisionOne(this.selectedDivisionOneIds).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }
  // ------------- Division Two --------------
  

  getDivisionTwo(id:string|null){
    this.selectedDivisionOneId=id;
    console.log(this.selectedDivisionOneId);
    
    this.countryService.getDivisionTwo(id).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.status===200){
          this.divisionTwoList=res.body?.data;
          this.originalDivisionTwoList = [...res.body?.data];
          console.log(this.divisionTwoList);
        }
        else{
          this.originalDivisionTwoList=[];
          this.divisionTwoList=[];

        }
      }
    })
  }

  openDivisionTwoModal(editItem?:any){
    this.isDivisionTwoModalVisible = true;
    this.isEditMode=!!editItem;
    this.selectedDivisionTwoId=editItem?.id ||null
    if(editItem){
      console.log("working");
      
      this.divisionTwoForm.patchValue({
        divisionTwo:editItem.divisionTwo,
        divisionOneId:this.selectedDivisionOneId
      })
    }
  }

  submitDivisionTwo(){
    this.divisionTwoForm.value.divisionOneId=this.selectedDivisionOneId;
    if(this.divisionTwoForm.invalid){
      this.divisionTwoForm.markAllAsTouched();
      return;
    }
  if(this.isEditMode){
    this.countryService.updateDivisionTwo(this.divisionTwoForm.value).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }
  else{
    this.countryService.createDivisionTwo(this.divisionTwoForm.value).subscribe({
      next:(res)=>{
        console.log(res);
        if(res.status===201){
          this.utilityService.success(res.body?.message);
          this.divisionTwoList.push(res.body?.data);
          this.closeModal();
        }
        else{
          this.utilityService.error(res.body?.message);
        }
      },
      error:(err)=>{
        console.log(err);
        this.utilityService.error(err.error?.message);
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
  deleteDivisionTwo(){
    console.log(this.selectedDivisionTwoIds);
    this.countryService.deleteDivisionTwo(this.selectedDivisionTwoIds).subscribe({
      next:(res)=>{
        console.log(res);
      }
    })
  }
}
