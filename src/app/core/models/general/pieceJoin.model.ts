
/**
 * an interface describe piece join model
 */
export interface PieceJoin {
    type: string;
    orignalName: string;
    name: string;
    file: string;
    size?: number;
    lastModified?: number;
    lastModifiedDate?: Date;
    slice?: Blob;
}
