import { Storage, Test, Type, Unit, UserPermissions } from "./enums";

export interface CardData {
    title: string;
    count?: string;
};

export interface DashboardAttributes {
    pendingJobsCount: string;
    pendingSamplesCount: string;
    completedJobsCount: string;
};

export interface JobAttributes {
    id?: number;
    client: string;
    jobNumber?: string;
    comments?: string;
    dueDate: Date;
    completed?: boolean;
    createdAt?: Date;
};

export interface ClientAttributes {
    id?: number;
    name?: string;
    email?: string;
    phoneNumber?: string;
    fullAddress?: string;
    addressLine?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    purchaseOrderNumber?: string;
};

export interface SampleAttributes {
    id?: number;
    jobNumber: string;
    sampleNumber: string;
    type: Type[];
    storage?: Storage[];
    completed: boolean;
    comments?: string;
};

export interface TestAttributes {
    id?: number;
    sampleId?: number;
    profileId?: number;
    testName: Test[];
    unit: Unit[];
    result?: number;
    comment?: string;
};

export interface UserContextAttributes {
    id: number;
    fullName: string;
    permissions: UserPermissions[];
};

export interface AdminContextAttributes {
    isAuthorized: boolean;
};

export interface ProfileAttributes {
    id?: number;
    personalEmail: string;
    phoneNumber?: string;
};

export interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    workEmail: string;
    position: string;
    permissions: string[];
    dateStarted: Date;
    password: string;
    confirmPassword?: string;
};

export interface ChangePasswordAttributes {
    password: string;
    confirmPassword: string;
};