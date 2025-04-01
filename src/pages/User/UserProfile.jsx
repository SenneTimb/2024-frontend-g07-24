import React, { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import { useAuth } from "../../contexts/Auth.context";
import { getAll, put } from "../../api/index.js";
import { formatBtwNummer } from "../../utilities/btwNummer.js";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { user, isAuthed } = useAuth();
  const { data: userData, error } = useSWR(`users/${user.id}`, getAll);

  const [editMode, setEditMode] = useState({ account: false, bedrijf: false });
  const [formData, setFormData] = useState({
    email: user.email,
    bedrijfAdres: user.bedrijfAdres,
  });

  const toggleEditMode = (section) => {
    setEditMode((prevMode) => ({
      ...prevMode,
      [section]: !prevMode[section],
    }));

    if (
      section === "account" &&
      editMode.account &&
      formData.email !== user.email
    ) {
      handleSaveChanges("account");
    }

    if (
      section === "bedrijf" &&
      editMode.bedrijf &&
      formData.bedrijfAdres !== user.bedrijfAdres
    ) {
      handleSaveChanges("bedrijf");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = useCallback(
    async (section) => {
      try {
        if (section === "account") {
          await put(`users/${user.id}`, {
            arg: { email: formData.email },
          });
          mutate(`users/${user.id}`);
        } else if (section === "bedrijf") {
          await put(`bedrijven/${user.id}`, {
            arg: {
              bedrijfAdres: formData.bedrijfAdres,
            },
          });
          mutate(`users/${user.id}`);
        }

        toast.success("Wijziging opgeslaan!");
      } catch (error) {
        toast.error("Error updating gegevens", error);
      }
    },
    [formData, user.id]
  );

  if (!isAuthed) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="alert alert-warning" role="alert">
          Please log in to view this page.
        </div>
      </div>
    );
  }

  if (error) return <div>Failed to load the user data!</div>;
  if (!userData) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center">
              <h1 data-cy="profile-title">Profiel</h1>
            </div>
            <div className="card-body">
              <div>
                <table className="info-table">
                  <thead>
                    <tr>
                      <th colSpan="2">
                        Account Details
                        <button
                          className="float-end btn btn-primary"
                          onClick={() => toggleEditMode("account")}
                        >
                          {editMode.account ? "Bevestig" : "Pas aan"}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Email</td>
                      {editMode.account ? (
                        <td>
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </td>
                      ) : (
                        <td>{userData.email}</td>
                      )}
                    </tr>
                    <tr>
                      <td>Account</td>
                      <td>{userData.rol === 2 ? "Klant" : "Leverancier"}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="info-table">
                  <thead>
                    <tr>
                      <th colSpan="2">
                        Bedrijf Details
                        <button
                          className="float-end btn btn-primary"
                          onClick={() => toggleEditMode("bedrijf")}
                        >
                          {editMode.bedrijf ? "Bevestig" : "Pas aan"}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Bedrijfsnaam</td>
                      <td>{userData.bedrijfNaam}</td>
                    </tr>
                    <tr>
                      <td>Sector</td>
                      <td>{userData.bedrijfSector}</td>
                    </tr>
                    <tr>
                      <td>Btw-nummer</td>
                      <td>{formatBtwNummer(userData.bedrijfBTW)}</td>
                    </tr>
                    <tr>
                      <td>Adres</td>
                      {editMode.bedrijf ? (
                        <td>
                          <input
                            name="bedrijfAdres"
                            value={formData.bedrijfAdres}
                            onChange={handleChange}
                          />
                        </td>
                      ) : (
                        <td>{userData.bedrijfAdres}</td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
