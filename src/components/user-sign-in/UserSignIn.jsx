import { useEffect, useState } from "react";
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
    const [signInError, setSignInError] = useState(null);

    useEffect(() => {
        getUserData();
    }, []);

    const handleSignUp = (event) => {
        event.preventDefault();
        signUpNewUser(email, password, name);
    }

    const signUpNewUser = async (email, password, name) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: 'https://breezevents.netlify.app/auth-confirm',
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

        if (error) {
            setSignInError("Invalid email address or password.")
        }

        if (!error) {
            if (data.user.aud === "authenticated") {
                const userDetails = {}
    
                userDetails.user_id = data.user.id;
                userDetails.name = data.user.user_metadata.name;
                userDetails.username = "";
                userDetails.email = data.user.email;
                userDetails.role = "attendee";

                try {
                    const returnedUser = await fetchUserById(data.user.id)
                    
                    if (returnedUser) {
                        navigate(`/breezer/${data.user.id}`);
                    } 
                } catch {
                    addUser(userDetails)
                    .then(()=> {
                        navigate(`/breezer/${data.user.id}`);
                    });
                };
            }
        }
    }

    const handleGoogleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: "http://localhost:5173/account"
            }
        });
    }

    const getUserData = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session.user.aud === "authenticated") {
            const userDetails = {}
    
            userDetails.user_id = session.user.id;
            userDetails.name = session.user.user_metadata.name;
            userDetails.username = "";
            userDetails.email = session.user.email;
            userDetails.role = "attendee";

            try {
                const returnedUser = await fetchUserById(session.user.id)
                
                if (returnedUser) {
                    navigate(`/breezer/${session.user.id}`);
                } 
            } catch {
                addUser(userDetails)
                .then(()=> {
                    navigate(`/breezer/${session.user.id}`);
                });
            };
        }
    }

    return (
        <section className="sign-in-comp">
            {userAction === "Sign In" ? (
                <>
                    <section>
                        <button onClick={() => handleGoogleSignIn()}><i className="fa-brands fa-google"></i> Continue with Google</button>
                    </section>
                    <section>
                        <h1>Sign in to your account</h1>
                        <form 
                            className="sign-up"
                            onSubmit={(event) => handleSignIn(event)}
                        >
                            <label htmlFor="email">Email Address</label>
                            <input 
                                onChange={(event) => setEmail(event.target.value)} 
                                type="text" 
                                id="email" 
                                name="email" 
                                placeholder="Your email address"
                            >
                            </input>
                            
                            <label htmlFor="password">Password</label>
                            <input 
                                onChange={(event) => setPassword(event.target.value)} 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Your password"
                            >
                            </input>
                            {signInError && (
                                <p className="sign-in-error">{signInError}</p>
                            )}
                            <button type="submit">
                                Sign In
                            </button>
                        </form>
                        <button 
                            onClick={() => setUserAction("Sign Up")}
                            className="switch-mode"
                        >Don't have an account? Sign up.</button>
                    </section>
                </>
            ) : (
                <section>
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
                    <button 
                        onClick={() => setUserAction("Sign In")}
                        className="switch-mode"
                    >Already have an account? Sign in.</button>
                </section>
            )}
        </section>
    )
}