export const ProfileStatus = Object.freeze({
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    INCOMPLETE: 'Incomplete',

    isValid(value) {
        return Object.values(this).includes(value);
    }
});
