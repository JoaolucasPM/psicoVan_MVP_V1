import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Patients() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarPacientes() {
      try {
        const response = await fetch(
          `${API_URL}/patients/`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Erro ao carregar pacientes.");
        }

        setPatients(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarPacientes();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Pacientes
            </h1>

            <p className="text-sm text-slate-500">
              Cadastre pacientes e gerencie avaliações.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/avaliacoes/nova")}
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Nova avaliação
            </button>

            <button
              onClick={() => navigate("/pacientes/novo")}
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Novo paciente
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-8">
        {carregando && (
          <p className="text-slate-500">
            Carregando pacientes...
          </p>
        )}

        {erro && (
          <div className="rounded-xl bg-red-100 p-4 text-red-700">
            {erro}
          </div>
        )}

        {!carregando && !erro && patients.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            Nenhum paciente cadastrado.
          </div>
        )}

        {!carregando && !erro && patients.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    Nome
                  </th>

                  <th className="px-6 py-4 text-left">
                    E-mail
                  </th>

                  <th className="px-6 py-4 text-left">
                    Nascimento
                  </th>

                  <th className="px-6 py-4 text-right">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {patients.map((patient) => (
                  <tr key={patient.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {patient.first_name} {patient.last_name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {patient.email}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {patient.birthday}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(
                            `/paciente/${patient.id}/avaliacoes`
                          )
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
                      >
                        Ver avaliações
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Patients;