import React, { useState, useEffect, useContext } from "react";
import AuthContext from '../components/context/AuthContext.jsx';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  
  // Set an initial state that matches the structure but can be empty
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    notificationThreshold: "medium",
    emailNotifications: true,
    smsAlerts: false,
    riskTolerance: "moderate",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Function to load the profile state correctly
  const loadProfileData = () => {
    if (user) {
      const savedPreferences = localStorage.getItem(`userPreferences_${user.id}`);
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
      
      // Correctly build the profile object
      setProfile({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        // Set default preferences first, then override with saved ones
        notificationThreshold: preferences.notificationThreshold || "medium",
        emailNotifications: preferences.emailNotifications !== undefined ? preferences.emailNotifications : true,
        smsAlerts: preferences.smsAlerts !== undefined ? preferences.smsAlerts : false,
        riskTolerance: preferences.riskTolerance || "moderate",
      });
    }
  };

  // Load profile data when the component mounts or the user changes
  useEffect(() => {
    loadProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = () => {
    // In a real app, you would call a backend endpoint to update the user profile
    // For now, we'll save only the preferences to localStorage
    if (user) {
        const preferencesToSave = {
            notificationThreshold: profile.notificationThreshold,
            emailNotifications: profile.emailNotifications,
            smsAlerts: profile.smsAlerts,
            riskTolerance: profile.riskTolerance,
        };
        localStorage.setItem(`userPreferences_${user.id}`, JSON.stringify(preferencesToSave));
    }
    
    setIsEditing(false);
    setSaveStatus("Profile updated successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Correctly reload the original data to discard changes
    loadProfileData();
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h3>User Profile & Preferences</h3>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div className="btn-group">
            <button className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
      
      {saveStatus && <div className="save-status-banner">{saveStatus}</div>}

      <div className="profile-section">
        <h4>Basic Information</h4>
        <div className="profile-grid">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <p>{profile.name}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <p>{profile.email}</p>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <p>{profile.address}</p>
          </div>
        </div>
      </div>

      <div className="profile-section">
        <h4>Notification Preferences</h4>
        <div className="profile-grid">
          <div className="form-group">
            <label className="form-label">Notification Threshold</label>
            {isEditing ? (
              <select name="notificationThreshold" className="form-input" value={profile.notificationThreshold} onChange={handleInputChange}>
                <option value="low">Low - All alerts</option>
                <option value="medium">Medium - Important alerts only</option>
                <option value="high">High - Critical alerts only</option>
              </select>
            ) : (
              <p>{profile.notificationThreshold}</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Risk Tolerance Level</label>
            {isEditing ? (
              <select name="riskTolerance" className="form-input" value={profile.riskTolerance} onChange={handleInputChange}>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            ) : (
              <p>{profile.riskTolerance}</p>
            )}
          </div>
          <div className="form-group-span-2">
            <div className="checkbox-group">
              <input type="checkbox" id="emailNotifications" name="emailNotifications" checked={profile.emailNotifications} onChange={handleInputChange} disabled={!isEditing} />
              <label htmlFor="emailNotifications">Enable email notifications</label>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="smsAlerts" name="smsAlerts" checked={profile.smsAlerts} onChange={handleInputChange} disabled={!isEditing} />
              <label htmlFor="smsAlerts">Enable SMS alerts for critical risks</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;