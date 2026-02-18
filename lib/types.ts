export type UserRole = "user" | "admin";

export interface UserProfile {
    id: string;
    email: string | null;
    full_name: string;
    phone: string | null;
    nationality: string | null;
    age: number | null;
    gender: "male" | "female" | "other" | null;
    profession: string | null;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Unit {
    id: string;
    owner_id: string | null;
    title: string;
    details: string | null;
    image_path: string | null;
    media_link: string | null;
    persons: number;
    price: number;
    negotiable: boolean;
    country: string;
    city: string;
    district: string | null;
    address: string | null;
    available: boolean;
    available_at: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
    owner?: UserProfile;
}

export interface UnitRequest {
    id: string;
    requester_id: string;
    title: string;
    details: string | null;
    image_path: string | null;
    media_link: string | null;
    persons: number;
    price: number;
    negotiable: boolean;
    country: string;
    city: string;
    district: string | null;
    address: string | null;
    available_at: string | null;
    status: "pending" | "approved" | "rejected";
    admin_note: string | null;
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
    requester?: UserProfile;
}

export interface Favorite {
    id: string;
    user_id: string;
    unit_id: string;
    created_at: string;
    unit?: Unit;
}

export interface UnitFilters {
    country?: string;
    city?: string;
    district?: string;
    minPrice?: number;
    maxPrice?: number;
    persons?: number;
    available?: boolean;
    search?: string;
}
