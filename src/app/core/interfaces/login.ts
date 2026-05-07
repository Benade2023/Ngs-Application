export interface LoginRequest {
    email: string;
    password: string;
    date?: string;

}

export interface LoginResponse {
    token: string;
    userId: string;
    role: string;
}

export interface Register {
    nom: string;
    prenom: string;
    email: string;
    password: string;
    confirmPassword: string;
}
