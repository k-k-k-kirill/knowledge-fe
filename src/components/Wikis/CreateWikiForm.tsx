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
  TextField,
} from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { TextInput } from "../Forms/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUploadButton } from "../Forms/FileUploadButton";
import { Wikis as WikisApi } from "../../api/Wikis";
import { Embeddings as EmbeddingsApi } from "../../api/Embeddings";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const CreateWikiAndSourceSchema = Yup.object().shape({
  wikiName: Yup.string().required("Wiki name is required"),
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
  text: Yup.string().when(["sourceType"], {
    is: (sourceType: string) => sourceType === "text",
    then: (schema) => schema.required("Text is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface CreateWikiAndSourcesProps {
  onCancel: any;
}

export const CreateWikiAndSourcesForm: React.FC<CreateWikiAndSourcesProps> = ({
  onCancel,
}) => {
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const [sourceType, setSourceType] = useState<string>("file");

  const handleSourceTypeChange = (event: SelectChangeEvent<any>) => {
    setSourceType(event.target.value as string);
  };

  const createWikiAndSourceMutation = useMutation({
    mutationFn: async ({
      wikiName,
      files,
      url,
      text,
    }: {
      wikiName: string;
      files: File[] | null;
      url: string;
      text: string;
    }) => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      const embeddingsApi = new EmbeddingsApi(token);
      const wiki = await wikisApi.create(wikiName);

      let uploads = null;

      if (sourceType === "file" && files) {
        uploads = await embeddingsApi.uploadFiles(files, wiki.id);
        console.log(uploads);
      } else if (sourceType === "url" && url !== "") {
        uploads = await embeddingsApi.addUrl(url, wiki.id);
      } else if (sourceType === "text" && text !== "") {
        uploads = await embeddingsApi.addPlainText(text, wiki.id);
      }

      return {
        wiki,
        uploads,
      };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["wikis", `wiki:${data.wiki.id}`],
      });
      navigate(`/wikis/${data.wiki.id}`);
      onCancel();
    },
  });

  return (
    <Formik
      validationSchema={CreateWikiAndSourceSchema}
      initialValues={{
        wikiName: "",
        sourceType: "file",
        url: "",
        files: null,
        text: "",
      }}
      onSubmit={(values) => {
        createWikiAndSourceMutation.mutate(values);
      }}
    >
      {({ errors, values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <FormBlock>
            <TextInput
              type="text"
              id="outlined-basic"
              label="Wiki name"
              name="wikiName"
              placeholder="Wiki name"
              variant="outlined"
              required={true}
              error={!!errors.wikiName}
              value={values.wikiName}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.wikiName ?? ""}
            />
          </FormBlock>
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
                <MenuItem value={"text"}>Plain text</MenuItem>
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

          {sourceType === "text" && (
            <FormBlock>
              <TextField
                id="outlined-multiline-static"
                label="Plain text"
                multiline
                fullWidth
                rows={4}
                defaultValue="Default Value"
                variant="outlined"
                name="text"
                value={values.text}
                onChange={handleChange}
                onBlur={handleBlur}
                error={!!errors.text}
                helperText={errors.text ?? ""}
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
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
