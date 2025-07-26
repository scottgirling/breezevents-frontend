import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addUser, fetchUserById } from "../../utils/api";
import { useAuth } from "../../contexts/AuthProvider";
import { supabase } from "../../supabase/client";
import "./UserSignIn.css";

export const UserSignIn = () => {
    const { signInWithEmail } = useAuth();
    const navigate = useNavigate();
    const [userAction, setUserAction] = useState("Sign Up");
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [signInError, setSignInError] = useState(null);

    useEffect(() => {
        getUserId();
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

    const getUserId = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user.aud === "authenticated") {
            fetchUserById(session.user.id)
            .then(() => {
                navigate(`/breezer/${session.user.id}`);
            });
        }
    }

    return (
        <section className="min-h-[65vh] sm:min-h-[70vh] lg:max-w-[50%] m-auto">
            <section>
                <h1 className="text-2xl font-medium my-2 sm:text-3xl">Hello event-goer</h1>
            </section>
            {userAction === "Sign Up" ? (
                <section>
                    <h1 className="sm:text-xl lg:text-2xl">Create your account to get started</h1>
                    <button 
                        className="google-sign-in"
                        onClick={() => handleGoogleSignIn()}
                    >
                        <i className="fa-brands fa-google"></i> Continue with Google
                    </button>
                    <p className="text-xs scroll-m-3.5 sm:text-base">or</p>
                    <section>
                        <form 
                            className="flex flex-col"
                            onSubmit={(event) => handleSignUp(event)}
                        >
                            <label 
                                htmlFor="name"
                                className="mt-4"
                            />
                            <input 
                                className="account-input"
                                onChange={(event) => setName(event.target.value)} 
                                type="text" 
                                id="name" 
                                name="name" 
                                placeholder="Name"
                            >
                            </input>

                            <label 
                                htmlFor="email"
                                className="mt-4"
                            />
                            <input 
                                className="account-input"
                                onChange={(event) => setEmail(event.target.value)} 
                                type="text" 
                                id="email" 
                                name="email" 
                                placeholder="Email"
                            >
                            </input>
                            
                            <label 
                                htmlFor="password"
                                className="mt-4"
                            />
                            <input 
                                className="account-input"
                                onChange={(event) => setPassword(event.target.value)} 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Password"
                            >
                            </input>
                            <button 
                                className="continue"
                                type="submit"
                            >
                                Continue
                            </button>
                        </form>
                        <section className="text-xs flex flex-row items-center mt-1 justify-center sm:text-base">
                            <p>Already have an account?</p>
                            <button 
                                className="switch-btn"
                                onClick={() => setUserAction("Sign In")}
                                id="dark-mode"
                            >Sign in.</button>
                        </section>
                        <Link to="/">
                            <p className="text-xs mt-4 flex items-center justify-center text-black font-normal sm:text-base"><i className="fa-solid fa-arrow-left mr-1"></i> Back to Home</p>
                        </Link>
                    </section>
                </section>
            ) : (
                <section>
                    <h1 className="lg:text-2xl">Sign in to your account to get started</h1>
                    <button 
                        className="google-sign-in"
                        onClick={() => handleGoogleSignIn()}
                    >
                        <i className="fa-brands fa-google"></i> Continue with Google
                    </button>
                    <p className="text-xs">or</p>
                    <section>
                        <form 
                            className="flex flex-col"
                            onSubmit={(event) => handleSignIn(event)}
                        >
                            <label 
                                htmlFor="email"
                                className="mt-4"
                            />
                            <input 
                                className="account-input"
                                onChange={(event) => setEmail(event.target.value)} 
                                type="text" 
                                id="email" 
                                name="email" 
                                placeholder="Email"
                            >
                            </input>
                            
                            <label 
                                htmlFor="password"
                                className="mt-4"
                            />
                            <input 
                                className="account-input"
                                onChange={(event) => setPassword(event.target.value)} 
                                type="password" 
                                id="password" 
                                name="password" 
                                placeholder="Password"
                            >
                            </input>
                            {signInError && (
                                <p 
                                className="mt-2 mx-auto text-sm font-medium underline"
                                >{signInError}</p>
                            )}
                            <button 
                                className="continue"
                                type="submit"
                            >
                                Continue
                            </button>
                        </form>

                        <section className="text-xs flex flex-row items-center mt-1 justify-center sm:text-base">
                            <p>Don't have an account?</p>
                            <button 
                                className="switch-btn"
                                onClick={() => setUserAction("Sign Up")}
                                id="dark-mode"
                            >Sign up.</button>
                        </section>
                        <Link to="/">
                            <p className="text-xs mt-4 flex items-center justify-center text-black font-normal sm:text-base"><i className="fa-solid fa-arrow-left mr-1"></i> Back to Home</p>
                        </Link>
                    </section>
                </section>
            )}
            
        </section>
    )
}