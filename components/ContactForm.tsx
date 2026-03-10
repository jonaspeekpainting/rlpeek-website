"use client";

import { useState, useEffect } from "react";
import {
  Alert,
  Button,
  Grid,
  GridCol,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { JOBSUITE_API_BASE, JOBSUITE_CONTRACTOR_ID } from "@/lib/site";
import { MARKETING_SOURCE_STORAGE_KEY } from "@/components/MarketingSourceCapture";

const REFERRAL_OPTIONS = [
  { value: "", label: "Please select..." },
  { value: "social_media", label: "Social Media" },
  { value: "past_customer", label: "Past Customer" },
  { value: "referral", label: "Referral" },
  { value: "postcard", label: "Postcard" },
  { value: "trucks", label: "Saw Your Trucks in the Neighborhood" },
  { value: "yard_sign", label: "Yard Sign" },
  { value: "google", label: "Google Search" },
  { value: "google-ads", label: "Google Ads" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "other", label: "Other" },
];

/** Maps URL source param (e.g. "google-vision") to REFERRAL_OPTIONS value */
const SOURCE_TO_REFERRAL: Record<string, string> = {
  google: "google",
  google_vision: "google-ads",
  google_phone_leads: "google-ads",
  google_search: "google",
  facebook: "facebook",
  instagram: "instagram",
  social_media: "social_media",
  past_customer: "past_customer",
  referral: "referral",
  postcard: "postcard",
  trucks: "trucks",
  yard_sign: "yard_sign",
  other: "other",
};

const JOB_TYPE_OPTIONS = [
  { value: "", label: "Please select..." },
  { value: "Interior", label: "Interior" },
  { value: "Exterior", label: "Exterior" },
  { value: "Both", label: "Interior and Exterior" },
];

const INITIAL = {
  website: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "Utah",
  postalCode: "",
  country: "US",
  referralSource: "",
  referralName: "",
  jobType: "",
  services: "",
};

export function ContactForm() {
  const [values, setValues] = useState(INITIAL);
  const [referralSourceLocked, setReferralSourceLocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [bookingOpened, { open: openBooking, close: closeBooking }] = useDisclosure(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(MARKETING_SOURCE_STORAGE_KEY);
      if (!raw || !raw.trim()) return;
      const normalized = raw.trim().toLowerCase().replace(/-/g, "_");
      const referralValue = SOURCE_TO_REFERRAL[normalized] ?? "other";
      setValues((prev) => ({ ...prev, referralSource: referralValue }));
      setReferralSourceLocked(true);
    } catch {
      // ignore
    }
  }, []);

  const showReferralName = values.referralSource === "referral";

  const set = (key: keyof typeof INITIAL) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
    const value = typeof e === "string" ? e : e.target.value;
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const setSelect = (key: keyof typeof INITIAL) => (value: string | null) => {
    setValues((prev) => ({ ...prev, [key]: value ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    const required = [
      { value: values.firstName.trim(), message: "Please enter your first name." },
      { value: values.lastName.trim(), message: "Please enter your last name." },
      { value: values.email.trim(), message: "Please enter your email." },
      { value: values.phone.trim(), message: "Please enter your phone number." },
      { value: values.address1.trim(), message: "Please enter your street address." },
      { value: values.city.trim(), message: "Please enter your city." },
      { value: values.referralSource, message: "Please select how you heard about us." },
      { value: values.jobType, message: "Please select a job type." },
      { value: values.services.trim(), message: "Please describe the services requested." },
    ];
    const missing = required.find((r) => !r.value);
    if (missing) {
      setAlert({ type: "error", message: missing.message });
      return;
    }
    if (showReferralName && !values.referralName.trim()) {
      setAlert({ type: "error", message: "Please enter who referred you." });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        contractor_id: JOBSUITE_CONTRACTOR_ID,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        phone_number: values.phone,
        address_street: values.address1,
        address_street_2: values.address2,
        address_city: values.city,
        address_state: values.state,
        address_zipcode: values.postalCode,
        address_country: values.country,
        services: values.services,
        referral_source: values.referralSource,
        referral_name: showReferralName ? values.referralName : "",
        job_type: values.jobType,
        website: values.website,
      };

      const response = await fetch(`${JOBSUITE_API_BASE}/api/v1/public/estimates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const detail = typeof errorData.detail === "string" ? errorData.detail : "Failed to submit form.";
        throw new Error(detail);
      }

      setValues((prev) =>
        referralSourceLocked ? { ...INITIAL, referralSource: prev.referralSource } : INITIAL
      );
      setAlert({ type: "success", message: "Form submitted successfully!" });
      openBooking();
    } catch (err) {
      setAlert({
        type: "error",
        message: err instanceof Error ? err.message : "There was an error submitting the form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Honeypot */}
        <div style={{ position: "absolute", left: -9999, top: 0, opacity: 0, pointerEvents: "none" }} aria-hidden>
          <label htmlFor="contact-website">Website</label>
          <input
            type="text"
            id="contact-website"
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

          <TextInput
            label="Street Address Line 1"
            required
            autoComplete="street-address"
            value={values.address1}
            onChange={set("address1")}
            placeholder="Street address"
          />

          <TextInput
            label="Street Address Line 2"
            autoComplete="address-line2"
            value={values.address2}
            onChange={set("address2")}
            placeholder="Apt, suite, etc. (optional)"
          />

          <Grid>
            <GridCol span={{ base: 12, md: 4 }}>
              <TextInput
                label="City"
                required
                name="city"
                value={values.city}
                onChange={set("city")}
                placeholder="City"
              />
            </GridCol>
            <GridCol span={{ base: 12, md: 4 }}>
              <Select
                label="State"
                name="state"
                data={[{ value: "Utah", label: "Utah" }]}
                value={values.state}
                onChange={setSelect("state")}
              />
            </GridCol>
            <GridCol span={{ base: 12, md: 4 }}>
              <TextInput
                label="Postal Code"
                name="zip"
                value={values.postalCode}
                onChange={set("postalCode")}
                placeholder="ZIP"
              />
            </GridCol>
          </Grid>

          <Select
            label="Country"
            name="country"
            data={[{ value: "US", label: "US" }]}
            value={values.country}
            onChange={setSelect("country")}
          />

          <Select
            label="How did you hear about us?"
            required
            data={REFERRAL_OPTIONS}
            value={values.referralSource || null}
            onChange={setSelect("referralSource")}
            placeholder="Please select..."
            disabled={referralSourceLocked}
            title={referralSourceLocked ? "Set from your visit link" : undefined}
          />

          {showReferralName && (
            <TextInput
              label="Who referred you? We want to send them a thank you!"
              required
              value={values.referralName}
              onChange={set("referralName")}
              placeholder="Referrer name"
            />
          )}

          <Select
            label="Job Type"
            required
            data={JOB_TYPE_OPTIONS}
            value={values.jobType || null}
            onChange={setSelect("jobType")}
            placeholder="Please select..."
          />

          <Textarea
            label="Services Requested"
            required
            minRows={3}
            value={values.services}
            onChange={set("services")}
            placeholder="Describe the services you need..."
          />

          <Text size="sm" c="dimmed">
            The protection of your privacy is important to us at RL Peek Painting. Rest assured that the personal
            information you provide us with will not be disclosed to other parties and will be used solely for the
            purpose of bringing you the best service possible.
          </Text>

          <Button type="submit" fullWidth size="md" loading={loading}>
            SUBMIT FORM
          </Button>
        </Stack>
      </form>

      <Modal
        opened={bookingOpened}
        onClose={closeBooking}
        title="Schedule Your Estimate"
        size="xl"
        centered
      >
        <div style={{ position: "relative", paddingBottom: "75%", height: 0, overflow: "hidden" }}>
          <iframe
            title="Google Calendar Appointment Scheduling"
            src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3TbCNUdus5M5DNEJnhoywoleYeS4d6D7xbPhy2FrQ8NnCZ40jsaa0FASHP4ydfOuER44K1SbCs?gv=true"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Modal>
    </>
  );
}
