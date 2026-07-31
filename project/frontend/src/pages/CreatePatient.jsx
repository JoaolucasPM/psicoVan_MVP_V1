import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";

function CreatePatient() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

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

    setForm((formAnterior) => ({
      ...formAnterior,
      [name]: value,
    }));
  }

  function validarIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(
      `${dataNascimento}T00:00:00`
    );

    let idade =
      hoje.getFullYear() -
      nascimento.getFullYear();

    const mes =
      hoje.getMonth() -
      nascimento.getMonth();

    if (
      mes < 0 ||
      (mes === 0 &&
        hoje.getDate() <
          nascimento.getDate())
    ) {
      idade -= 1;
    }

    return idade >= 7;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");

    if (!usuario?.id) {
      setErro(
        "Psicólogo não encontrado. Faça login novamente."
      );
      return;
    }

    if (!validarIdade(form.birthday)) {
      setErro(
        "O paciente precisa ter pelo menos 7 anos."
      );
      return;
    }

    setCarregando(true);

    try {
      const response = await fetch(
        `${API_URL}/patients/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            password: form.password,
            birthday: form.birthday,
            sex: Number(form.sex),
            locale: form.locale,
            created_by: usuario.id,
          }),
        }
      );

      const texto = await response.text();

      let data;

      try {
        data = JSON.parse(texto);
      } catch {
        throw new Error(
          "O backend retornou uma resposta inválida."
        );
      }

      if (!response.ok) {
        const mensagem = Object.entries(data)
          .map(([campo, mensagens]) => {
            const textoErro = Array.isArray(
              mensagens
            )
              ? mensagens.join(", ")
              : mensagens;

            return `${campo}: ${textoErro}`;
          })
          .join(" | ");

        throw new Error(
          mensagem ||
            "Erro ao cadastrar paciente."
        );
      }

      navigate("/pacientes");
    } catch (error) {
      setErro(
        error.message ||
          "Erro ao cadastrar paciente."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 px-4 py-6 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-8">
          <header className="mb-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  Novo paciente
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  Cadastre os dados pessoais e de acesso do paciente.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/pacientes")
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
              >
                Voltar
              </button>
            </div>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="first_name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nome
                </label>

                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Digite o nome"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Sobrenome
                </label>

                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Digite o sobrenome"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="paciente@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Senha
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    mostrarSenha
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Crie uma senha para o paciente"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-24 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha(
                      (estadoAtual) =>
                        !estadoAtual
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-800 sm:text-sm"
                >
                  {mostrarSenha
                    ? "Ocultar"
                    : "Mostrar"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use pelo menos 8 caracteres.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="birthday"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Data de nascimento
                </label>

                <input
                  id="birthday"
                  name="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <p className="mt-2 text-xs text-slate-500">
                  O paciente precisa ter pelo menos 7 anos.
                </p>
              </div>

              <div>
                <label
                  htmlFor="sex"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Sexo
                </label>

                <select
                  id="sex"
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">
                    Selecione
                  </option>
                  <option value="1">
                    Masculino
                  </option>
                  <option value="2">
                    Feminino
                  </option>
                </select>
              </div>
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                {erro}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate("/pacientes")
                }
                className="w-full rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {carregando
                  ? "Cadastrando..."
                  : "Cadastrar paciente"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default CreatePatient;