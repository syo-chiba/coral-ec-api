import type { Customer } from '../types/customer';

export async function searchCustomers(keyword: string): Promise<Customer[]> {
  const params = new URLSearchParams();

  if (keyword.trim()) {
    params.set('keyword', keyword.trim());
  }

  const queryString = params.toString();
  const response = await fetch(`/api/customers${queryString ? `?${queryString}` : ''}`);

  if (!response.ok) {
    throw new Error('顧客検索APIでエラーが発生しました');
  }

  return response.json() as Promise<Customer[]>;
}

export async function getCustomer(customerId: string): Promise<Customer> {
	const response =await fetch(`/api/customers/${encodeURIComponent(customerId)}`);
	
	if (!response.ok) {
		throw new Error('顧客詳細APIでエラーが発生しました');
	}
	return response.json() as Promise<Customer>;
}
