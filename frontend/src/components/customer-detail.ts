import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Customer } from '../types/customer';

@customElement('customer-detail')
export class CustomerDetail extends LitElement {
	@property({ attribute: false })
	customer: Customer | null = null;
	
	protected createRenderRoot() {
	    return this;
	}
	
	render() {
	    if (!this.customer) {
	      return html`<p class="empty-message">顧客を選択してください。</p>`;
	    }

	    return html`
	      <section class="detail-panel">
	        <h2>顧客詳細</h2>
	        <dl>
	          <dt>顧客ID</dt>
	          <dd>${this.customer.customerId}</dd>

	          <dt>顧客名</dt>
	          <dd>${this.customer.customerName}</dd>

	          <dt>契約番号</dt>
	          <dd>${this.customer.contractNo}</dd>

	          <dt>回線番号</dt>
	          <dd>${this.customer.phoneNumber}</dd>

	          <dt>料金プラン</dt>
	          <dd>${this.customer.planName}</dd>

	          <dt>ステータス</dt>
	          <dd>${this.customer.lineStatus}</dd>

	          <dt>請求金額</dt>
	          <dd>${this.customer.billingAmount.toLocaleString('ja-JP')}円</dd>

	          <dt>最終通信日</dt>
	          <dd>${this.customer.lastCommunicationDate}</dd>
	        </dl>
	      </section>
	    `;
	  }
}