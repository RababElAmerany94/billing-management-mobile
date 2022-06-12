import { Memo } from './memo.model';
import { ICategoryDocument } from './category-document.model';

/**
 * an interface describe memo dossier model
 */
export interface MemoDossier extends Memo {
    name: string;
    category: ICategoryDocument;
}
