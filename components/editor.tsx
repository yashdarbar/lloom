"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.snow.css";

interface EditorProps {
    onChange: (value: string) => void;
    value: string;
}

//Here we are using useMemo hook to that the ReactQuill component only render of client side not on the server side. basically to prevent hydration!!

export const Editor = ({onChange, value}: EditorProps) => {
    const ReactQuill = useMemo(()=>dynamic(()=> import("react-quill"), { ssr: false}), []);

    return (
        <div className="bg-white">
            <ReactQuill
            theme="snow"
            onChange={onChange}
            value={value}
            />
        </div>
    );
}