import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './customer-list';
import './customer-detail';
import { getCustomer, searchCustomers } from '../services/customer-api';
import type { Customer } from '../types/customer';

@customElement('customer-search')
export class CustomerSearch extends LitElement {
  @state()
  private keyword = '';

  @state()
  private customers: Customer[] = [];

  @state()
  private loading = false;

  @state()
  private errorMessage = '';
  
  @state()
  private selectedCustomer: Customer | null = null;
  
  @state()
  private detailLoading = false;
  
  @state()
  private detailErrorMessage = '';

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    void this.executeSearch();
  }

  render() {
    return html`
      <section class="search-panel" aria-labelledby="customer-search-title">
        <div class="panel-heading">
          <p class="eyebrow">通信事業者向け業務システム</p>
          <h1 id="customer-search-title">顧客検索</h1>
          <p class="description">顧客名・契約番号・回線番号で契約回線情報を検索します。</p>
        </div>

        <form class="search-form" @submit=${this.onSubmit}>
          <label for="keyword">検索キーワード</label>
          <div class="search-controls">
            <input
              id="keyword"
              type="search"
              .value=${this.keyword}
              @input=${this.onInput}
              placeholder="例: 山田太郎 / CT-1001 / 090-1111-2222"
              ?disabled=${this.loading}
            />
            <button type="submit" ?disabled=${this.loading}>
              ${this.loading ? '検索中...' : '検索'}
            </button>
          </div>
        </form>
		
		${this.errorMessage
		  ? html`<p class="error-message" role="alert">${this.errorMessage}</p>`
		  : null}

		${this.loading
		  ? html`<p class="loading-message">顧客情報を取得しています...</p>`
		  : html`
		      <customer-list
		        .customers=${this.customers}
		        @customer-selected=${this.onCustomerSelected}
		      ></customer-list>
		    `}

		${this.detailErrorMessage
		  ? html`<p class="error-message" role="alert">${this.detailErrorMessage}</p>`
		  : null}

		  ${this.detailLoading
		    ? html`<p class="loading-message">顧客詳細を取得しています...</p>`
		    : html`<customer-detail .customer=${this.selectedCustomer}></customer-detail>`}
      </section>
    `;
  }

  private onInput(event: Event) {
    this.keyword = (event.target as HTMLInputElement).value;
  }

  private onSubmit(event: Event) {
    event.preventDefault();
    void this.executeSearch();
  }

  private async executeSearch() {
    this.loading = true;
    this.errorMessage = '';
    this.selectedCustomer = null;
    this.detailErrorMessage = '';

    try {
      this.customers = await searchCustomers(this.keyword);
    } catch {
      this.customers = [];
      this.errorMessage = '顧客検索に失敗しました。時間をおいて再度お試しください。';
    } finally {
      this.loading = false;
    }
  }
  
  private async onCustomerSelected(event: CustomEvent<{ customerId: string }>) {
    this.detailLoading = true;
    this.detailErrorMessage = '';

    try {
      this.selectedCustomer = await getCustomer(event.detail.customerId);
    } catch {
      this.selectedCustomer = null;
      this.detailErrorMessage = '顧客詳細の取得に失敗しました。時間をおいて再度お試しください。';
    } finally {
      this.detailLoading = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'customer-search': CustomerSearch;
  }
}
