import { Component, OnInit, Input } from '@angular/core';
import { PopoverItem } from 'src/app/core/models/general/popover.model';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {

  /** elements de la list */
  @Input()
  items: PopoverItem[] = [];

  constructor(public popoverCtrl: PopoverController) { }

  ngOnInit(): void { }

  /** handler action popover */
  actionItem(action: () => void): void {
    this.popoverCtrl.dismiss();
    action();
  }


}
