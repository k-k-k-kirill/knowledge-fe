import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { ReactComponent as FileIcon } from "../../assets/file.svg";
import { ReactComponent as RemoveIcon } from "../../assets/remove.svg";
import { IconFab } from "../IconFab";

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  isLoading: boolean;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isLoading,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/json": [".json"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setSelectedFiles(acceptedFiles);
      onFileSelect(acceptedFiles);
    },
  });

  const onDeleteFileClick = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
    onFileSelect(newSelectedFiles);
  };

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #D4D4D4",
          p: 4,
          mt: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          minHeight: 56,
          backgroundColor: isDragActive ? "#f8f8f8" : "white",
          fontSize: "0.875rem",
        }}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <CloudUploadIcon sx={{ color: "#D4D4D4", mt: 2, fontSize: 40 }} />
            <Typography variant="body1">
              Drag 'n' drop some files here, or click to select files
            </Typography>
          </>
        )}
      </Box>
      {selectedFiles.length > 0 && (
        <List>
          {selectedFiles.map((file, index) => (
            <ListItem key={index}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ marginRight: "1.5rem" }}>
                  <FileIcon style={{ marginTop: "0.5rem" }} />
                </Box>
                <Box>
                  <Box
                    sx={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {file.name}{" "}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "0.75rem",
                      color: "#7D838A",
                      marginRight: "1.5rem",
                    }}
                  >
                    Size {formatBytes(file.size)}
                  </Box>
                </Box>
                <Box>
                  <IconFab
                    onClick={() => onDeleteFileClick(index)}
                    sx={{ marginLeft: "1.5rem" }}
                  >
                    <RemoveIcon />
                  </IconFab>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};
