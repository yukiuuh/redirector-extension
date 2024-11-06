import { ControlStatus } from "@cds/core/forms";
import { CdsFile } from "@cds/react/file";
import { CdsControlMessage } from "@cds/react/forms";
import React, { useRef, useState } from "react";

type Props = {
    onChangeFiles?: (files: File[]) => void;
    loading?: boolean;
    status?: ControlStatus;
}

const FileLoader: React.FC<Props> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputFiles, setInputFiles] = useState<FileList | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        if (!inputRef.current?.files) return;
        const newFileArray = [...Array.from(e.target.files)].filter(
            (file, index, self) =>
                self.findIndex((f) => f.name === file.name) === index,
        );
        const dt = new DataTransfer();
        newFileArray.forEach((file) => dt.items.add(file));
        inputRef.current.files = dt.files;
        setInputFiles(dt.files);
        props.onChangeFiles && props.onChangeFiles(Array.from(dt.files));
    };

    return (
        <CdsFile layout="compact" status={props.status}>
            <label>Input File: </label>
            <input
                type="file"
                accept=".csv"
                multiple={false}
                onChange={handleChange}
                ref={inputRef}
            />
            <CdsControlMessage status={props.status}>
                {props.status == "error"
                    ? "Error"
                    : props.loading
                        ? "Loading..."
                        : inputFiles && inputFiles.length > 0
                            ? "Loaded"
                            : ""}
            </CdsControlMessage>
        </CdsFile>
    );
};
export default FileLoader;
