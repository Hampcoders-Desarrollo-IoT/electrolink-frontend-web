export const BusinessRole = Object.freeze({
    HOMEOWNER: 'HOMEOWNER',
    TECHNICIAN: 'TECHNICIAN',
    COMPANY: 'COMPANY',

    isValid(value) {
        return Object.values(this).includes(value);
    }
});
