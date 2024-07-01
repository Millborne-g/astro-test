import React from "react";
import EmptyIcon from "../../public/empty-folder-icon.png";

export const ErrorMessage = () => {
    return (
        <div className="w-full flex flex-col justify-center align-center items-center py-5">
            <img src={EmptyIcon.src} alt="Error Icon" className="w-80 h-80 mr-1" />
            <span className="text-base text-lg">Table is empty.</span>
        </div>
    );
};
