import { ReactNode } from "react";
import { Storage, Test, Type, Unit, UserPermissions } from "./enums";

export interface CardData {
    title: string;
    count?: string;
    colour?: string;
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
    jobNumber?: string;
    sampleNumber?: string;
    type: string;
    storage: string;
    completed?: boolean;
    comments?: string;
    numberOfSamples: number;
    tests: TestAttributes[];
};

export interface TestAttributes {
    id?: number;
    sampleId?: number;
    userId: number;
    testName: string;
    unit: string;
    result?: number | null;
    comment?: string;
};

export interface TestColumnsAttributes {
    id: string;
    rowId: number;
    testName: string;
    unit: string;
    userId: number;
};

export interface EditDeleteTestAttributes {
    id: string;
    rowId: number;
    testName: string;
    unit: "string";
    userId: number;
}

export interface ResultsAttributes {
    id?: number;
    userId: number;
    result?: string;
    unit: string;
}

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
    password?: string;
    activeEmployee?: boolean;
    confirmPassword?: string;
    profile?: ProfileAttributes;
};

export interface ChangePasswordAttributes {
    password: string;
    confirmPassword: string;
};

export interface ButtonConfig {
    label: string;
    icon: ReactNode;
    onClick: () => void;
};