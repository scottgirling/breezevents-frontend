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
                redirectTo: "https://breezevents.netlify.app/account"
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
        <section className="min-h-[65vh] sm:min-h-[70vh] lg:max-w-[50%] m-auto">
            {userAction === "Sign In" ? (
                <>
                    <section>
                        <button onClick={() => handleGoogleSignIn()}><i className="fa-brands fa-google"></i> Continue with Google</button>
                    </section>
                    <section>
                        <h1 className="lg:text-2xl">Sign in to your account</h1>
                        <form 
                            className="flex flex-col"
                            onSubmit={(event) => handleSignIn(event)}
                        >
                            <label 
                                htmlFor="email"
                                className="mt-4"
                            >
                                Email Address
                            </label>
                            <input 
                                className="account-input"
                                onChange={(event) => setEmail(event.target.value)} 
                                type="text" 
                                id="email" 
                                name="email" 
                                placeholder="Your email address"
                            >
                            </input>
                            
                            <label 
                                htmlFor="password"
                                className="mt-4"
                            >
                                Password
                            </label>
                            <input 
                                className="account-input"
                                onChange={(event) => setPassword(event.target.value)} 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Your password"
                            >
                            </input>
                            {signInError && (
                                <p 
                                className="my-2 mx-auto font-medium underline"
                                >{signInError}</p>
                            )}
                            <button 
                                className="sign-in-up"
                                type="submit"
                            >
                                Sign In
                            </button>
                        </form>
                        <button 
                            onClick={() => setUserAction("Sign Up")}
                            className="dark-mode"
                        >Don't have an account? Sign up.</button>
                    </section>
                </>
            ) : (
                <section>
                    <h1 className="lg:text-2xl">Create an account</h1>
                    <form 
                        className="flex flex-col"
                        onSubmit={(event) => handleSignUp(event)}
                    >
                        <label 
                            htmlFor="name"
                            className="mt-4"
                        >
                            Name
                        </label>
                        <input 
                            className="account-input"
                            onChange={(event) => setName(event.target.value)} 
                            type="text" 
                            id="name" 
                            name="name" 
                            placeholder="Your name"
                        >
                        </input>

                        <label 
                            htmlFor="email"
                            className="mt-4"
                        >
                            Email Address
                        </label>
                        <input 
                            className="account-input"
                            onChange={(event) => setEmail(event.target.value)} 
                            type="text" 
                            id="email" 
                            name="email" 
                            placeholder="Your email address"
                        >
                        </input>
                        
                        <label 
                            htmlFor="password"
                            className="mt-4"
                        >
                            Password
                        </label>
                        <input 
                            className="account-input"
                            onChange={(event) => setPassword(event.target.value)} 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Your password"
                        >
                        </input>
                        <button 
                            className="sign-in-up"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                    <button 
                        onClick={() => setUserAction("Sign In")}
                        className="dark-mode"
                    >Already have an account? Sign in.</button>
                </section>
            )}
        </section>
    )
}