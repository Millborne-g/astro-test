import React from "react";

export const ErrorMessage = () => {
    return (
        <div className="w-full flex flex-col justify-center align-center items-center py-5">
            <img
                src={"../../public/empty-folder-icon.png"}
                alt="Error Icon"
                className="w-80 h-80 mr-1"
            />
            <span className="text-base text-lg">Table is empty.</span>
        </div>
    );
};
