"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
    value: string;
}

//Here we are using useMemo hook to that the ReactQuill component only render of client side not on the server side. basically to prevent hydration!!

export const Preview = ({ value }: PreviewProps) => {
    const ReactQuill = useMemo(
        () => dynamic(() => import("react-quill"), { ssr: false }),
        []
    );

    return (
        <div className="bg-white dark:text-white dark:bg-black">
            <ReactQuill theme="bubble" value={value} readOnly />
        </div>
    );
};
