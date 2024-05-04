export interface VirtualTour {
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
    id: string;
    virtualTourId: string;
    virtualTourRoom: VirtualTourRoom[];
}

export interface VirtualTourRoom {
    virtualTourId: string;
    id: string;
    name: string;
    pictures: VirtualTourPicture[];
    positions: VirtualTourRoomPosition[];
}

export interface VirtualTourPicture {
    id: string;
    virtualTourRoomId: string;
    filePath: string;
    filename: string;
}

export interface VirtualTourRoomPosition {
    time: Date;
    virtualTourRoomId: string;
    position: {
        yaw: number;
        pitch: number;
        zoom: number;
    };
}

export interface VirtualTourDataItem {
    time: Date;
    virtualTourRoomId: string;
    yaw: number;
    pitch: number;
    zoom: number;
}
