import { IClient } from 'src/app/pages/clients/client.model';
import { ClientRelationType } from '../../enums/type-relation-client.enum';

export interface IClientRelation {
    id: string;
    type: ClientRelationType;
    clientId: string;
    client: IClient;
}

export interface IClientRelationModel {
    type: ClientRelationType;
    clientId: string;
    client: IClient;
}
