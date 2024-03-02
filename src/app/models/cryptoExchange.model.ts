export interface CryptoExchangeModel {
  asset_id_base: string;
  rates: [
    {
      asset_id_quote: string;
      rate: number;
    }
  ];
}
