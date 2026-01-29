import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EmploidutempsService } from '../../../service/emploidutemps.service';
import { Emploidutemps } from '../../../model/emploidutemps';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {

  form!: FormGroup;
  id!: number;
  loading = false;
  origin = 'temps'; 

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private emploiService: EmploidutempsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.origin = this.route.snapshot.queryParamMap.get('from') || 'temps';

    this.form = this.fb.group({
      jour: ['', Validators.required],
      heuredebut: ['', Validators.required],
      heurefin: ['', Validators.required]
    });

    this.loadEmploi();
  }

  loadEmploi(): void {
    this.loading = true;
    this.emploiService.getById(this.id).subscribe({
      next: (res: Emploidutemps) => {
        this.form.patchValue({
          jour: res.jour,
          heuredebut: res.heuredebut,
          heurefin: res.heurefin
        });
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  submit(): void {
    if (this.form.invalid) return;

    this.emploiService.update(this.id, {
      ...this.form.value
    } as Emploidutemps).subscribe(() => {
      this.router.navigate(['/temps', this.origin]);
    });
  }

  cancel(): void {
    this.router.navigate(['/temps', this.origin]);
  }
}
