import { Profile } from '../domain/profile.entity.js';
import { Technician } from '../domain/technician.entity.js';
import { Homeowner } from '../domain/homeowner.entity.js';

export class ProfileAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;

        const technician = resource.technician ? new Technician({
            technicianId: resource.technician.technicianId,
            specialties: resource.technician.specialties,
            experienceYears: resource.technician.experienceYears,
            aboutMe: resource.technician.aboutMe
        }) : null;

        const homeowner = resource.homeowner ? new Homeowner({
            homeownerId: resource.homeowner.homeownerId,
            preferredContactTime: resource.homeowner.preferredContactTime,
            smsNotifications: resource.homeowner.smsNotifications,
            emailNotifications: resource.homeowner.emailNotifications,
            pushNotifications: resource.homeowner.pushNotifications,
            emergencyContactName: resource.homeowner.emergencyContactName,
            emergencyContactRelationship: resource.homeowner.emergencyContactRelationship,
            emergencyContactPhone: resource.homeowner.emergencyContactPhone
        }) : null;

        return new Profile({
            profileId: resource.profileId,
            userId: resource.userId,
            status: resource.status,
            businessRole: resource.businessRole,
            firstName: resource.firstName,
            lastName: resource.lastName,
            phoneNumber: resource.phoneNumber,
            dni: resource.dni,
            dateOfBirth: resource.dateOfBirth,
            street: resource.street,
            district: resource.district,
            city: resource.city,
            country: resource.country,
            postalCode: resource.postalCode,
            technician: technician,
            homeowner: homeowner
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;

        return {
            profileId: entity.profileId,
            userId: entity.userId,
            status: entity.status,
            businessRole: entity.businessRole,
            firstName: entity.firstName,
            lastName: entity.lastName,
            phoneNumber: entity.phoneNumber,
            dni: entity.dni,
            dateOfBirth: entity.dateOfBirth,
            street: entity.street,
            district: entity.district,
            city: entity.city,
            country: entity.country,
            postalCode: entity.postalCode,
            technician: entity.technician ? {
                technicianId: entity.technician.technicianId,
                specialties: entity.technician.specialties,
                experienceYears: entity.technician.experienceYears,
                aboutMe: entity.technician.aboutMe
            } : null,
            homeowner: entity.homeowner ? {
                homeownerId: entity.homeowner.homeownerId,
                preferredContactTime: entity.homeowner.preferredContactTime,
                smsNotifications: entity.homeowner.smsNotifications,
                emailNotifications: entity.homeowner.emailNotifications,
                pushNotifications: entity.homeowner.pushNotifications,
                emergencyContactName: entity.homeowner.emergencyContactName,
                emergencyContactRelationship: entity.homeowner.emergencyContactRelationship,
                emergencyContactPhone: entity.homeowner.emergencyContactPhone
            } : null
        };
    }
}
