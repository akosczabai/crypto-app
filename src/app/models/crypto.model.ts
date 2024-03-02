import { CryptoHistoryModel } from './cryptoHistory.model';

export interface CryptoModel {
  name: string;
  rate: number;
  historicalData?: CryptoHistoryModel[];
}
