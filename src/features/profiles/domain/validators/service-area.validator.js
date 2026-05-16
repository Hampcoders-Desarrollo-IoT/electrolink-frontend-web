export function validateServiceArea(lat, lon, radiusKm) {
    const errors = {};
    if (lat == null || lat < -90 || lat > 90) {
        errors.centerLatitude = 'profiles.errors.invalid_latitude';
    }
    if (lon == null || lon < -180 || lon > 180) {
        errors.centerLongitude = 'profiles.errors.invalid_longitude';
    }
    if (radiusKm == null || radiusKm <= 0 || radiusKm > 100) {
        errors.radiusKm = 'profiles.errors.invalid_radius';
    }
    return { valid: Object.keys(errors).length === 0, errors };
}
