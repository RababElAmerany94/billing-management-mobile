import { ChangesHistoryType } from '../../enums/change-history-type.enum';


export interface IHistorique {
    changeDate: Date;
    userId: number;
    action: ChangesHistoryType;
    fields: IField[];
}

export interface IField {
    fieldName: string;
    after: string;
    before: string;
}
