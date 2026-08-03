export interface IUser {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: "customer" | "agent" | "officer" | "admin";
    banned: boolean;
    banReason: string | null;
    banExpires: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    birthday: string | null;
    referralCode: string;
    walletBalance: number;
    totalSpend: number;
    assignedAgentId: string | null;
    tierId: string | null;
    assignedAgent: { id: string, name: string } | null;
    tier: { id: string, name: string } | null;
}