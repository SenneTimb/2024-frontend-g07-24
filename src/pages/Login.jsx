import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import LabelInput from "../components/LabelInput";
import { useAuth } from "../contexts/Auth.context";
import Error from "../components/Error";
import { loginValidationRules } from "../validation/validationschema";

export default function Login() {
  const { error, loading, login } = useAuth();
  const navigate = useNavigate();
  const { search } = useLocation();

  const redirect = useMemo(() => {
    const urlParams = new URLSearchParams(search);
    if (urlParams.has("redirect"))
      return urlParams.get("redirect");
    return "/bestellingen";
  }, [search]);

  const methods = useForm({
    resolver: async (data) => {
      const { error, value: values } = loginValidationRules.validate(data, { abortEarly: false });

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
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (shouldRedirect) {
      navigate({
        pathname: redirect,
        replace: true,
      });
    }
  }, [shouldRedirect, navigate, redirect]);

  const handleCancel = useCallback(() => {
    reset();
    navigate("/", { replace: true });
  }, [reset, navigate, redirect]);

  const handleLogin = useCallback(
    async (role, formValues) => {
      console.log(`rol = ${role}. email: ${formValues.email} ww: ${formValues.password}`)
      const { email, password } = formValues;
      const loggedIn = await login(email, password, role);

      if (loggedIn) {
        setShouldRedirect(true);
      }
    },
    [login, setShouldRedirect]
  );

  return (
    <FormProvider {...methods}>
      <div className="container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
      }}>
        <form className="d-flex flex-column">
          <h1 className="text-center" style={{marginBottom:'30px'}}>Login</h1>
          <Error error={error} />
          <LabelInput
            label="Email"
            type="text"
            name="email"
            placeholder="michael.scott@gmail.com"
            data-cy="email_input"
            validationRules={loginValidationRules.email}
            
          />

          <LabelInput
            label="Wachtwoord"
            type="password"
            name="password"
            data-cy="password_input"
            validationRules={loginValidationRules.password}
          />
          <NavLink
            data-cy="forget_btn"
            disabled={loading}
            to="/herstel"
          >
            Wachtwoord vergeten
          </NavLink>
          <div className="clearfix">
            <div className="btn-group d-flex justify-content-between pt-4" >
              {/*ga naar herstelpagina knop*/}
           
              <button
                type="button"
                data-cy="submit_btn"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => handleSubmit((data) => handleLogin('KLANT', data))()}
                style={{ borderRadius: '5px', marginRight: '10px'}}
              >
                Log in als klant
              </button>

              <button
                type="button"
                data-cy="submit_btn2"
                className="btn btn-primary"
                disabled={loading}
                onClick={() => handleSubmit((data) => handleLogin('LEVERANCIER', data))()}
                style={{ borderRadius: '5px'}}
              >
                Log in als leverancier
              </button>
             
            </div>
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
