export type LoginCredentials = {
    email: string;
    senha: string;
};

export type AuthResponse = {
    access_token: string;
    user: {
        nome: string;
        email: string;
        tipo: string;
    };
};

export type DecodedToken = {
    sub: string;
    id: string;
    nome: string;
    tipo: string;
    exp: number;
};