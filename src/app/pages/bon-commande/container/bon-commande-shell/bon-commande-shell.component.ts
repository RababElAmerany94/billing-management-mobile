import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevisType } from 'src/app/core/enums/devis-type.enum';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { IPagedResult } from 'src/app/core/models/general/result-model';
import { IDossier } from 'src/app/pages/dossier/dossier.model';
import { BaseContainerComponent } from 'src/app/shared/base-features/base-container.component';
import { IBonCommande, IBonCommandeModel } from '../../bon-commande.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslationService } from 'src/app/core/services/translation.service';
import { ToastService, ToastTypes } from 'src/app/core/services/toast.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { NumerotationService } from 'src/app/core/services/numerotation-service/numerotation.service';
import { TranslateService } from '@ngx-translate/core';
import { BonCommandeService } from '../../bon-commande.service';
import { StringHelper } from 'src/app/core/helpers/string';
import { ModeEnum } from 'src/app/core/enums/mode.enum';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { FileHelper } from 'src/app/core/helpers/file';
import { IMailModel } from 'src/app/core/models/general/mail.model';
import { NumerationType } from 'src/app/core/enums/numerotation.enum';
import { DateHelper } from 'src/app/core/helpers/date';
import { BonCommandeHelper } from 'src/app/core/helpers/bon-commande';
import { BonCommandeStatus } from 'src/app/core/enums/bon-commande-status.enum';
import { RouteName } from 'src/app/core/enums/route.enum';
import { DevisRouteActions } from 'src/app/core/enums/devis-route-actions.enum';

@Component({
  selector: 'app-bon-commande-shell',
  templateUrl: './bon-commande-shell.component.html'
})
export class BonCommandeShellComponent extends BaseContainerComponent {

  /** FormGroup */
  form: FormGroup;

  /** bons de commande list */
  bonCommandePagedResult: IPagedResult<IBonCommande>;

  /** the current de commande to modify */
  bonCommande: IBonCommande;

  /** the filter of de commande */
  filterOption: IFilterOption;

  /** the type of bonCommande */
  type: DevisType;

  /** the dossier associate with this of bonCommande */
  dossier: IDossier;

  /** is in mode duplique bonCommande */
  isDupliquer = false;

  constructor(
    private bonCommandeService: BonCommandeService,
    protected translate: TranslateService,
    protected numerationService: NumerotationService,
    private translationService: TranslationService,
    protected toastService: ToastService,
    private loadingService: LoadingService,
    private fb: FormBuilder,
    public router: Router,
    private route: ActivatedRoute,
    protected location: Location
  ) {
    super(toastService, translate, router, location);
    this.setModule(this.modules.BonCommande);
    this.translationService.setLanguage(this.translate);
    this.subscribeRouteChanges();
  }

  //#region route

  /**
   * subscribe route changes
   */
  async subscribeRouteChanges() {
    const data = this.router.getCurrentNavigation() != null ? this.router.getCurrentNavigation().extras.state : null;
    this.route.queryParams.subscribe(queryParams => {
      if (!StringHelper.isEmptyOrNull(queryParams.mode)) {
        const mode = parseInt(queryParams.mode, 10) as ModeEnum;
        this.isNavigationRoute = queryParams.isNavigationRoute === 'true';
        switch (mode) {

          case ModeEnum.List:
            this.modeList();
            break;

          case ModeEnum.Add:
            if (!queryParams.isNavigationRoute && !this.isAddMode()) {
              this.addEvent();
            } else if (!this.isAddMode()) {
              this.addEvent(data.type == null ? DevisType.Normal : data.type);
              this.dossier = data.dossier;
            }
            break;

          case ModeEnum.Edit:
            this.editEvent(queryParams.id);
            break;

          case ModeEnum.Show:
            this.showEvent(queryParams.id);
            break;

          case ModeEnum.Delete:
            this.deleteBonCommande(queryParams.id);
            break;

        }
      }
    });
  }

  //#endregion

  //#region forms

  /**
   * initialize form
   */
  initForm() {
    this.form = this.fb.group({
      reference: [null, [Validators.required]],
      dateVisit: [DateHelper.formatDate(new Date().toString()), [Validators.required]],
      note: [null],
      userId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      siteIntervention: [null],
      dateSignature: [null],
      signe: [null],
      nameClientSignature: [null],
      raisonAnnulation: [null],
    });
  }

  /**
   * set bonCommande form
   */
  setBonCommandeForm(bonCommande: IBonCommande) {
    this.form.patchValue({
      reference: bonCommande.reference,
      dateVisit: bonCommande.dateVisit,
      note: bonCommande.note,
      dateSignature: bonCommande.dateSignature,
      signe: bonCommande.signe,
      nameClientSignature: bonCommande.nameClientSignature,
      siteIntervention: bonCommande.siteIntervention,
      clientId: bonCommande.client.fullName,
      raisonAnnulation: bonCommande.raisonAnnulation,
      userId: bonCommande.user != null ? bonCommande.user.id : null,
    });
  }

  //#endregion

  //#region service

  /**
   * get list folders as paged
   * @param filter display all folders
   */
  getBonCommande(filter: IFilterOption) {
    this.loading = true;
    this.bonCommandeService.GetAsPagedResult(filter).subscribe(result => {
      this.loading = false;
      if (result.status === ResultStatus.Succeed) {
        this.bonCommandePagedResult = result;
        this.filterOption = filter;
      } else {
        this.toastErrorServer();
      }
    }, _ => this.loading = false);
  }

  /**
   * get bonCommande by id
   */
  async getBonCommandeById(id: string, callback: (result: IBonCommande) => void) {
    await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
    this.bonCommandeService.Get(id).subscribe(async result => {
      await this.loadingService.hide();
      if (result.status === ResultStatus.Succeed) {
        callback(result.value);
      } else {
        this.toastErrorServer();
      }
    }, async _ => await this.loadingService.hide());
  }

  /**
   * Add folder action
   */
  async addBonCommande(bonCommandeModel: IBonCommandeModel) {
    await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
    BonCommandeHelper.CheckReferenceIsUnique(this.bonCommandeService, this.toastService, bonCommandeModel, this.translate, null, true,
      async (checkResult: boolean) => {
        if (checkResult) {
          this.bonCommandeService.Add(bonCommandeModel).subscribe(async result => {
            await this.loadingService.hide();
            if (result.hasValue) {
              this.toastAddSuccess();
              this.cancel();
            } else {
              this.toastErrorServer();
            }
          }, async _ => await this.loadingService.hide());
        } else {
          await this.loadingService.hide();
        }
      });
  }

  /**
   * Update folder
   */
  async updateBonCommande(bonCommandeModel: IBonCommandeModel) {
    await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
    BonCommandeHelper.CheckReferenceIsUnique(this.bonCommandeService,
      this.toastService, bonCommandeModel, this.translate, this.bonCommande, false,
      async (checkResult: boolean) => {
        if (checkResult) {
          this.bonCommandeService.Update(this.bonCommande.id, bonCommandeModel).subscribe(async result => {
            await this.loadingService.hide();
            if (result.hasValue) {
              this.toastEditSuccess();
              this.cancel();
            } else {
              this.toastErrorServer();
            }
          }, async _ => await this.loadingService.hide());
        } else {
          await this.loadingService.hide();
        }
      });
  }

  /**
   * generate reference bonCommande
   */
  generateReference() {
    this.subs.sink = this.numerationService.GenerateNumerotation(NumerationType.BONCOMMANDE)
      .subscribe(item => {
        if (item.status === ResultStatus.Succeed) {
          this.form.get('reference').setValue(item.value);
        }
      });
  }

  /**
   * delete bonCommande
   */
  async deleteBonCommande(id: string) {
    await this.loadingService.show(this.translate.instant('LABELS.PLEASE_WAIT'));
    this.subs.sink = this.bonCommandeService.Delete(id).subscribe(async result => {
      await this.loadingService.hide();
      if (result.status === ResultStatus.Succeed) {
        this.toastDeleteSuccess();
        this.cancel();
      } else {
        this.toastErrorServer();
      }
    }, async _ => await this.loadingService.hide());
  }

  /**
   * change status bon commande
   */
  markBonCommandeAnnuler(bonCommande: IBonCommande) {
    this.subs.sink = this.bonCommandeService.Get(bonCommande.id)
      .subscribe(result => {
        if (result.status === ResultStatus.Succeed) {
          result.value.raisonAnnulation = bonCommande.raisonAnnulation;
          result.value.status = BonCommandeStatus.Annule;
          this.bonCommandeService.Update(bonCommande.id, result.value).subscribe(res => {
            if (res.hasValue) {
              this.toastEditSuccess();
              this.showEvent(bonCommande.id);
            } else {
              this.toastErrorServer();
            }
          });
        } else {
          this.toastErrorServer();
        }
      });
  }

  /**
   * transfer bonCommande to devis
   */
  transferBonCommandeToDevis(data: IBonCommande) {
    const navigationExtras: NavigationExtras = {
      state: {
        bonCommande: data
      },
      queryParams: {
        mode: DevisRouteActions.TransferBonCommandeToDevis,
      }
    };
    this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
  }

  //#endregion

  //#region events

  /**
   * download pdf event
   */
  downloadPdfEvent() {
    this.subs.sink = this.bonCommandeService.DownloadPdf(this.bonCommande.id).subscribe(result => {
      if (result.status === ResultStatus.Succeed) {
        FileHelper.downloadPDF(result.value, 'BonCommande');
      } else {
        this.toastErrorServer();
      }
    });
  }

  /**
   * print bonCommande
   */
  printBonCommande() {
    this.subs.sink = this.bonCommandeService.DownloadPdf(this.bonCommande.id).subscribe(result => {
      if (result.status === ResultStatus.Succeed) {
        FileHelper.printPdf(result.value, 'BonCommande');
      } else {
        this.toastErrorServer();
      }
    });
  }

  /**
   * send email
   * @param mailModel the mail model
   */
  async sendEmail(mailModel: IMailModel) {
    await this.loadingService.show(this.translate.instant('EMAILS.SENDING_EMAIL'));
    this.bonCommandeService.SendEmail(this.bonCommande.id, mailModel)
      .subscribe(async result => {
        await this.loadingService.hide();
        if (result.status === ResultStatus.Succeed) {
          this.bonCommande.emails = result.value;
          this.toastService.presentToast({ message: this.translate.instant('SUCCESS.SEND_EMAIL'), type: ToastTypes.Success });
        } else {
          this.toastErrorServer();
        }
      }, async _ => {
        this.toastErrorServer();
        await this.loadingService.hide();
      });
  }

  /**
   * add event
   */
  addEvent(type: DevisType = DevisType.Normal) {
    if (!this.isDupliquer) {
      this.bonCommande = null;
    }
    this.type = type == null ? DevisType.Normal : type;
    this.initForm();
    if (this.isDupliquer && this.bonCommande) {
      this.setBonCommandeForm(this.bonCommande);
    }
    this.generateReference();
    this.modeAdd();
  }

  /**
   * show event
   */
  async showEvent(id: string) {
    this.initForm();
    this.getBonCommandeById(id, (bonCommande) => {
      this.bonCommande = bonCommande;
      this.type = this.bonCommande.type;
      this.setBonCommandeForm(this.bonCommande);
      this.form.disable();
      this.modeShow(id);
    });
  }

  /**
   * edit event
   */
  async editEvent(id: string) {
    this.initForm();
    this.getBonCommandeById(id, (bonCommande) => {
      this.bonCommande = bonCommande;
      this.type = this.bonCommande.type;
      this.setBonCommandeForm(this.bonCommande);
      this.modeEdit(id);
    });
  }

  /**
   *  dupliquer event
   */
  async dupliquer(bonCommande: IBonCommande) {
    await this.getBonCommandeById(bonCommande.id, (result) => {
      this.bonCommande = result;
      this.initForm();
      this.isDupliquer = true;
      this.addEvent(this.bonCommande.type);
    });
  }

  public cancel() {
    if (this.isNavigationRoute) {
      this.location.back();
    } else {
      this.getBonCommande(this.filterOption);
      this.modeList();
    }
  }

  //#endregion

}
