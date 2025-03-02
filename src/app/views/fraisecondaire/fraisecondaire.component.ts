import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fraisecondaire',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './fraisecondaire.component.html',
  styleUrl: './fraisecondaire.component.scss'
})
export class FraisecondaireComponent implements OnInit {
  fraisScolaireForm: FormGroup;
  classes: any[] = [];
  annees: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.fraisScolaireForm = this.fb.group({
      classe: ['', Validators.required],
      annee: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  

 

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
