import React, { CSSProperties } from 'react';
import CrossIconSVG from "../../assets/cross-icon.svg";

interface CrossIconProps {
    onClick: () => void;
    style?: CSSProperties;
}

const CrossIcon: React.FC<CrossIconProps> = ({ onClick, style }) => {
    return (
        <div
            style={{ position: "absolute", top: 0, right: 0, width: "30px", height: "30px", cursor: "pointer", ...style }}
            onClick={onClick}
        >
            <img
                src={CrossIconSVG}
                alt="Cross Icon"
                style={{ width: "70%", height: "70%" }}
            />
        </div>
    );
};

export default CrossIcon;