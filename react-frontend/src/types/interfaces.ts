export interface CardData {
    title: string;
    count?: number;
}

export interface JobAttributes {
    id: number;
    client: string;
    jobNumber: string;
    comments?: string;
    dueDate: Date;
    completed?: boolean;
    createdAt?: Date;
}
