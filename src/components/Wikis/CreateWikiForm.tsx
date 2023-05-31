import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box } from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { TextInput } from "../Forms/TextInput";
import { Wikis as WikisApi } from "../../api/Wikis";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";

interface CreateWikiFormProps {
  onCancel: () => void;
}

const CreateWikiSchema = Yup.object().shape({
  name: Yup.string().required("Wiki name is required"),
});

export const CreateWikiForm: React.FC<CreateWikiFormProps> = ({ onCancel }) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.create(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wikis"] });
    },
  });

  return (
    <Formik
      validationSchema={CreateWikiSchema}
      initialValues={{ name: "" }}
      onSubmit={(values) => {
        mutation.mutate(values.name);
        onCancel();
      }}
    >
      {({ errors, values, handleChange, handleBlur }) => (
        <Form>
          <FormBlock>
            <TextInput
              type="text"
              id="outlined-basic"
              label="Wiki name"
              name="name"
              placeholder="Wiki name"
              variant="outlined"
              required={true}
              error={!!errors.name}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={errors.name ?? ""}
            />
          </FormBlock>
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
