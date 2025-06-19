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

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.log("Supabase Sign Out Error: ", error)
        }

        await supabase.auth.refreshSession();
        navigate("/account");
    }

    if (loading) {
        return (
            <p className="loading">Loading your profile...</p>
        );
    }

    return (
        <section className="user-profile">
            <section className="welcome-back">
                {user.name && (
                    <h1>Welcome back, <span className="users-name">{user.name.split(" ")[0]}!</span></h1>
                )}
            </section>

            {user.role === "attendee" && (
                <AttendeeEvents />
            )}
            
            {user.role === "host" && (
                <HostEvents />

            )}

            <section className="profile-section">
                <section className="profile-header">
                    <h3>Your Profile</h3>
                    <section className="your-profile-button">
                        <button 
                            className="your-profile-button"
                            onClick={() => {
                                setIsDisabled(!isDisabled);
                                setUpdateSuccess(null);
                                setUserDetails({});
                            }}
                        >
                            <i className="fa-solid fa-user-pen"></i>
                            <p>Edit Profile</p>
                        </button>
                    </section>
                </section>
                <section>
                    <form className="user-profile-form">
                        <section>
                            <label htmlFor="name">Name:</label>
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
                        <section>
                            <label htmlFor="username">Username:</label>
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
                        <section>
                            <label htmlFor="email">Email:</label>
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
                        <section>
                            <label htmlFor="bio">Bio:</label>
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
                        <section >
                            <label htmlFor="avatar_url">Avatar URL:</label>
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

                        <section className="user-profile-buttons">
                            <button 
                                disabled={!Object.keys(userDetails).length}
                                className={isDiscardButtonDisabled()}
                                onClick={() => {
                                    setIsDisabled(true);
                                }}
                                type="reset"
                            >
                                Discard Changes
                            </button>
                            <button
                                disabled={!Object.keys(userDetails).length}
                                className={isSubmitButtonDisabled()}
                                onClick={(event) => handleSubmit(event)}
                            >
                                Save Changes
                            </button>
                        </section>
                        <section>
                            {updateSuccess && (
                                <p className="update-success">{updateSuccess}</p>
                            )}
                        </section>
                    </form>
                </section>

                <section>
                    <button className="signout" onClick={handleSignOut}>
                        Sign Out
                    </button>
                </section>
            </section>
        </section>
    )
}