import { Component } from '@angular/core';
import {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  TemplateIdDirective
} from '@coreui/angular';

@Component({
  selector: 'docs-elevecreation',
  templateUrl: './elevecreation.component.html',
  styleUrls: ['./elevecreation.component.scss'],
  standalone: true,
  imports: [
    AccordionComponent,
    AccordionItemComponent,
    TemplateIdDirective,
    AccordionButtonDirective
  ]
})
export class ElevecreationComponent {

  items = [1, 2, 3, 4];

}

