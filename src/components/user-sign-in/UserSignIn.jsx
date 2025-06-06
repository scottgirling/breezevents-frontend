import { createClient } from "@supabase/supabase-js";
import "./UserSignIn.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, fetchUserById } from "../../utils/api";

export const UserSignIn = () => {
    const navigate = useNavigate();
    const [userAction, setUserAction] = useState("Sign In");
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const supabaseUrl = 'https://xvmroxtbmxqhinhufsyx.supabase.co';
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2bXJveHRibXhxaGluaHVmc3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTUxMjgsImV4cCI6MjA2MzkzMTEyOH0.WdRWzOvgEOFQpULmlY_6qRVkWnfQ1wbSl957A0oOF1E';

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const handleSignUp = (event) => {
        event.preventDefault();
        signUpNewUser(email, password, name);
    }

    const signUpNewUser = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'http://localhost:5173/auth-confirm',
                data: {
                    name
                }
            },
        });

        if (!error) {
            navigate("/check-email");
        }
    }

    const handleSignIn = (event) => {
        event.preventDefault();
        signInWithEmail(email, password);
    }

    const signInWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (!error) {
            const userDetails = {}

            userDetails.user_id = data.user.id;
            userDetails.name = data.user.user_metadata.name;
            userDetails.username = "";
            userDetails.email = data.user.email;
            userDetails.role = "attendee";

            fetchUserById(data.user.id)
            .then((returnedUser) => {
                if (returnedUser) {
                    navigate(`/breezer/${data.user.id}`);
                }
            })
            addUser(userDetails)
            .then(()=> {
                navigate(`/breezer/${data.user.id}`);
            });
        }
    }

    return (
        <section>
            {userAction === "Sign In" ? (
                <>
                    <h1>Sign in to your account</h1>
                    <form 
                        className="sign-up"
                        onSubmit={(event) => handleSignIn(event)}
                    >
                        <label htmlFor="email">Email Address</label>
                        <input onChange={(event) => setEmail(event.target.value)} type="text" id="email" name="email" placeholder="Your email address"></input>
                        <label htmlFor="password">Password</label>
                        <input onChange={(event) => setPassword(event.target.value)} type="password" id="password" name="password" placeholder="Your password"></input>
                        <button type="submit">
                            Sign In
                        </button>
                    </form>
                    <button onClick={() => setUserAction("Sign Up")}>Don't have an account? Sign up.</button>
                </>
            ) : (
                <>
                    <h1>Create an account</h1>
                    <form 
                        className="sign-up"
                        onSubmit={(event) => handleSignUp(event)}
                    >
                        <label htmlFor="name">Name</label>
                        <input onChange={(event) => setName(event.target.value)} type="text" id="name" name="name" placeholder="Your name"></input>

                        <label htmlFor="email">Email Address</label>
                        <input onChange={(event) => setEmail(event.target.value)} type="text" id="email" name="email" placeholder="Your email address"></input>
                        
                        <label htmlFor="password">Password</label>
                        <input onChange={(event) => setPassword(event.target.value)} type="password" id="password" name="password" placeholder="Your password"></input>
                        <button type="submit">
                            Sign Up
                        </button>
                    </form>
                    <button onClick={() => setUserAction("Sign In")}>Already have an account? Sign in.</button>
                </>
            )}
        </section>
    )
}