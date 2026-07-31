import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function CreateTraining() {
  const navigate = useNavigate();

  const usuarioSalvo = localStorage.getItem("usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  const [patients, setPatients] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    title: "",
    game_id: "CUT_THE_CAKE",
    status: "PENDING",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function carregarPacientes() {
      try {
        const response = await fetch(
           `${API_URL}/patients/`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Erro ao carregar pacientes.");
        }

        setPatients(data);
      } catch (error) {
        setErro(error.message);
      }
    }

    carregarPacientes();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!usuario?.id) {
      setErro("Psicólogo não encontrado. Faça login novamente.");
      return;
    }

    setErro("");
    setCarregando(true);

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
            title: form.title,
            game_id: form.game_id,
            status: form.status,
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

        throw new Error(mensagem || "Erro ao criar avaliação.");
      }

      navigate("/pacientes");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-700 via-violet-700 to-cyan-600 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Nova avaliação
        </h1>

        <p className="mt-2 text-slate-500">
          Vincule uma avaliação a um paciente.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Paciente
            </label>

            <select
              name="patient"
              value={form.patient}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="">Selecione o paciente</option>

              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Título
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex.: Avaliação inicial"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Jogo
            </label>

            <select
              name="game_id"
              value={form.game_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="CUT_THE_CAKE">
                Cut the Cake
              </option>
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
              {carregando ? "Criando..." : "Criar avaliação"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CreateTraining;