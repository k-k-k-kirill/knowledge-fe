import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box } from "@mui/material";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { Wikis as WikisApi } from "../../api/Wikis";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Wiki } from "../../types";
import { useAuth0 } from "@auth0/auth0-react";
import { TextInput } from "../Forms/TextInput/TextInput";
import { useNavigate } from "react-router-dom";
import { WikiInput } from "../Wikis/WikiInput";

interface CreateChatbotFormProps {
  onCancel: () => void;
}

interface CreateChatbotParams {
  name: string;
  wikiIds: string[];
}

const CreateChatbotSchema = Yup.object().shape({
  name: Yup.string().required("Chatbot name is required"),
  wikis: Yup.array().min(1, "At least one wiki must be selected"),
});

export const CreateChatbotForm: React.FC<CreateChatbotFormProps> = ({
  onCancel,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data: wikis } = useQuery({
    queryKey: ["wikis"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getAll();
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ name, wikiIds }: CreateChatbotParams) => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      const chatbotId = await chatbotsApi.create(name, wikiIds);
      return chatbotId;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chatbots"] });
      navigate(`/chatbots/${data}`);
      onCancel();
    },
    onError: () => onCancel(),
  });

  return (
    <Formik
      validationSchema={CreateChatbotSchema}
      initialValues={{ name: "", wikis: [] }}
      onSubmit={(values) => {
        mutation.mutate({
          name: values.name,
          wikiIds: values.wikis.map((wiki: Wiki) => wiki.id),
        });
        onCancel();
      }}
    >
      {({ errors, values, handleChange, handleBlur, setFieldValue }) => (
        <Form>
          <TextInput
            sx={{ marginBottom: "1rem" }}
            type="text"
            id="outlined-basic"
            name="name"
            placeholder="Chatbot name"
            variant="outlined"
            required={true}
            error={!!errors.name}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={errors.name ?? ""}
          />
          <WikiInput wikiOptions={wikis} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: "1rem" }}
              onClick={onCancel}
              variant="outlined"
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
