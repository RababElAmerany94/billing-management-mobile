import { Component, OnInit, Inject } from '@angular/core';
import { IArticle } from 'src/app/core/models/general/article.model';
import { SubSink } from 'subsink';
import { CalculationToken, ICalculation } from 'src/app/core/helpers/calculation/icalculation';
import { CopyHelper } from 'src/app/core/helpers/copy';
import { IFilterOption } from 'src/app/core/models/general/filter-option.model';
import { SortDirection } from 'src/app/core/enums/sort-direction';
import { AppSettings } from 'src/app/app-settings/app-settings';
import { NavParams, ModalController } from '@ionic/angular';
import { ResultStatus } from 'src/app/core/enums/result-status';
import { ToastService } from 'src/app/core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ProduitService } from 'src/app/core/services/produit-service/produit.service';
import { ProduitHelper } from 'src/app/core/helpers/produit';
import { ArticleType } from 'src/app/core/enums/article-type.enum';
import { SpecialArticleService } from 'src/app/core/services/special-article.service';

@Component({
  selector: 'app-select-article',
  templateUrl: './select-article.component.html',
  styleUrls: ['./select-article.component.scss',
    '../../../../assets/components/lists.scss']
})
export class SelectArticleComponent implements OnInit {

  subs = new SubSink();

  /**
   * type of article in select Dialog
   */
  type = ArticleType.Produit;

  /** skeleton length for loading data */
  skeletonLength = new Array(30).fill(0);

  /** loading */
  loading = false;

  /** the list of articles */
  articles: IArticle[] = [];

  /** set input article */
  inputArticles: IArticle[] = [];

  /** load more article */
  choiceInputArticles = false;

  /** the number of page */
  pageCount = 1;

  /** page number */
  page = 1;

  /** test if finished scroll or not */
  finished = false;

  /** the filter option of prestations */
  filterOption: IFilterOption = {
    OrderBy: 'designation',
    SortDirection: SortDirection.Asc,
    Page: 1,
    PageSize: AppSettings.DEFAULT_PAGE_SIZE,
    SearchQuery: ''
  };

  constructor(
    @Inject(CalculationToken) private calculation: ICalculation,
    private produitService: ProduitService,
    private modalController: ModalController,
    private toastService: ToastService,
    private translate: TranslateService,
    private specialArticleService: SpecialArticleService,
    private navParams: NavParams) {
    const articles = this.navParams.get('articles');
    const type = this.navParams.get('type');
    this.initializeData(articles);
  }

  ngOnInit() {
    this.initializeComponent('');
  }

  //#region actions

  /**
   * initialize data component
   */
  initializeData(articles) {
    if (articles != null) {
      this.articles = CopyHelper.copy(articles);
      this.inputArticles = CopyHelper.copy(articles);
    }
  }

  /**
   * add quantity to article
   * @param index index of article in array
   * @param qte the qte to add to article
   */
  addQuantity(index: number, qte: number) {
    const article = CopyHelper.copy(this.articles[index]);
    article.qte += qte;
    if (this.choiceInputArticles && this.inputArticles[index].qte < article.qte) {
      return;
    }
    if (article.qte >= 0) {
      this.articles[index].qte = article.qte;
      this.articles[index].totalHT = this.calculation.totalHTArticle(article);
      this.articles[index].totalTTC = this.calculation.totalTTCArticle(article);
    }
  }
  //#endregion

  //#region services

  /**
   * initialize parameters of component
   * @param searchQuery the search query
   */
  initializeComponent(searchQuery: string) {
    this.articles = this.articles.filter(e => e.qte > 0);
    this.filterOption.Page = 1;
    this.filterOption.SearchQuery = searchQuery;
    this.getProduits(this.filterOption);
  }

  /** get list of prestation */
  async getProduits(filterOption: IFilterOption) {
    this.loading = true;
    if (this.type === ArticleType.Produit) {
      this.subs.sink = this.produitService.GetAsPagedResult(filterOption).subscribe(async result => {
        if (result.status === ResultStatus.Succeed) {
          const articles = await result.value.map(e => ProduitHelper.mapProduitToArticle(e))
            .filter(e => this.articles.filter(a => a.id === e.id && a.type === e.type).length === 0);
          this.articles = [...this.articles, ...articles];
          this.pageCount = result.pageCount;
          this.loading = false;
        } else {
          this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
          this.loading = false;
        }
      });
    } else {
      this.subs.sink = this.specialArticleService.GetAsPagedResult(filterOption).subscribe(async result => {
        if (result.status === ResultStatus.Succeed) {
          const articles = await result.value.map(e => ProduitHelper.mapSpecialArticleToArticle(e))
            .filter(e => this.articles.filter(a => a.id === e.id && a.type === e.type).length === 0);
          this.articles = [...this.articles, ...articles];
          this.pageCount = result.pageCount;
          this.loading = false;
        } else {
          this.toastService.presentToast({ message: this.translate.instant('ERRORS.SERVER') });
          this.loading = false;
        }
      });
    }


  }
  //#endregion services

  //#region helper


  searchValue(searchQuery: string) {
    this.filterOption.SearchQuery = searchQuery;
    this.initializeComponent(searchQuery);
  }
  /** dismiss modal controllar */
  async Dismiss(value) {
    await this.modalController.dismiss(value);
  }

  /** close modal controller with data */
  async chargeArticle() {
    await this.modalController.dismiss(this.articles.filter(e => e.qte > 0));
  }

  /** load more data */
  loadMoreData(infiniteScroll) {
    if (this.page === this.pageCount) {
      this.finished = true;
    } else {
      this.finished = false;
    }
    this.filterOption.Page = this.page++;
    this.getProduits(this.filterOption);
    infiniteScroll.target.complete();
    infiniteScroll.disabled = this.articles.length <= AppSettings.DEFAULT_PAGE_SIZE;
  }

  //#endregion
}
