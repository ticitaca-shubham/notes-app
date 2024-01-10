import React from "react";

export default function Tag({noteLabel}){
    return(
        <div className="tag-container">
            <p>Label: {noteLabel}</p>
        </div>
    )
}