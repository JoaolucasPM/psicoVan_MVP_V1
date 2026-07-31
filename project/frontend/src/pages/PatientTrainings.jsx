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
        const response = await fetch(
          `${API_URL}/trainings/`,
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar avaliações.");
        }

        const data = await response.json();

        const filtrados = data.filter(
          (training) => training.patient === Number(patientId)
        );

        setTrainings(filtrados);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarTreinos();
  }, [patientId]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">
          Carregando avaliações...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Minhas avaliações
        </h1>

        {erro && (
          <div className="mt-6 rounded-xl bg-red-100 p-4 text-red-700">
            {erro}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {trainings.map((training) => (
            <div
              key={training.id}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-slate-900">
                {training.title}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Status: {training.status}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/jogo/${patientId}?game=${training.game_id}&training=${training.id}`
                  )
                }
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
              >
                Iniciar avaliação
              </button>
            </div>
          ))}

          {trainings.length === 0 && !erro && (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
              Nenhuma avaliação disponível.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default PatientTrainings;