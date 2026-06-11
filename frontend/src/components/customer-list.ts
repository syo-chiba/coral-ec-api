import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Customer } from '../types/customer';

const lineStatusLabels: Record<Customer['lineStatus'], string> = {
  ACTIVE: '利用中',
  SUSPENDED: '停止中',
  CANCELLED: '解約済み'
};

@customElement('customer-list')
export class CustomerList extends LitElement {
  @property({ attribute: false })
  customers: Customer[] = [];

  protected createRenderRoot() {
    return this;
  }

  render() {
    if (this.customers.length === 0) {
      return html`<p class="empty-message">該当する顧客が存在しません。</p>`;
    }

    return html`
      <table class="customer-table" aria-label="顧客検索結果">
        <thead>
          <tr>
            <th>顧客ID</th>
            <th>顧客名</th>
            <th>契約番号</th>
            <th>回線番号</th>
            <th>料金プラン</th>
            <th>ステータス</th>
            <th>請求金額</th>
            <th>最終通信日</th>
          </tr>
        </thead>
        <tbody>
          ${this.customers.map(
            (customer) => html`
              <tr>
                <td>${customer.customerId}</td>
                <td>${customer.customerName}</td>
                <td>${customer.contractNo}</td>
                <td>${customer.phoneNumber}</td>
                <td>${customer.planName}</td>
                <td><span class="status ${customer.lineStatus.toLowerCase()}">${lineStatusLabels[customer.lineStatus]}</span></td>
                <td>${customer.billingAmount.toLocaleString('ja-JP')}円</td>
                <td>${customer.lastCommunicationDate}</td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'customer-list': CustomerList;
  }
}
