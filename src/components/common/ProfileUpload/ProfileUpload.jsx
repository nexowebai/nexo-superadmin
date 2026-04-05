import { useRef } from "react";
import { Camera, User, X } from "lucide-react";
import { cn } from "@lib/cn";
import "./ProfileUpload.css";

function ProfileUpload({
  preview,
  onChange,
  onRemove,
  label = "Upload your profile photo",
  className,
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange?.(file, reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("profile-upload", className)}>
      <div className="profile-upload__container">
        <div className="profile-upload__preview" onClick={handleClick}>
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="profile-upload__image"
            />
          ) : (
            <div className="profile-upload__placeholder">
              <User size={32} />
            </div>
          )}
          <div className="profile-upload__overlay">
            <Camera size={20} />
          </div>
        </div>
        {preview && (
          <button
            type="button"
            className="profile-upload__remove"
            onClick={onRemove}
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="profile-upload__text">
        <span className="profile-upload__label">{label}</span>
        <span className="profile-upload__hint">JPG, PNG up to 2MB</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        hidden
      />
    </div>
  );
}

export default ProfileUpload;
