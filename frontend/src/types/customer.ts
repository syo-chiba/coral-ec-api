export type LineStatus = 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export type Customer = {
  customerId: string;
  customerName: string;
  contractNo: string;
  phoneNumber: string;
  planName: string;
  lineStatus: LineStatus;
  billingAmount: number;
  lastCommunicationDate: string;
};
