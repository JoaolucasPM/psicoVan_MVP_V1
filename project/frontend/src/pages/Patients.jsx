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
        setCarregando(false);
      }
    }

    carregarPacientes();
  }, []);

  function sair() {
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Pacientes
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Cadastre pacientes e gerencie avaliações.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:flex">
            <button
              type="button"
              onClick={() =>
                navigate("/avaliacoes/nova")
              }
              className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Nova avaliação
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/pacientes/novo")
              }
              className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Novo paciente
            </button>

            <button
              type="button"
              onClick={sair}
              className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {carregando && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-slate-500">
              Carregando pacientes...
            </p>
          </div>
        )}

        {erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          patients.length === 0 && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                👤
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                Nenhum paciente cadastrado
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Cadastre o primeiro paciente para começar.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/pacientes/novo")
                }
                className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >
                Cadastrar paciente
              </button>
            </div>
          )}

        {!carregando &&
          !erro &&
          patients.length > 0 && (
            <>
              <div className="space-y-4 md:hidden">
                {patients.map((patient) => (
                  <article
                    key={patient.id}
                    className="rounded-2xl bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
                        {patient.first_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h2 className="break-words font-semibold text-slate-900">
                          {patient.first_name}{" "}
                          {patient.last_name}
                        </h2>

                        <p className="mt-1 break-all text-sm text-slate-500">
                          {patient.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Data de nascimento
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {patient.birthday}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/paciente/${patient.id}/avaliacoes`
                        )
                      }
                      className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
                    >
                      Ver avaliações
                    </button>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                          Nome
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                          E-mail
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                          Nascimento
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {patients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900">
                            {patient.first_name}{" "}
                            {patient.last_name}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {patient.email}
                          </td>

                          <td className="px-6 py-4 text-slate-600">
                            {patient.birthday}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/paciente/${patient.id}/avaliacoes`
                                )
                              }
                              className="rounded-xl bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700"
                            >
                              Ver avaliações
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
      </section>
    </main>
  );
}

export default Patients;