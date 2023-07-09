import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box } from "@mui/material";
import { FormBlock } from "../Forms/FormBlock";
import { TextInput } from "../Forms/TextInput/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { useAuth0 } from "@auth0/auth0-react";

const EditWikiSchema = Yup.object().shape({
  wikiName: Yup.string().required("Wiki name is required"),
});

interface EditWikiProps {
  wikiId: string;
  initialName: string;
  onCancel: any;
}

export const EditWikiForm: React.FC<EditWikiProps> = ({
  wikiId,
  initialName,
  onCancel,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const editWikiMutation = useMutation({
    mutationFn: async ({ wikiName }: { wikiName: string }) => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      await wikisApi.update(wikiId, { name: wikiName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`wiki:${wikiId}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["wikis"],
      });
      onCancel();
    },
  });

  return (
    <Formik
      validationSchema={EditWikiSchema}
      initialValues={{ wikiName: initialName }}
      onSubmit={(values) => {
        editWikiMutation.mutate(values);
      }}
    >
      {({ errors, values, handleChange, handleBlur }) => (
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: "1rem" }}
              onClick={onCancel}
              type="submit"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save changes
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
