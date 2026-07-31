import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function CreatePatient() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    birthday: "",
    sex: "",
    locale: "pt",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    if (!usuario?.id) {
      setErro("Psicólogo não encontrado. Faça login novamente.");
      setCarregando(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/patients/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: form.first_name,
            last_name: form.last_name,
            email: form.email,
            password: form.password,
            birthday: form.birthday,
            sex: Number(form.sex),
            locale: form.locale,
            created_by: usuario.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const mensagem = Object.entries(data)
          .map(([campo, mensagens]) => {
            const texto = Array.isArray(mensagens)
              ? mensagens.join(", ")
              : mensagens;

            return `${campo}: ${texto}`;
          })
          .join(" | ");

        throw new Error(mensagem || "Erro ao cadastrar paciente.");
      }

      navigate("/pacientes");
    } catch (error) {
      setErro(error.message || "Erro ao cadastrar paciente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Novo paciente
        </h1>

        <p className="mt-2 text-slate-500">
          Cadastre os dados de acesso do paciente.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Nome
            </label>

            <input
              name="first_name"
              type="text"
              placeholder="Nome"
              value={form.first_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sobrenome
            </label>

            <input
              name="last_name"
              type="text"
              placeholder="Sobrenome"
              value={form.last_name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              E-mail
            </label>

            <input
              name="email"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Senha
            </label>

            <div className="relative">
              <input
                name="password"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha do paciente"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-24 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                {mostrarSenha ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Data de nascimento
            </label>

            <input
              name="birthday"
              type="date"
              value={form.birthday}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Sexo
            </label>

            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="">Selecione o sexo</option>
              <option value="1">Masculino</option>
              <option value="2">Feminino</option>
            </select>
          </div>

          {erro && (
            <div className="rounded-xl bg-red-100 p-4 text-sm text-red-700">
              {erro}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/pacientes")}
              className="w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {carregando ? "Cadastrando..." : "Cadastrar paciente"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreatePatient;