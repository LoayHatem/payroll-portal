import React from "react";

interface EmployeeAvatarProps {
  name: string;
  size?: number;
}

const EmployeeAvatar: React.FC<EmployeeAvatarProps> = ({ name, size = 40 }) => {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const generateColor = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const initials = getInitials(name);
  const backgroundColor = generateColor(name);

  return (
    <div
      className={`flex items-center justify-center rounded-sm  text-white`}
      style={{
        width: `${size}px`,
        minWidth: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        fontSize: `${size / 2.5}px`,
      }}
    >
      {initials}
    </div>
  );
};

export default EmployeeAvatar;
