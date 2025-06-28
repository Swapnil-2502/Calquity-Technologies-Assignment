import React from "react";

export function PostLayout({
    text,
    layout
}:{
    text: string,
    layout?: string
}){
    const placeholderImage = (
         <div className="bg-gray-200 rounded w-full h-40 flex items-center justify-center text-gray-400 text-sm">
            Image
        </div>
    )

    switch (layout){
        case "imageTopTextBottom":
            return (
                <div className="space-y-4">
                    {placeholderImage}
                    <p className="text-gray-800">{text}</p>
                </div>
            );
        case "sideBySide":
            return (
                <div className="flex gap-4">
                    <div className="w-1/2">{placeholderImage}</div>
                    <p className="w-1/2 text-gray-800">{text}</p>
                </div>
            )
        case "textOverlay":
            return (
                <div className="relative w-full h-48 rounded overflow-hidden">
                    {placeholderImage}
                    <p className="absolute inset-0 flex items-center justify-center text-white text-center text-lg font-semibold bg-black/40 px-4">
                        {text}
                    </p>
                </div>
            )
        case "twoColumnGrid":
             return (
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    {placeholderImage}
                    <p className="text-gray-800">{text}</p>
                </div>
                <div className="space-y-2">
                    <p className="text-gray-800">{text}</p>
                    {placeholderImage}
                </div>
                </div>
            );
        default:
            return <p className="text-gray-800">{text}</p>;

    }
}

