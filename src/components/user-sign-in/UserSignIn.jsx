import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, fetchUserById } from "../../utils/api";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabase/client";
import "./UserSignIn.css";

export const UserSignIn = () => {
    const { signInWithEmail } = useAuth();
    const navigate = useNavigate();
    const [userAction, setUserAction] = useState("Sign In");
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

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

    const handleSignIn = async (event) => {
        event.preventDefault();
        const { data, error } = await signInWithEmail(email, password);

        if (!error) {
            const userDetails = {}

            userDetails.user_id = data.user.id;
            userDetails.name = data.user.user_metadata.name;
            userDetails.username = "";
            userDetails.email = data.user.email;
            userDetails.role = "attendee";

            fetchUserById(data.user.id)
            .then((returnedUser) => {
                if (returnedUser === undefined) {
                    addUser(userDetails)
                    .then(()=> {
                        navigate(`/breezer/${data.user.id}`);
                    });
                } 
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