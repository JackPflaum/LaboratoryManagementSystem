import Client from '../models/Client';
import Job from '../models/Job';
import Profile from '../models/Profile';
import Sample from '../models/Sample';
import SamplePhoto from '../models/SamplePhoto';
import Test from '../models/Test';
import User from '../models/User';

export interface ModelsInterface {
    Client: typeof Client;
    Job: typeof Job;
    User: typeof User;
    Profile: typeof Profile;
    Sample: typeof Sample;
    SamplePhoto: typeof SamplePhoto;
    Test: typeof Test;
}

export interface ClientAttributes {
    id?: number;
    name: string;
    email: string;
    phoneNumber?: string;
    addressLine?: string;
    suburb?: string;
    state?: string;
    postcode?: string;
    fullAddress?: string;
    purchaseOrderNumber?: string;
    jobs?: Job[];
}

export interface JobAttributes {
    id?: number;
    clientId: number;
    jobNumber: string;
    comments?: string;
    dueDate: Date;
    completed?: boolean;
    createdAt?: Date;
    samples?: Sample[];
}

export interface UserAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    workEmail: string;
    position: string;
    permissions: string[];
    dateStarted: Date;
    password: string;
    activeEmployee: boolean;
    profile?: Profile;
    userTests?: Test[];
}

export interface ProfileAttributes {
    id?: number;
    userId: number;
    personalEmail?: string;
    phoneNumber?: string;
}

export interface SampleAttributes {
    id?: number;
    jobNumber: string;
    sampleNumber?: string;
    type: string;
    storage: string;
    completed?: boolean;
    comments?: string;
    numberOfSamples?: number;
    tests?: Test[];
    samplePhotos?: SamplePhoto[]
    job?: Job;
}

export interface SamplePhotoAttributes {
    id: number;
    sampleId: number;
    photo: Buffer;    // stored as binary data
}

export interface TestAttributes {
    id?: number;
    sampleId: number;
    userId: number;
    testName: string;
    unit: string;
    result?: number | null;
    comment?: string;
}

export interface SaveResultsAttributes {
    tests: TestAttributes[];
    jobNumber: string;
}
