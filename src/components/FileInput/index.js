import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  // position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function InputFilesUpload({
  onErrorChange,
  register: registerData,
}) {
  const [fileList, setFileList] = useState(null);
  const [error, setError] = useState("");
  const fieldName = registerData.name;

  const handleFilesChange = (e) => {
    const maxFileSize = 16 * 1024 * 1024;
    registerData.onChange(e);
    console.log(fileList);
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      for (let file in files) {
        if (file.size > maxFileSize) {
          setError("File size exceeds the limit (5 MB)");
          onErrorChange(true);
          return;
        } else {
          setError("");
          // onErrorChange(false);
          setFileList(files);
        }
      }
    } else {
      setError("Please select a file");
      onErrorChange(true);
    }
  };

  return (
    <div>
      <VisuallyHiddenInput
        accept='.pdf,.doc,.docx,.jpeg,.jpg,.png,.gif,.mp4,.mp3'
        id={fieldName}
        type='file'
        multiple
        {...registerData}
        onChange={handleFilesChange}
      />
      <div>
        <label htmlFor={fieldName}>
          <Button
            variant='outlined'
            component='span'
            startIcon={<CloudUploadIcon />}
          >
            Upload Files
          </Button>
        </label>
        {fileList &&
          fileList.length > 0 && <div></div>
          // fileList.map((fileName) => (
          //   <p style={{ fontWeight: "500", fontSize: "14px" }}>
          //     Selected file for {fieldName}: {fileName}
          //   </p>
          // ))
        }
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}
