import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { CognifitSdk } from "@cognifit/launcher-js-sdk";
import { CognifitSdkConfig } from "@cognifit/launcher-js-sdk/lib/lib/cognifit.sdk.config";

import { API_URL } from "../config";

function CognifitGame() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();

  const gameId =
    searchParams.get("game") || "CUT_THE_CAKE";

  const trainingId = searchParams.get("training");

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let subscription;

    async function startGame() {
      try {
        setErro("");
        setCarregando(true);

        const response = await fetch(
          `${API_URL}/cognifit/games/start/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patient_id: Number(patientId),
              game_id: gameId,
            }),
          }
        );

        const texto = await response.text();

        let data;

        try {
          data = JSON.parse(texto);
        } catch {
          throw new Error(
            `O backend retornou uma resposta inválida. Status ${response.status}.`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.detail ||
              data.errorMessage ||
              "Erro ao iniciar a avaliação."
          );
        }

        if (
          !data.client_id ||
          !data.access_token ||
          !data.game_id
        ) {
          throw new Error(
            "O backend não retornou os dados necessários para iniciar o jogo."
          );
        }

        const config = new CognifitSdkConfig(
          "containerHTML",
          data.client_id,
          data.access_token,
          {
            appType: "web",
            theme: "dark",
            showResults: true,
            listenEvents: true,
          }
        );

        const sdk = new CognifitSdk();

        await sdk.init(config);

        subscription = sdk
          .start("GAME", data.game_id)
          .subscribe({
            next: (result) => {
              console.log(
                "RESPOSTA DO JOGO:",
                result
              );
            },

            error: (error) => {
              console.error(
                "ERRO NO JOGO:",
                error
              );

              setErro(
                "Ocorreu um erro durante a avaliação."
              );
            },

            complete: () => {
              console.log("JOGO FINALIZADO");

              navigate(
                `/paciente/${patientId}/avaliacoes`
              );
            },
          });
      } catch (error) {
        console.error(
          "ERRO AO INICIAR:",
          error
        );

        setErro(
          error.message ||
            "Erro ao iniciar avaliação."
        );
      } finally {
        setCarregando(false);
      }
    }

    startGame();

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [
    patientId,
    gameId,
    trainingId,
    navigate,
  ]);

  return (
    <main className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-lg font-bold text-white sm:text-xl">
              Avaliação cognitiva
            </h1>

            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Jogo: {gameId}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/paciente/${patientId}/avaliacoes`
              )
            }
            className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 md:w-auto"
          >
            Voltar às avaliações
          </button>
        </div>
      </header>

      {carregando && (
        <section className="flex min-h-[calc(100vh-90px)] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-500" />

            <p className="mt-4 text-sm text-slate-300 sm:text-base">
              Carregando avaliação...
            </p>
          </div>
        </section>
      )}

      {erro && (
        <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-200">
            <h2 className="font-semibold">
              Não foi possível iniciar
            </h2>

            <p className="mt-2 break-words text-sm leading-6">
              {erro}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 sm:w-auto"
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )}

      <section
        className={
          carregando || erro
            ? "hidden"
            : "block"
        }
      >
        <div
          id="containerHTML"
          className="h-[calc(100vh-90px)] min-h-[600px] w-full overflow-hidden bg-black"
        />
      </section>
    </main>
  );
}

export default CognifitGame;