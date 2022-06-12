import { PieceJoin } from './pieceJoin.model';

/**
 * an interface describe memo model
 */
export interface Memo {
    userId: string;
    date: Date | string;
    commentaire: string;
    pieceJointes: PieceJoin[];
}

export interface AddMemoModalOutput {
    memo: Memo;
    removedFiles: PieceJoin[];
}
