"use client";

import { useState } from "react";
import {
  Alert,
  Button,
  Grid,
  GridCol,
  Radio,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import { JOBSUITE_API_BASE, JOBSUITE_CONTRACTOR_ID } from "@/lib/site";

type YesNo = "Yes" | "No";

const INITIAL = {
  website: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  authorizedToWork: "" as YesNo | "",
  hasTransportation: "" as YesNo | "",
  hasReferences: "" as YesNo | "",
  references: "",
  comments: "",
};

export function EmploymentForm() {
  const [values, setValues] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const set =
    (key: keyof typeof INITIAL) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const setRadio = (key: "authorizedToWork" | "hasTransportation" | "hasReferences") => (value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const required = [
      { value: values.firstName.trim(), message: "Please enter your first name." },
      { value: values.lastName.trim(), message: "Please enter your last name." },
      { value: values.email.trim(), message: "Please enter your email." },
      { value: values.phone.trim(), message: "Please enter your phone number." },
      { value: values.authorizedToWork, message: "Please answer whether you are authorized to work in the United States." },
      { value: values.hasTransportation, message: "Please answer whether you have transportation." },
      { value: values.hasReferences, message: "Please answer whether you have references we can contact." },
    ];
    const missing = required.find((r) => !r.value);
    if (missing) {
      setAlert({ type: "error", message: missing.message });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        contractor_id: JOBSUITE_CONTRACTOR_ID,
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        email: values.email.trim(),
        phone_number: values.phone.trim(),
        authorized_to_work: values.authorizedToWork as YesNo,
        has_transportation: values.hasTransportation as YesNo,
        has_references: values.hasReferences as YesNo,
        references: values.references.trim() || undefined,
        comments: values.comments.trim() || undefined,
        website: values.website || undefined,
      };

      const response = await fetch(`${JOBSUITE_API_BASE}/api/v1/public/employment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detail =
          typeof errorData.detail === "string" ? errorData.detail : "Failed to submit form.";
        throw new Error(detail);
      }

      setValues(INITIAL);
      setAlert({ type: "success", message: "Form submitted successfully! We'll be in touch." });
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err instanceof Error ? err.message : "There was an error submitting the form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Honeypot */}
      <div
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <label htmlFor="employment-website">Website</label>
        <input
          type="text"
          id="employment-website"
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={values.website}
          onChange={(e) => set("website")(e)}
        />
      </div>

      {alert && (
        <Alert
          color={alert.type === "success" ? "green" : "red"}
          variant="light"
          mb="md"
          onClose={() => setAlert(null)}
          withCloseButton
          title={alert.type === "success" ? "Success" : undefined}
          icon={alert.type === "success" ? <IconCircleCheck size={22} /> : undefined}
          styles={
            alert.type === "success"
              ? { root: { fontSize: "var(--mantine-font-size-md)" } }
              : undefined
          }
        >
          {alert.message}
        </Alert>
      )}

      <Stack gap="md">
        <Grid>
          <GridCol span={{ base: 12, md: 6 }}>
            <TextInput
              label="First name"
              required
              autoComplete="given-name"
              value={values.firstName}
              onChange={set("firstName")}
              placeholder="First name"
            />
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <TextInput
              label="Last name"
              required
              autoComplete="family-name"
              value={values.lastName}
              onChange={set("lastName")}
              placeholder="Last name"
            />
          </GridCol>
        </Grid>

        <TextInput
          label="Email"
          type="email"
          required
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          placeholder="you@example.com"
        />

        <TextInput
          label="Phone number"
          type="tel"
          required
          autoComplete="tel"
          value={values.phone}
          onChange={set("phone")}
          placeholder="123-456-7890"
        />

        <Radio.Group
          label="Are you authorized to work in the United States?"
          description=""
          required
          value={values.authorizedToWork}
          onChange={setRadio("authorizedToWork")}
        >
          <Stack gap="xs" mt="xs">
            <Radio value="Yes" label="Yes" />
            <Radio value="No" label="No" />
          </Stack>
        </Radio.Group>

        <Radio.Group
          label="Do you have transportation?"
          required
          value={values.hasTransportation}
          onChange={setRadio("hasTransportation")}
        >
          <Stack gap="xs" mt="xs">
            <Radio value="Yes" label="Yes" />
            <Radio value="No" label="No" />
          </Stack>
        </Radio.Group>

        <Radio.Group
          label="Do you have any references that we can contact from past jobs?"
          required
          value={values.hasReferences}
          onChange={setRadio("hasReferences")}
        >
          <Stack gap="xs" mt="xs">
            <Radio value="Yes" label="Yes" />
            <Radio value="No" label="No" />
          </Stack>
        </Radio.Group>

        <Textarea
          label="My References"
          minRows={3}
          value={values.references}
          onChange={set("references")}
          placeholder="Names and contact info for references (optional)"
        />

        <Textarea
          label="Any Comments?"
          minRows={4}
          value={values.comments}
          onChange={set("comments")}
          placeholder="Additional comments (optional)"
        />
        {alert && (
            <Alert
            color={alert.type === "success" ? "green" : "red"}
            variant="light"
            mb="md"
            onClose={() => setAlert(null)}
            withCloseButton
            title={alert.type === "success" ? "Success" : undefined}
            icon={alert.type === "success" ? <IconCircleCheck size={22} /> : undefined}
            styles={
                alert.type === "success"
                ? { root: { fontSize: "var(--mantine-font-size-md)" } }
                : undefined
            }
            >
            {alert.message}
            </Alert>
        )}
        <Button type="submit" fullWidth size="md" loading={loading}>
          SUBMIT FORM
        </Button>
      </Stack>
    </form>
  );
}
