import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useAuth } from "../contexts/Auth.context";
import Error from "../components/Error";
import { loginValidationRules } from "../validation/validationschema";
import { post } from "../api";
import { toast } from "react-toastify";

export default function HerstelLogin() {
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [email, setEmail] = useState("");

  const redirect = useMemo(() => {
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("redirect")) return urlParams.get("redirect");
    return "/bestellingen";
  }, [search]);

  const methods = useForm({
    resolver: async (data) => {
      const { error, value: values } = loginValidationRules.validate(data, {
        abortEarly: false,
      });

      return {
        values: error ? {} : values,
        errors: error
          ? error.details.reduce((previous, currentError) => {
              return {
                ...previous,
                [currentError.path[0]]: currentError,
              };
            }, {})
          : {},
      };
    },
  });

  const { handleSubmit, reset } = methods;

  const [selectedRole, setSelectedRole] = useState("KLANT"); 

  const handleCancel = useCallback(() => {
    reset();
    navigate("/", { replace: true });
  }, [reset, navigate, redirect]);

  const handleSendEmail = useCallback(async () => {
    if (!email) {
      console.error("Email is required");
      return;
    }
    try {
      toast.promise(
        post("users/wijzig-wachtwoord", {
          arg: { email, rol: selectedRole },
        }),
        {
          pending: "Email aan het versturen...",
          success: "Email verstuurd!",
          error:
            "Er is iets fout gelopen bij het sturen van de mail, probeer opnieuw",
        }
      );
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }, [email, selectedRole]);

  return (
    <FormProvider {...methods}>
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form className="d-flex flex-column">
          <h1 className="text-center">Herstel uw account</h1>

          <Error error={error} />

          <LabelInput
            label="Email"
            type="email"
            name="email"
            placeholder="michael.scott@gmail.com"
            data-cy="email_input"
            validationRules={loginValidationRules.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="role">Selecteer over welke account het gaat:</label>
          <select
            id="role"
            name="role"
            defaultValue="KLANT"
            className="form-select"
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="KLANT">Klant</option>
            <option value="LEVERANCIER">Leverancier</option>
          </select>

          <div className="clearfix">
            <div className="btn-group float-end">
              <button
                type="button"
                data-cy="submit_btn"
                className="btn btn-primary"
                disabled={loading}
                onClick={handleSendEmail}
                style={{ margin: "10px", borderRadius: "5px" }}
              >
                Stuur herstellings mail
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCancel}
                style={{ margin: "10px", borderRadius: "5px" }}
              >
                Annuleer
              </button>
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
