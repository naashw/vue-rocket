// crée une classe pour les requêtes de l'API Virtual Tour

import { VirtualTour, VirtualTourRoomPosition } from "~/types/virtualTour.type";

interface virtualTourProps {
    virtualTourId: string;
}


    export async function fetchVirtualTourById(virtualTourId: string): Promise<VirtualTour> {
    try {
        const virtualTourRoomId = virtualTourId; // TODO : Remplacez par l'identifiant de la pièce
        const virtualTour: VirtualTour = await $fetch(
            `virtualTour/id/${virtualTourRoomId}`,
            {
                method: "GET",
                baseURL: "http://localhost:3001/",
            },
        );

        return virtualTour;
    } catch (error) {
        throw new Error("Erreur lors de la récupération des données");
    }
}


    export async function saveVirtualTourRoomPositions(virtualTourData: VirtualTourRoomPosition[], virtualTourId: string): Promise<void> {
    if (!virtualTourData.length) {
        return;
    }

    try {
        await $fetch(`virtualTourRoom/${virtualTourId}/positions`, {
            method: "POST",
            body: virtualTourData,
            baseURL: "http://localhost:3001/",
        });
    } catch (error) {
        throw new Error("Erreur lors de l'envoi des données");
    }
}
