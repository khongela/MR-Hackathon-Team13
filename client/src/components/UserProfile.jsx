import React, { useState, useEffect, useContext } from "react";
import AuthContext from '../components/context/AuthContext.jsx';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  
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

  const loadProfileData = () => {
    if (user) {
      const savedPreferences = localStorage.getItem(`userPreferences_${user.id}`);
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : {};
      
      setProfile({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        notificationThreshold: preferences.notificationThreshold || "medium",
        emailNotifications: preferences.emailNotifications !== undefined ? preferences.emailNotifications : true,
        smsAlerts: preferences.smsAlerts !== undefined ? preferences.smsAlerts : false,
        riskTolerance: preferences.riskTolerance || "moderate",
      });
    }
  };

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
    // This function's logic for saving is not the focus, but it correctly toggles the state.
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
          {/* --- RESTORED EDIT FUNCTIONALITY HERE --- */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            {isEditing ? (
              <input type="text" name="name" className="form-input" value={profile.name} onChange={handleInputChange} />
            ) : (
              <p>{profile.name}</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            {isEditing ? (
              <input type="email" name="email" className="form-input" value={profile.email} onChange={handleInputChange} />
            ) : (
              <p>{profile.email}</p>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            {isEditing ? (
               <input type="text" name="address" className="form-input" value={profile.address} onChange={handleInputChange} />
            ) : (
              <p>{profile.address}</p>
            )}
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