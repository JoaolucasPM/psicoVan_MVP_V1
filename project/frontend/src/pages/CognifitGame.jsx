import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CognifitSdk } from "@cognifit/launcher-js-sdk";
import { CognifitSdkConfig } from "@cognifit/launcher-js-sdk/lib/lib/cognifit.sdk.config";
import { API_URL } from "../config";


function CognifitGame() {
  const { patientId } = useParams();

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function startGame() {
      try {
        const response = await fetch(
          `${API_URL}/cognifit/games/start/`,
          
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              patient_id: Number(patientId),
              game_id: "CUT_THE_CAKE",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.detail ||
              data.error ||
              JSON.stringify(data)
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

        sdk.start("GAME", data.game_id).subscribe({
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
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    }

    startGame();
  }, [patientId]);

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