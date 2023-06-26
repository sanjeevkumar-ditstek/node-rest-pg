export default interface user {
	id?: string;
	name: string;
	email: string;
	password: string;
	roleId: string;
	language: string;
	role?: {
		id: string,
		name: string,
		createdAt: string,
		updatedAt: string
	},
	user_company_warehouse?: {
		companyId: string,
		warehouseId: string
	}
}
