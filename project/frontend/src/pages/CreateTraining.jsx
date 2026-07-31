import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "../config";

function CreateTraining() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    title: "",
    game_id: "CUT_THE_CAKE",
    status: "PENDING",
  });

  const [erro, setErro] = useState("");
  const [carregandoPacientes, setCarregandoPacientes] =
    useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarPacientes() {
      try {
        setErro("");
        setCarregandoPacientes(true);

        const response = await fetch(
          `${API_URL}/patients/`
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
              "Erro ao carregar pacientes."
          );
        }

        setPatients(data);
      } catch (error) {
        setErro(
          error.message ||
            "Erro ao carregar pacientes."
        );
      } finally {
        setCarregandoPacientes(false);
      }
    }

    carregarPacientes();
  }, []);

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

    if (!usuario?.id) {
      setErro(
        "Psicólogo não encontrado. Faça login novamente."
      );
      return;
    }

    if (!form.patient) {
      setErro("Selecione um paciente.");
      return;
    }

    setSalvando(true);

    try {
      const response = await fetch(
        `${API_URL}/trainings/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            patient: Number(form.patient),
            created_by: usuario.id,
            title: form.title.trim(),
            game_id: form.game_id,
            status: form.status,
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
            "Erro ao criar avaliação."
        );
      }

      navigate("/pacientes");
    } catch (error) {
      setErro(
        error.message ||
          "Erro ao criar avaliação."
      );
    } finally {
      setSalvando(false);
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
                  Nova avaliação
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                  Vincule uma avaliação a um paciente.
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

          {erro && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {erro}
            </div>
          )}

          {carregandoPacientes ? (
            <div className="rounded-2xl bg-slate-50 p-8 text-center">
              <p className="text-slate-500">
                Carregando pacientes...
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="patient"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Paciente
                </label>

                <select
                  id="patient"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="">
                    Selecione o paciente
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {patient.first_name}{" "}
                      {patient.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Título da avaliação
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Ex.: Avaliação inicial"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="game_id"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Jogo
                </label>

                <select
                  id="game_id"
                  name="game_id"
                  value={form.game_id}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                >
                  <option value="CUT_THE_CAKE">
                    Cut the Cake
                  </option>
                </select>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-700">
                  Status inicial
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  A avaliação será criada como
                  pendente e ficará disponível para o
                  paciente.
                </p>
              </div>

              {patients.length === 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  Nenhum paciente cadastrado. Cadastre
                  um paciente antes de criar uma
                  avaliação.
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
                  disabled={
                    salvando ||
                    patients.length === 0
                  }
                  className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {salvando
                    ? "Criando..."
                    : "Criar avaliação"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default CreateTraining;