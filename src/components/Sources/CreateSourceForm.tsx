import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { TextInput } from "../Forms/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUploadButton } from "../Forms/FileUploadButton";
import { Embeddings as EmbeddingsApi } from "../../api/Embeddings";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface CreateSourceFormProps {
  onCancel: () => void;
}

interface UploadFileParams {
  files: File[];
  wikiId: string;
}

interface AddUrlParams {
  url: string;
  wikiId: string;
}

const CreateSourceSchema = Yup.object().shape({
  sourceType: Yup.string().required("Source type is required"),
  files: Yup.mixed().when(["sourceType"], {
    is: (sourceType: string) => sourceType === "file",
    then: (schema) => schema.required("At least one file is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  url: Yup.string().when(["sourceType"], {
    is: (sourceType: string) => sourceType === "url",
    then: (schema) =>
      schema.required("A URL is required").url("Invalid URL format"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export const CreateSourceForm: React.FC<CreateSourceFormProps> = ({
  onCancel,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { wikiId } = useParams();

  const queryClient = useQueryClient();

  const uploadFileMutation = useMutation({
    mutationFn: async ({ files, wikiId }: UploadFileParams) => {
      const token = await getAccessTokenSilently();
      const embeddingsApi = new EmbeddingsApi(token);
      return embeddingsApi.uploadFiles(files, wikiId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`wiki:${wikiId}`] });
      onCancel();
    },
    onError: () => onCancel(),
  });

  const addUrlMutation = useMutation({
    mutationFn: async ({ url, wikiId }: AddUrlParams) => {
      const token = await getAccessTokenSilently();
      const embeddingsApi = new EmbeddingsApi(token);
      return embeddingsApi.addUrl(url, wikiId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`wiki:${wikiId}`] });
      onCancel();
    },
    onError: () => onCancel(),
  });

  const [sourceType, setSourceType] = useState<string>("file");

  const handleSourceTypeChange = (event: SelectChangeEvent<any>) => {
    setSourceType(event.target.value as string);
  };

  return (
    <Formik
      validationSchema={CreateSourceSchema}
      initialValues={{ sourceType: "file", url: "", files: null }}
      onSubmit={(values) => {
        if (values.files && wikiId) {
          uploadFileMutation.mutate({
            files: values.files,
            wikiId,
          });
        }

        if (values.url && values.url !== "" && wikiId) {
          addUrlMutation.mutate({
            url: values.url,
            wikiId,
          });
        }
      }}
    >
      {({ errors, values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <FormBlock>
            <FormControl fullWidth>
              <InputLabel id="source-type-label">Source Type</InputLabel>
              <Select
                fullWidth
                labelId="source-type-label"
                id="source-type"
                name="sourceType"
                value={values.sourceType}
                onChange={(event) => {
                  handleChange(event);
                  handleSourceTypeChange(event);
                }}
                onBlur={handleBlur}
              >
                <MenuItem value={"file"}>Upload file</MenuItem>
                <MenuItem value={"url"}>Provide URL</MenuItem>
              </Select>
            </FormControl>
          </FormBlock>
          {sourceType === "file" && (
            <FormBlock>
              <FileUploadButton
                onFileSelect={(files: File[] | null) => {
                  setFieldValue("files", files);
                }}
              />
              {errors.files && <Typography>{errors.files}</Typography>}
            </FormBlock>
          )}

          {sourceType === "url" && (
            <FormBlock>
              <TextInput
                type="text"
                id="outlined-basic"
                label="Source URL"
                name="url"
                placeholder="Source URL"
                variant="outlined"
                required={true}
                error={!!errors.url}
                value={values.url}
                onChange={handleChange}
                onBlur={handleBlur}
                helperText={errors.url ?? ""}
              />
            </FormBlock>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: "1rem" }}
              onClick={onCancel}
              type="submit"
              variant="text"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
