import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SupportDeCoursService } from '../../../service/supportDeCours.service';
import { ChapitreMeta, SupportDeCours, SupportDTO } from '../../../model/supportDeCours';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms'; // Import FormsModule
@Component({
  selector: 'app-gestion',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    DragDropModule
  ],
  templateUrl: './gestion.component.html',
  styleUrl: './gestion.component.scss'
})
export class GestionComponent implements OnInit{
  supports: any[] = [];

  constructor(private svc: SupportDeCoursService) {}

  ngOnInit() { this.load(); }

  load() { this.svc.getAll().subscribe((res:any) => this.supports = res); }

  delete(id: number) {
    if (!confirm('Supprimer ?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
