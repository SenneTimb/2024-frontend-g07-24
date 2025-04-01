import axiosRoot from 'axios';
import { toast } from 'react-toastify';

// TODO fix de base url in de meta.env
const baseUrl = import.meta.env.VITE_API_URL;
// const baseUrl = "http://localhost:9000/api";

export const axios = axiosRoot.create({
  baseURL: baseUrl,
});

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response !== undefined &&
    error.response.status >= 400 &&
    error.response.status < 500

  if (error.code === 'ERR_NETWORK') {
    return toast.error('Network fout: server niet gevonden')
  }
  if (!expectedError) {

    if(error.response.data.message && error.response.data.message === "jwt expired") {
      return toast.error('Login sessie verlopen')
    }
    return toast.error('Onverwachte server fout!')
  }

  return toast.error(
    `Server fout: ${(error.response?.data?.message !== undefined ? error.response?.data?.message : error.message)} ${
      error.response?.data?.details != null
        ? 'details: ' + JSON.stringify(error.response.data.details)
        : ''
    }`
  )
})

export const setAuthToken = (token) => {
  console.log(token);
  if (token) {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};

export const getAll = async (url) => {
  const { data } = await axios.get(`${baseUrl}/${url}`);

  return data;
};


export const login = async (url, {arg}) => {
  console.log(url + `?rol=${arg.rol} ${arg.email} ${arg.password}`);

  const {
    data,
  } = await axios.post(`${url}`, {
    email: arg.email,
    password: arg.password,
    rol: arg.rol
  });
  console.log(data);
  return data;
};


export const put = async (url, {arg}) => {
  console.log(`args put: ${JSON.stringify(arg)}`);
  const {
    data,
  } = await axios.put(`${baseUrl}/${url}`, 
    arg
  );
  return data;
};

export const post = async (url, { arg }) => {
  console.log(`args put: ${JSON.stringify(arg)}`);
  const { data } = await axios.post(`${baseUrl}/${url}`, arg);
  return data;
};

export const save = async (url, { arg: body }) => {
  const { id, ...values } = body;
  await axios({
    method: id ? "PUT" : "POST",
    url: `${baseUrl}/${url}/${id ?? ""}`,
    data: values,
  });
};

export const getById = async (url) => {
  const { data } = await axios.get(`${baseUrl}/${url}`);

  return data;
};
