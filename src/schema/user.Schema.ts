import { z } from "zod";

export const SignUpFormSchema = z.object({
    
    phone:z.string().length(10,"Phone number must be exactly 10 digits"),
    email:z.email("Invalid email address"),
    password:z.string().min(6,'Minimum 6 world required'),
    role:z.enum(["ADMIN","FARMER","LOGISTICS","BUYER"]).optional()
    
})

export type SignUpFormData = z.infer<typeof SignUpFormSchema>;




export const loginFormSchema = z.object({
    
        email:z.email("Ema0il is required"),
        password:z.string().min(6,"minmum is 6 letter")

})

export type  loginFormData = z.infer<typeof loginFormSchema>

// Verify karo schema mein yeh ho:
export const VerifyOtpSchema = z.object({
  otp: z.string("plase filed all files"),
});

export type VerifyOtpData = z.infer<typeof VerifyOtpSchema>



export const ForgotPassFormSchema = z.object({
    email:z.email("Please enter valid email")
})

export type ForgotPassFormData = z.infer<typeof ForgotPassFormSchema>


export const ResetPassFormSchema = z.object({
    password:z.string().min(6,'Minimum 6 world required'),
    cpassword:z.string().min(6,'Minimum 6 world required'),
})

export type ResetPassFormData = z.infer<typeof ResetPassFormSchema> 