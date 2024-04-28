import { RandomId } from "~/types/randomId.type";

export async function getRandomVirtualTourId(): Promise<RandomId> {
    try {
        const randomId: { key: string; checksum: string } = await $fetch(
            "virtualTour/id",
            {
                method: "GET",
                baseURL: "http://localhost:3001/",
                retry: 3,
                retryDelay: 1000,
            },
        );

        console.log("Données récupéré avec succès");
        console.log("randomId : ", randomId);
        return randomId;

    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'id unique : ${error}`);
    }
}
