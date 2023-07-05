import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box, Typography, TextField } from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { TextInput } from "../Forms/TextInput/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileUpload } from "../Forms/FileUpload";
import { Wikis as WikisApi } from "../../api/Wikis";
import { Embeddings as EmbeddingsApi } from "../../api/Embeddings";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { Toggle, ToggleContainer } from "../Forms/Toggle";
import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as PlainTextIcon } from "../../assets/text.svg";
import { ReactComponent as UrlIcon } from "../../assets/outline-url.svg";
import { TextArea } from "../Forms/TextArea";

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
            </FormBlock>
          )}

          {sourceType === "text" && (
            <FormBlock>
              {/* <TextField
                id="outlined-multiline-static"
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
              /> */}
              <TextArea
                placeholder="Add text here"
                name="text"
                value={values.text}
                onChange={handleChange}
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
