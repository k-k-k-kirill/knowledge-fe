import React, { useRef, useState } from "react";
import { Button, List, ListItem, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface FileUploadButtonProps {
  onFileSelect: (files: File[] | null) => void;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[] | null>(null);

  let fileInput = useRef<HTMLInputElement>(null);

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      onFileSelect(filesArray);
    }
  };

  return (
    <>
      <input
        ref={fileInput}
        type="file"
        hidden
        multiple
        accept=".json, .pdf, .docx"
        onChange={handleFileInput}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInput.current?.click()}
      >
        Upload
      </Button>
      {selectedFiles && (
        <List>
          {selectedFiles.map((file, index) => (
            <ListItem key={index}>
              <Typography variant="body1">{file.name}</Typography>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};
