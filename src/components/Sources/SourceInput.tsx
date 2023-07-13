import React, { useState } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { FileUpload } from "../Forms/FileUpload";
import { TextInput } from "../Forms/TextInput/TextInput";
import { TextArea } from "../Forms/TextArea";
import { Toggle, ToggleContainer } from "../Forms/Toggle";
import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as PlainTextIcon } from "../../assets/text.svg";
import { ReactComponent as UrlIcon } from "../../assets/outline-url.svg";
import { useFormikContext } from "formik";

interface FormValues {
  sourceType: string;
  url: string;
  files: File[] | null;
  text: string;
}

interface SourceInputProps {
  isLoading: boolean;
}

export const SourceInput: React.FC<SourceInputProps> = ({ isLoading }) => {
  const { values, handleChange, handleBlur, setFieldValue, errors } =
    useFormikContext<FormValues>();
  const [sourceType, setSourceType] = useState<string>("file");

  return (
    <>
      <FormBlock>
        <ToggleContainer
          value={values.sourceType}
          exclusive
          onChange={(event, newSourceType) => {
            if (newSourceType !== null) {
              setFieldValue("sourceType", newSourceType);
              setSourceType(newSourceType);
            }
          }}
          aria-label="source type"
        >
          <Toggle value="file" aria-label="Upload file">
            <UploadIcon style={{ marginRight: "0.5rem" }} />
            Upload file
          </Toggle>
          <Toggle value="url" aria-label="Provide URL">
            <PlainTextIcon style={{ marginRight: "0.5rem" }} />
            Provide URL
          </Toggle>
          <Toggle value="text" aria-label="Plain text">
            <UrlIcon style={{ marginRight: "0.5rem" }} />
            Plain text
          </Toggle>
        </ToggleContainer>
      </FormBlock>
      {sourceType === "file" && (
        <FormBlock>
          <FileUpload
            isLoading={isLoading}
            onFileSelect={(files: File[] | null) => {
              setFieldValue("files", files);
            }}
          />
          {errors.files && <Typography>{errors.files}</Typography>}
        </FormBlock>
      )}

      {sourceType === "url" && (
        <FormBlock>
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <TextInput
              type="text"
              id="outlined-basic"
              name="url"
              placeholder="Paste URL here"
              variant="outlined"
              required={true}
              error={!!errors.url}
              value={values.url}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.url ?? ""}
            />
          )}
        </FormBlock>
      )}

      {sourceType === "text" && (
        <FormBlock>
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <TextArea
              placeholder="Add text here"
              name="text"
              value={values.text}
              onChange={handleChange}
            />
          )}
        </FormBlock>
      )}
    </>
  );
};
