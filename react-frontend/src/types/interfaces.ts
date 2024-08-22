export interface CardData {
    title: string;
    count?: number;
};

export interface JobAttributes {
    id: number;
    client: string;
    jobNumber: string;
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
    addressLine?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    purchaseOrderNumber?: string;
};

export interface UserContextAttributes {
    fullName: string;
};

export interface AdminContextAttributes {
    isAuthorized: boolean;
};

export interface CreateUserProps {
    firstName: string;
    lastName: string;
    workEmail: string;
    permissions: string[];
    password: string;
    confirmPassword: string;
};