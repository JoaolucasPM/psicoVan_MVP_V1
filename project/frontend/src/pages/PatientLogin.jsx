import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function PatientLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await fetch(
        `${API_URL}/patients/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      localStorage.setItem(
        "patient",
        JSON.stringify(data)
      );

      navigate(`/paciente/${data.id}/avaliacoes`);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-700 via-teal-700 to-cyan-600 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <span className="text-4xl">🧠</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Área do Paciente
          </h1>

          <p className="mt-2 text-slate-500">
            Entre para realizar sua avaliação.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />

          {erro && (
            <div className="rounded-xl bg-red-100 p-3 text-red-700">
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default PatientLogin;