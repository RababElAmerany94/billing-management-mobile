import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { IContact } from 'src/app/core/models/general/contacts.model';
import { ModalController, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AddContactComponent } from './add-contact/add-contact.component';
import { DialogHelper } from 'src/app/core/helpers/dialog';
import { StringHelper } from 'src/app/core/helpers/string';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./../../../assets/components/card-content.scss'],
})
export class ContactsComponent implements OnInit {

  // List des contacts
  @Input()
  contacts: IContact[] = [];

  // output list contacts
  @Output()
  changeContact = new EventEmitter();

  @Input()
  mode: ModeEnum;

  modes: typeof ModeEnum = ModeEnum;

  constructor(
    public modalController: ModalController,
    public translate: TranslateService,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
  }

  /** add contact dialog contact */
  async addContactDialog(i: number) {
    const data = {
      contact: i !== -1 ? this.contacts[i] : null
    };
    DialogHelper.openDialog(this.modalController, AddContactComponent, data).then(result => {
      if (!StringHelper.isEmptyOrNull(result)) {
        if (result.isDefault) { this.updateIsDefaultContact(); }
        if (this.contacts.length === 0) { result.isdefault = true; }
        (i === -1) ? this.contacts.push(result) : this.contacts[i] = result;
        this.emitChange();
      }
    });
  }

  /** delete contact */
  deleteContacts(i: number) {
    const contact = this.contacts[i];
    DialogHelper.presentAlert(
      this.alertController,
      this.translate,
      {
        headerText: this.translate.instant('CONTACTS.DELETE.HEADER_TEXT'),
        message: this.translate.instant('CONTACTS.DELETE.QUESTION') + ' : ' + contact.nom.toUpperCase() + ' '
          + contact.prenom.toUpperCase() + ' ? ',
        done: async () => {
          this.contacts.splice(i, 1);
          this.emitChange();
        },
        cancel: () => {
        }
      }
    );
  }
  /** emit changes */
  emitChange() {
    this.changeContact.emit(this.contacts);
  }

  /** apdate default contact */
  updateIsDefaultContact() {
    if (this.contacts !== undefined) {
      this.contacts.map(e => e.isDefault = false);
    }
  }
  // is show mode
  isShowMode = () => this.mode === ModeEnum.Show;
}
