import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from 'src/app/core/models/general/drop-down-item.model';
import { ConversionHelper } from 'src/app/core/helpers/conversion';
import { FicheControleStatusItem } from 'src/app/core/enums/fiche-controle-status-item.enum';

@Component({
  selector: 'app-constat-murs',
  templateUrl: './constat-murs.component.html',
  styleUrls: ['../../../../../assets/components/input.scss']
})
export class ConstatMursComponent implements OnInit {

  /** form group of constat murs */
  @Input()
  form: FormGroup;

  ficheControleStatusItem: IDropDownItem<number, string>[] = [];

  constructor(  ) {  }

  ngOnInit() {
    this.chargeDropDownFicheControleStatusItem();
  }

  /** charge dropdown fiche Controle Status Item */
  chargeDropDownFicheControleStatusItem() {
    this.ficheControleStatusItem = ConversionHelper.convertEnumToListKeysValues(FicheControleStatusItem, 'number');
    this.ficheControleStatusItem.forEach(e => e.text = `FICHE_CONTROLE_STATUS_ITEM.${e.value}`);
  }
}
