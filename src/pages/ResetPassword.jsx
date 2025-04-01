import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { put } from "../api";
import Error from "../components/Error";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { resetCode } = useParams();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      toast.promise(
        put(`users/wijzig-wachtwoord/${resetCode}`, { 
          arg: {newPassword: data.newPassword},
        }),
        {
          pending: "wachtwoord aan het wijzigen...",
          success: "Wachtwoord gewijzigd!",
          error:
            "Er is iets fout gelopen bij veranderen van het wachtwoord, probeer opnieuw",
        }
      ); 

      navigate("/login", { replace: true }); 
    } catch (err) {
      setError(err?.message || err?.response?.data?.message || "Error resetting password"); 
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h1 className="text-center" style={{ marginBottom: '30px' }}>Reset Password</h1>
      {error && <Error error={error} />}
      <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
        <div className="mb-3">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            className="form-control"
            {...register("newPassword", { required: true, minLength: 4 })}
          />
          {errors.newPassword && <p>Password must be at least 4 characters</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            className="form-control"
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === getValues("newPassword") || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div className="btn-group d-flex justify-content-between pt-4">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '5px' }}
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}
