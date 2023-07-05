import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Embeddings as EmbeddingsApi } from "../../api/Embeddings";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { SourceInput } from "./SourceInput";

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

interface AddPlainTextParams {
  text: string;
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
  text: Yup.string().when(["sourceType"], {
    is: (sourceType: string) => sourceType === "text",
    then: (schema) => schema.required("Text is required"),
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

  const addPlainText = useMutation({
    mutationFn: async ({ text, wikiId }: AddPlainTextParams) => {
      const token = await getAccessTokenSilently();
      const embeddingsApi = new EmbeddingsApi(token);
      return embeddingsApi.addPlainText(text, wikiId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`wiki:${wikiId}`] });
      onCancel();
    },
    onError: () => onCancel(),
  });

  return (
    <Formik
      validationSchema={CreateSourceSchema}
      initialValues={{ sourceType: "file", url: "", files: null, text: "" }}
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

        if (values.text && values.text !== "" && wikiId) {
          addPlainText.mutate({
            text: values.text,
            wikiId,
          });
        }
      }}
    >
      {() => (
        <Form>
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
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
