import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { API_URL } from "../config";

function PatientTrainings() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarTreinos() {
      try {
        setErro("");
        setCarregando(true);

        const response = await fetch(
          `${API_URL}/trainings/`
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
              "Erro ao carregar avaliações."
          );
        }

        const trainingsFiltrados = data.filter(
          (training) =>
            training.patient === Number(patientId)
        );

        setTrainings(trainingsFiltrados);
      } catch (error) {
        setErro(
          error.message ||
            "Erro ao carregar avaliações."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarTreinos();
  }, [patientId]);

  function sair() {
    localStorage.removeItem("patient");
    navigate("/paciente/login");
  }

  function traduzirStatus(status) {
    const statusMap = {
      PENDING: "Pendente",
      IN_PROGRESS: "Em andamento",
      COMPLETED: "Concluída",
    };

    return statusMap[status] || status;
  }

  function statusClass(status) {
    if (status === "COMPLETED") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "IN_PROGRESS") {
      return "bg-amber-100 text-amber-700";
    }

    return "bg-slate-100 text-slate-700";
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Minhas avaliações
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Escolha uma avaliação para começar.
            </p>
          </div>

          <button
            type="button"
            onClick={sair}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:w-auto"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {carregando && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-600" />

            <p className="mt-4 text-slate-500">
              Carregando avaliações...
            </p>
          </div>
        )}

        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          trainings.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                🧠
              </div>

              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                Nenhuma avaliação disponível
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Quando o psicólogo lançar uma avaliação,
                ela aparecerá nesta tela.
              </p>
            </div>
          )}

        {!carregando &&
          !erro &&
          trainings.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trainings.map((training) => (
                <article
                  key={training.id}
                  className="flex flex-col rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                      🎮
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        training.status
                      )}`}
                    >
                      {traduzirStatus(training.status)}
                    </span>
                  </div>

                  <div className="mt-5 flex-1">
                    <h2 className="break-words text-lg font-semibold text-slate-900 sm:text-xl">
                      {training.title}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      Jogo: {training.game_id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Avaliação #{training.id}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/jogo/${patientId}?game=${encodeURIComponent(
                          training.game_id
                        )}&training=${training.id}`
                      )
                    }
                    disabled={
                      training.status === "COMPLETED"
                    }
                    className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {training.status === "COMPLETED"
                      ? "Avaliação concluída"
                      : training.status === "IN_PROGRESS"
                        ? "Continuar avaliação"
                        : "Iniciar avaliação"}
                  </button>
                </article>
              ))}
            </div>
          )}
      </section>
    </main>
  );
}

export default PatientTrainings;