import { UserPermissions } from "./enums";

export interface CardData {
    title: string;
    count?: number;
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

enum Type {
    Liquid = "liquid",
    Solid = "solid",
    Gas = "gas"
};

enum Storage {
    Shelf1 = "shelf#1",
    Shelf2 = "shelf#2",
    Fridge = "fridge"
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

export interface UserContextAttributes {
    id: number;
    fullName: string;
    permissions: UserPermissions[];
};

export interface AdminContextAttributes {
    isAuthorized: boolean;
};

export interface ProfileAttributes {
    personalEmail: string;
    phoneNumber?: string;
};

export interface CreateUserProps {
    firstName: string;
    lastName: string;
    workEmail: string;
    permissions: string[];
    password: string;
    confirmPassword: string;
};