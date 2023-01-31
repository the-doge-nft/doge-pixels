type DateTime = string;

export interface GetAddress {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  final_balance: number;
  n_tx: number;
  unconfirmed_n_tx: number;
  final_n_tx: number;
  txrefs: Array<TxRef>;
  tx_url: string;
}

interface TxRef {
  tx_hash: string;
  block_height: number;
  tx_input_n: number;
  tx_output_n: number;
  value: number;
  ref_balance: number;
  confirmations: number;
  confirmed: DateTime;
  double_spend: number;
}

interface Input {
  addresses: Array<string>;
  age: number;
  output_index: number;
  output_value: number;
  prev_hash: string;
  script: string;
  script_type: string;
  sequence: number;
}

interface Output {
  addresses: Array<string>;
  script: string;
  script_type: string;
  value: number;
}

export interface ConfirmedTx {
  addresses: Array<string>;
  block_hash: string;
  block_height: number;
  block_index: number;
  conrimations: number;
  confirmed: boolean;
  double_spend: boolean;
  fees: number;
  hash: string;
  inputs: Array<Input>;
  outputs: Array<Output>;
  preference: string;
  received: DateTime;
  relayed_by: string;
  size: number;
  total: number;
  ver: number;
  vin_sz: number;
  vout_sz: number;
}
