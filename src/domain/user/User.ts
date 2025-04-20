export default class User {
	constructor(protected name: string, protected institutionalEmail: string) {}

	getName(): string {
		return this.name
	}

	getInstitutionalEmail(): string {
		return this.institutionalEmail
	}
}