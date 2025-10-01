import { Component,OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Academie } from '../../../model/academie.model';
import { AcademieService } from '../../../service/academie.service'
import { AnneeuvService } from '../../../service/anneeuv.service';
import { ClasseecoleService } from '../../../service/classeecole.service';
import {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  TemplateIdDirective
} from '@coreui/angular';
import { Anneeuv } from '../../../../../../adminsup/src/app/model/anneeuv.model';
import { Classeecole } from '../../../model/classeecole.model';
import { Classe } from '../../../model/classe.model';
import { AuthService } from '../../../service/auth.service';
import { User } from '../../../model/user.model';
import { RegionService } from '../../../service/region.service';
import { CercleService } from '../../../service/cercle.service';
import { Region } from '../../../model/region.model';
import { Cercle } from '../../../model/cercle.model';
import { Cap } from '../../../model/cap.model';
import { CapService } from '../../../service/cap.service';
@Component({
  selector: 'docs-elevecreation',
  templateUrl: './elevecreation.component.html',
  styleUrls: ['./elevecreation.component.scss'],
  standalone: true,
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    AccordionButtonDirective,
    NgSelectModule
  ]
})
export class ElevecreationComponent implements OnInit {

  user!: User;
  academies: Academie[] = []
  anneeuvs: Anneeuv[] = []
  classes: Classe[] = []
  regions: Region[] = []
  cercles: Cercle[] = []
  caps: Cap[] = []

  ngOnInit(): void {
    this.loadData();
  }

  constructor(
    private academieService: AcademieService,
    private anneeuvService: AnneeuvService,
    private authService: AuthService,
    private classeecoleService: ClasseecoleService,
    private regionservice: RegionService,
    private cercleservice: CercleService,
    private capservice: CapService
  ){}

  loadData(): void{
    this.user = this.authService.getUserFromLocalStorage();
    const ecoleId = this.user.administrateur.ecole.idEcole;

    this.academieService.getAll().subscribe({
      next: (data) => { this.academies = data}
    })
    this.anneeuvService.getAllAnnee().subscribe({
      next: (data) => { this.anneeuvs = data}
    })
    this.classeecoleService.getClasseEcole(ecoleId).subscribe({
      next: (data) => { this.classes = data}
    })
    this.regionservice.getRegions().subscribe({
      next: (data) => { this.regions = data }
    })
    this.cercleservice.getCercles().subscribe({
      next: (data) => { this.cercles = data }
    })
    this.capservice.getCercles().subscribe({
      next: (data) => { this.caps = data }
    })
  }

}

