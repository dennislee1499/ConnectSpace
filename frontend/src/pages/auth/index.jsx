import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import backgroundImage from "../../assets/background.jpg";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); 
    const navigate = useNavigate();

    const validateSignup = () => {
      if (!email.length) {
        toast.error("Email is required");
        return false; 
      }
      if (!password.length) {
        toast.error("Password is required"); 
        return false; 
      }
      if (!confirmPassword.length) {
        toast.error("Please confirm password");
        return false; 
      }
      if (password !== confirmPassword) {
        toast.error("Passwords must match")
        return false; 
      }
      return true; 
    };

    const validateLogin = () => {
      if (!email.length) {
        toast.error("Email is required");
        return false; 
      }
      if (!password.length) {
        toast.error("Password is required"); 
        return false; 
      }
      return true; 
    }

    const handleSignup = async () => {
      if (validateSignup()) {
        const res = await apiClient.post(
          SIGNUP_ROUTE, 
          { email, password }, 
          { withCredentials: true }
        );
        if (res.status === 201) {
          navigate("/profile"); 
        }
      }
    };

    const handleLogin = async () => {
      if (validateLogin()) {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.data.user.id) {
          if (res.data.user.profileSetup) {
            navigate("/chat"); 
          } else {
            navigate("/profile"); 
          }
        }
        console.log(res); 
      }
    }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center"
    style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: "center"
    }}
    >
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl
        w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] rounded-3xl flex items-center justify-center">
            <div className="flex flex-col gap-10 items-center justify-center">
                <div className="flex items-center justify-center flex-col">
                    <div className="flex items-center justify-center mb-5">
                        <h1 className="text-4xl font-bold md:text-5xl">ConnectSpace</h1>
                    </div>
                    <p className="font-medium text-center">Fill in details to start connecting!</p>
                </div>
                <div className="flex items-center justify-center w-full">
                    <Tabs className="w-3/4" defaultValue="login">
                        <TabsList className="bg-transparent rounded-none w-full">
                            <TabsTrigger value="login"
                            className="data-[state=active]:bg-transparent text-opacity-90 
                            border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold
                            data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger value="signup"
                            className="data-[state=active]:bg-transparent text-opacity-90 
                            border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold
                            data-[state=active]:border-b-blue-500 p-3 transition-all duration-300"
                            >
                                Signup
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                            <Input 
                              placeholder="Email" 
                              type="email" 
                              className="rounded-full p-6" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}  
                            />
                            <Input 
                              placeholder="Password" 
                              type="password" 
                              className="rounded-full p-6" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}  
                            />
                            <Button className="rounded-full p-6" onClick={ handleLogin }>Login</Button>
                        </TabsContent>
                        <TabsContent className="flex flex-col gap-5" value="signup">
                            <Input 
                              placeholder="Email" 
                              type="email" 
                              className="rounded-full p-6" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}  
                            />
                            <Input 
                              placeholder="Password" 
                              type="password" 
                              className="rounded-full p-6" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}  
                            />
                            <Input 
                              placeholder="Confirm Password" 
                              type="password" 
                              className="rounded-full p-6" 
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}  
                            />
                            <Button className="rounded-full p-6" onClick={ handleSignup }>Sign Up</Button>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Auth;

