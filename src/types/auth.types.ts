

export type User = {
  _id: string;
  phone: string;
  email: string;
  role: "BUYER" | "FARMER"; // agar sirf ye 2 roles hai
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  refreshToken: string;
};

export type AuthTokens ={
  accessToken:string
  refreshToken:string

}
