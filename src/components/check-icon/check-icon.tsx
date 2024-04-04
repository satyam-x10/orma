import React from "react";
import checkIconSVG from "../../assets/check-icon.svg";

interface CheckIconProps {
    onClick: () => void;
    style?: React.CSSProperties;
}

const CheckIcon: React.FC<CheckIconProps> = ({ onClick, style }) => {
    return (
        <div
            style={{ position: "absolute", top: 0, right: 0, width: "35px", height: "35px", cursor: "pointer", ...style }}
            onClick={onClick}
        >
            <img
                src={checkIconSVG}
                alt="Check Icon"
                style={{ width: "70%", height: "70%" }}
            />
        </div>
    );
}
export default CheckIcon;