import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CognifitSdk } from "@cognifit/launcher-js-sdk";
import { CognifitSdkConfig } from "@cognifit/launcher-js-sdk/lib/lib/cognifit.sdk.config";

import { API_URL } from "../config";

function CognifitGame() {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();

  const gameId = searchParams.get("game") || "CUT_THE_CAKE";

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

        console.log("STATUS COGNIFIT:", response.status);
        console.log("RESPOSTA COGNIFIT:", texto);

        let data = {};

        if (texto) {
          try {
            data = JSON.parse(texto);
          } catch {
            if (!response.ok) {
              throw new Error(
                `Erro ${response.status} no backend. Verifique os logs do Render.`
              );
            }

            throw new Error(
              "O backend retornou uma resposta que não é JSON."
            );
          }
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.detail ||
              data.errorMessage ||
              JSON.stringify(data)
          );
        }

        if (!data.client_id || !data.access_token || !data.game_id) {
          throw new Error(
            "O backend não retornou client_id, access_token ou game_id."
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

        subscription = sdk.start("GAME", data.game_id).subscribe({
          next: (result) => {
            console.log("RESPOSTA DO JOGO:", result);
          },

          error: (error) => {
            console.error("ERRO NO JOGO:", error);
            setErro("Erro durante a execução do jogo.");
          },

          complete: () => {
            console.log("JOGO FINALIZADO");
          },
        });
      } catch (error) {
        console.error("ERRO AO INICIAR:", error);
        setErro(error.message || "Erro ao iniciar avaliação.");
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
  }, [patientId, gameId]);

  return (
    <main className="min-h-screen bg-slate-950">
      {carregando && (
        <div className="flex min-h-screen items-center justify-center text-white">
          Carregando jogo...
        </div>
      )}

      {erro && (
        <div className="mx-auto max-w-3xl p-6">
          <div className="rounded-xl bg-red-100 p-4 text-red-700">
            {erro}
          </div>
        </div>
      )}

      <div
        id="containerHTML"
        className={carregando || erro ? "hidden" : "block"}
        style={{
          width: "100%",
          height: "100vh",
        }}
      />
    </main>
  );
}

export default CognifitGame;