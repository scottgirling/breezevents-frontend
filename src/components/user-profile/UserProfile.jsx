import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { fetchUserById, updateUser } from "../../utils/api";
import { supabase } from "../../supabase/client";
import { AttendeeEvents } from "./attendee-profile/AttendeeEvents";
import { HostEvents } from "./host-profile/HostEvents";
import "./UserProfile.css";

export const UserProfile = () => {
    const navigate = useNavigate();
    const { user_id } = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [isDisabled, setIsDisabled] = useState(true);
    const [userDetails, setUserDetails] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(null);

    useState(() => {
        setLoading(true);
        fetchUserById(user_id)
        .then((returnedUser) => {
            setUser(returnedUser);
            setLoading(false);
        })
    }, []);

    const handleUserDetailsClassName = () => {
        let userProfileForm = "form-disabled";
        if (!isDisabled) {
            userProfileForm = "form-not-disabled";
        }
        return userProfileForm;
    }

    const handleUserProfileUpdate = (event) => {
        const key = event.target.name;
        const value = event.target.value;
        setUserDetails({
            ...userDetails,
            [key]: value
        })
    }

    const isDiscardButtonDisabled = () => {
        let userProfileDiscardButton = "discard-button-disabled";
        if (Object.keys(userDetails).length) {
            userProfileDiscardButton = "discard-changes"
        }
        return userProfileDiscardButton;
    }

    const isSubmitButtonDisabled = () => {
        let userProfileSubmitButton = "submit-button-disabled";
        if (Object.keys(userDetails).length) {
            userProfileSubmitButton = "save-changes"
        }
        return userProfileSubmitButton;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        updateUser(user_id, userDetails)
        .then(() => {
            setUpdateSuccess("Successfully updated your profile!")
            setIsDisabled(true);
            setUserDetails({});
        });
    }

    const handleSignOut = () => {
        supabase.auth.signOut()
        .then(() => {
            supabase.auth.refreshSession();
        })
        .then(() => {
            navigate("/account");
        });
    }

    if (loading) {
        return (
            <p className="loading">Loading your profile...</p>
        );
    }

    return (
        <section className="sm:min-h-[70vh] 2xl:mx-20">
            <section className="my-4 text-left text-3xl font-medium xl:text-4xl">
                {user.name && (
                    <h1>Welcome back, <span className="text-[#317575]">{user.name.split(" ")[0]}!</span></h1>
                )}
            </section>

            {user.role === "attendee" && (
                <AttendeeEvents />
            )}
            
            {user.role === "host" && (
                <HostEvents />

            )}

            <section className="my-4 text-left">
                <section className="flex items-center justify-between mt-4 mb-1">
                    <h3 className="text-2xl xl:text-3xl">Your Profile</h3>
                    <section className="text-xs text-[#317575] xl:text-base">
                        <button 
                            className="flex items-center bg-inherit !p-0"
                            onClick={() => {
                                setIsDisabled(!isDisabled);
                                setUpdateSuccess(null);
                                setUserDetails({});
                            }}
                        >
                            <i className="fa-solid fa-user-pen"></i>
                            <p className="ml-1">Edit Profile</p>
                        </button>
                    </section>
                </section>
                <section>
                    <form>
                        <section className="flex items-center">
                            <label 
                                className="w-[22vw] xl:w-[8vw]" 
                                htmlFor="name"
                            >
                                Name:
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                defaultValue={user.name} 
                                disabled={isDisabled} 
                                className={handleUserDetailsClassName()}
                                onBlur={(event) => handleUserProfileUpdate(event)}
                            >
                            </input>
                        </section>
                        <section className="flex items-center">
                            <label 
                                className="w-[22vw] xl:w-[8vw]"
                                htmlFor="username"
                            >
                                Username:
                            </label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                defaultValue={user.username} 
                                disabled={isDisabled} 
                                className={handleUserDetailsClassName()}
                                onBlur={(event) => handleUserProfileUpdate(event)}
                            >
                            </input>
                        </section>
                        <section className="flex items-center">
                            <label 
                                className="w-[22vw] xl:w-[8vw]"
                                htmlFor="email"
                            >
                                Email:
                            </label>
                            <input 
                                type="text" 
                                id="email" 
                                name="email" 
                                defaultValue={user.email} 
                                disabled={isDisabled} 
                                className={handleUserDetailsClassName()}
                                onBlur={(event) => handleUserProfileUpdate(event)}
                            >
                            </input>
                        </section>
                        <section className="flex items-center">
                            <label 
                                className="w-[22vw] xl:w-[8vw]"
                                htmlFor="bio"
                            >
                                Bio:
                            </label>
                            <textarea 
                                type="text" 
                                id="bio" 
                                name="bio" 
                                defaultValue={user.bio} 
                                disabled={isDisabled} 
                                className={handleUserDetailsClassName()}
                                onBlur={(event) => handleUserProfileUpdate(event)}
                            >
                            </textarea>
                        </section>
                        <section className="flex items-center">
                            <label 
                                className="w-[22vw] xl:w-[8vw]"
                                htmlFor="avatar_url"
                            >
                                Avatar URL:
                            </label>
                            <input 
                                type="text" 
                                id="avatar_url" 
                                name="avatar_url" 
                                defaultValue={user.avatar_url} 
                                disabled={isDisabled}
                                className={handleUserDetailsClassName()}
                                onBlur={(event) => handleUserProfileUpdate(event)}
                            >
                            </input>
                        </section>

                        <section className="my-2 flex justify-around text-xs xl:my-8 xl:mx-24 xl:justify-start xl:text-base">
                            <button 
                                disabled={!Object.keys(userDetails).length}
                                className={isDiscardButtonDisabled()}
                                onClick={() => {
                                    setIsDisabled(true);
                                }}
                                type="reset"
                                aria-label="Discard changes to your profile"
                            >
                                Discard Changes
                            </button>
                            <button
                                disabled={!Object.keys(userDetails).length}
                                className={isSubmitButtonDisabled()}
                                onClick={(event) => handleSubmit(event)}
                                aria-label="Save changes to your profile"
                            >
                                Save Changes
                            </button>
                        </section>
                        <section className="my-4 text-center">
                            {updateSuccess && (
                                <p>{updateSuccess}</p>
                            )}
                        </section>
                    </form>
                </section>

                <section className="text-xs flex justify-center xl:text-base">
                    <button onClick={handleSignOut}>
                        Sign Out <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </button>
                </section>
            </section>
        </section>
    )
}