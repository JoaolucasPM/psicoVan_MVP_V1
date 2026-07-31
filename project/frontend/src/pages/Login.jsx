import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((formAnterior) => ({
      ...formAnterior,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(
        `${API_URL}/accounts/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
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
        throw new Error(
          data.error ||
            data.detail ||
            "E-mail ou senha inválidos."
        );
      }

      localStorage.setItem(
        "usuario",
        JSON.stringify(data)
      );

      navigate("/pacientes");
    } catch (error) {
      setErro(
        error.message || "Erro ao realizar login."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />

      <section className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-5 shadow-2xl backdrop-blur sm:rounded-3xl sm:p-8">
          <header className="mb-7 text-center sm:mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-3xl shadow-lg shadow-blue-600/20 sm:h-20 sm:w-20 sm:text-4xl">
              🧠
            </div>

            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Portal do Psicólogo
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-400 sm:text-base">
              Entre para gerenciar pacientes e avaliações.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
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
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 pr-24 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarSenha(
                      (estadoAtual) =>
                        !estadoAtual
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-blue-400 transition hover:bg-slate-700 hover:text-blue-300 sm:text-sm"
                >
                  {mostrarSenha
                    ? "Ocultar"
                    : "Mostrar"}
                </button>
              </div>
            </div>

            {erro && (
              <div
                role="alert"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-5 text-red-300"
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800" />

            <span className="text-xs uppercase tracking-wider text-slate-500">
              ou
            </span>

            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/paciente/login")
            }
            className="w-full rounded-xl border border-slate-700 px-4 py-3 font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white"
          >
            Acesso do paciente
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500 sm:text-sm">
          © 2026 PsicoVan
        </p>
      </section>
    </main>
  );
}

export default Login;