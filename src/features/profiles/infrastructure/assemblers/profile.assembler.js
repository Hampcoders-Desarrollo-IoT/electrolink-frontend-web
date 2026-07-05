import { Profile } from '../../domain/entities/profile.entity.js';
import { Technician } from '../../domain/entities/technician.entity.js';
import { Homeowner } from '../../domain/entities/homeowner.entity.js';
import { Company } from '../../domain/entities/company.entity.js';

export class ProfileAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;

        const technician = resource.technician ? new Technician({
            technicianId: resource.technician.technicianId,
            specialties: resource.technician.specialties,
            experienceYears: resource.technician.experienceYears,
            aboutMe: resource.technician.aboutMe,
            centerLatitude: resource.technician.centerLatitude,
            centerLongitude: resource.technician.centerLongitude,
            radiusKm: resource.technician.radiusKm
        }) : null;

        const homeowner = resource.homeowner ? new Homeowner({
            homeownerId: resource.homeowner.homeownerId,
            preferredContactTime: resource.homeowner.preferredContactTime,
            smsNotifications: resource.homeowner.smsNotifications,
            emailNotifications: resource.homeowner.emailNotifications,
            pushNotifications: resource.homeowner.pushNotifications,
            emergencyContact: resource.homeowner.emergencyContact || null
        }) : null;

        const company = resource.company ? new Company({
            companyId: resource.company.companyId,
            companyName: resource.company.companyName,
            taxId: resource.company.taxId,
            industry: resource.company.industry,
            companySize: resource.company.companySize,
            website: resource.company.website,
            billingStreet: resource.company.billingStreet,
            billingNumber: resource.company.billingNumber,
            billingDistrict: resource.company.billingDistrict,
            billingCity: resource.company.billingCity,
            billingCountry: resource.company.billingCountry,
            billingPostalCode: resource.company.billingPostalCode
        }) : null;

        return new Profile({
            profileId: resource.profileId,
            userId: resource.userId,
            status: resource.status,
            businessRole: resource.businessRole,
            profilePictureUrl: resource.profilePictureUrl || '',
            firstName: resource.firstName,
            lastName: resource.lastName,
            phoneNumber: resource.phoneNumber,
            dni: resource.dni,
            dateOfBirth: resource.dateOfBirth,
            street: resource.street,
            number: resource.number || '',
            district: resource.district,
            city: resource.city,
            country: resource.country,
            postalCode: resource.postalCode,
            technician: technician,
            homeowner: homeowner,
            company: company
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;

        return {
            profileId: entity.profileId,
            userId: entity.userId,
            status: entity.status,
            businessRole: entity.businessRole,
            profilePictureUrl: entity.profilePictureUrl,
            firstName: entity.firstName,
            lastName: entity.lastName,
            phoneNumber: entity.phoneNumber,
            dni: entity.dni,
            dateOfBirth: entity.dateOfBirth,
            street: entity.street,
            number: entity.number,
            district: entity.district,
            city: entity.city,
            country: entity.country,
            postalCode: entity.postalCode,
            technician: entity.technician ? {
                technicianId: entity.technician.technicianId,
                specialties: entity.technician.specialties,
                experienceYears: entity.technician.experienceYears,
                aboutMe: entity.technician.aboutMe,
                centerLatitude: entity.technician.centerLatitude,
                centerLongitude: entity.technician.centerLongitude,
                radiusKm: entity.technician.radiusKm
            } : null,

            homeowner: entity.homeowner ? {
                homeownerId: entity.homeowner.homeownerId,
                preferredContactTime: entity.homeowner.preferredContactTime,
                smsNotifications: entity.homeowner.smsNotifications,
                emailNotifications: entity.homeowner.emailNotifications,
                pushNotifications: entity.homeowner.pushNotifications,
                emergencyContact: entity.homeowner.emergencyContact
            } : null,

            company: entity.company ? {
                companyId: entity.company.companyId,
                companyName: entity.company.companyName,
                taxId: entity.company.taxId,
                industry: entity.company.industry,
                companySize: entity.company.companySize,
                website: entity.company.website,
                billingStreet: entity.company.billingStreet,
                billingNumber: entity.company.billingNumber,
                billingDistrict: entity.company.billingDistrict,
                billingCity: entity.company.billingCity,
                billingCountry: entity.company.billingCountry,
                billingPostalCode: entity.company.billingPostalCode
            } : null
        };
    }
}
