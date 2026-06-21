export class Company {
    constructor({
        companyId = '',
        companyName = '',
        taxId = '',
        industry = '',
        companySize = '',
        website = '',
        billingStreet = '',
        billingNumber = '',
        billingDistrict = '',
        billingCity = '',
        billingCountry = '',
        billingPostalCode = ''
    } = {}) {
        this.companyId = companyId;
        this.companyName = companyName;
        this.taxId = taxId;
        this.industry = industry;
        this.companySize = companySize;
        this.website = website;
        this.billingStreet = billingStreet;
        this.billingNumber = billingNumber;
        this.billingDistrict = billingDistrict;
        this.billingCity = billingCity;
        this.billingCountry = billingCountry;
        this.billingPostalCode = billingPostalCode;
    }
}
