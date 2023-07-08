import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box } from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { TextInput } from "../Forms/TextInput/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { Embeddings as EmbeddingsApi } from "../../api/Embeddings";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { SourceInput } from "../Sources/SourceInput";

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

  const [sourceType] = useState<string>("file");

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
        queryKey: ["wikis"],
      });
      queryClient.invalidateQueries({
        queryKey: [`wiki:${data.wiki.id}`],
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
          <SourceInput />
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
