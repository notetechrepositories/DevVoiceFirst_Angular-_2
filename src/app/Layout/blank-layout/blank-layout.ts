import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-blank-layout',
 imports: [RouterOutlet,CommonModule],
  templateUrl: './blank-layout.html',
  styleUrl: './blank-layout.css'
})
export class BlankLayout {

}
