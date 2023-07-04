import axios from "axios";

interface LoginResponse {
    jwt: string;
}

export const handleSubmit = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(
            "https://mygameon.pro:8000/api/login",
            {
                email,
                password,
            }
        );
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;
            throw new Error(data?.email || "Email or password is incorrect");
        } else {
            throw new Error("An error occurred during login");
        }
    }
};
